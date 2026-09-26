use rusqlite::{params, Connection, OptionalExtension};
use serde::{Deserialize, Serialize};
use std::{fs, path::Path, sync::{atomic::{AtomicBool, Ordering}, Mutex}};
use tauri::{AppHandle, Manager, State, WebviewWindow};
use tauri_plugin_global_shortcut::{GlobalShortcutExt, ShortcutState};

mod advisor;
mod updater;

const MIGRATION_1: &str = include_str!("../migrations/001_initial.sql");
const MIGRATION_2: &str = include_str!("../migrations/002_seed.sql");

#[derive(Debug, thiserror::Error)]
enum AppError {
    #[error("database error: {0}")]
    Database(#[from] rusqlite::Error),
    #[error("I/O error: {0}")]
    Io(#[from] std::io::Error),
    #[error("application data directory is unavailable")]
    MissingDataDirectory,
}

impl Serialize for AppError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where S: serde::Serializer {
        serializer.serialize_str(&self.to_string())
    }
}

struct Database(Mutex<Connection>);
struct OverlayState(AtomicBool);

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
struct Profile {
    class_name: String,
    faction: String,
    server: String,
    current_gs: i64,
    current_level: i64,
    pvp_enabled: bool,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct RoadmapStep {
    id: i64,
    title: String,
    description: String,
    min_gs: i64,
    max_gs: i64,
    actions: Vec<RoadmapAction>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct RoadmapAction {
    id: i64,
    title: String,
    priority: String,
    explanation: String,
    source_status: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct ChecklistItem {
    id: i64,
    name: String,
    cadence: String,
    limit: i64,
    completed: i64,
    reward: String,
    reason: String,
    priority: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct TrackedItem {
    id: i64,
    name_ru: String,
    name_en: String,
    obtained: bool,
    enhancement: i64,
    favorite: bool,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct Bootstrap {
    profile: Profile,
    roadmap: RoadmapStep,
    checklist: Vec<ChecklistItem>,
    items: Vec<TrackedItem>,
    database_version: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct SearchResult {
    entity_type: String,
    entity_id: i64,
    name_ru: String,
    name_en: String,
    details: String,
    localization_status: String,
    source_status: String,
}

fn migrate(connection: &mut Connection) -> Result<(), AppError> {
    connection.execute_batch(MIGRATION_1)?;
    let version: Option<i64> = connection
        .query_row("SELECT MAX(version) FROM schema_migrations", [], |r| r.get(0))
        .optional()?
        .flatten();
    if version.unwrap_or(0) < 2 {
        let transaction = connection.transaction()?;
        transaction.execute_batch(MIGRATION_2)?;
        transaction.execute(
            "INSERT OR REPLACE INTO schema_migrations(version, applied_at) VALUES(2, ?1)",
            [chrono::Utc::now().to_rfc3339()],
        )?;
        transaction.commit()?;
    }
    Ok(())
}

fn open_database(path: &Path) -> Result<Connection, AppError> {
    let mut connection = Connection::open(path)?;
    connection.pragma_update(None, "journal_mode", "WAL")?;
    connection.pragma_update(None, "foreign_keys", "ON")?;
    migrate(&mut connection)?;
    Ok(connection)
}

#[tauri::command]
fn get_bootstrap(database: State<'_, Database>) -> Result<Bootstrap, AppError> {
    let connection = database.0.lock().expect("database mutex poisoned");
    let profile = connection.query_row(
        "SELECT class,faction,server,current_gs,current_level,pvp_enabled FROM user_profile WHERE id=1",
        [],
        |row| Ok(Profile {
            class_name: row.get(0)?, faction: row.get(1)?, server: row.get(2)?, current_gs: row.get(3)?, current_level: row.get(4)?, pvp_enabled: row.get::<_, i64>(5)? != 0,
        }),
    )?;
    let mut roadmap = load_roadmap(&connection, profile.current_gs)?;
    let midgame_weapon_obtained: bool = connection.query_row("SELECT obtained FROM user_items WHERE item_id=3", [], |row| row.get::<_, i64>(0))? != 0;
    if midgame_weapon_obtained && roadmap.id == 1 {
        roadmap.actions.insert(0, RoadmapAction { id: -1, title: "✓ Оружие midgame закрыто → приоритет Guard".into(), priority: "S".into(), explanation: "Книга Ауламуса отмечена как полученная, поэтому второй промежуточный weapon больше не является приоритетом.".into(), source_status: "local_profile".into() });
    }
    let mut checklist_stmt = connection.prepare(
        "SELECT a.id,a.name_ru,a.cadence,COALESCE(a.daily_limit,a.weekly_limit,1),COALESCE(c.completion_count,0),COALESCE(a.reward,''),COALESCE(a.reason,''),a.priority FROM activities a LEFT JOIN user_checklist c ON c.activity_id=a.id ORDER BY CASE a.cadence WHEN 'daily' THEN 0 ELSE 1 END,a.priority,a.id"
    )?;
    let checklist = checklist_stmt.query_map([], |row| Ok(ChecklistItem { id: row.get(0)?, name: row.get(1)?, cadence: row.get(2)?, limit: row.get(3)?, completed: row.get(4)?, reward: row.get(5)?, reason: row.get(6)?, priority: row.get(7)? }))?.collect::<Result<Vec<_>,_>>()?;
    let mut item_stmt = connection.prepare("SELECT i.id,i.name_ru,i.name_en,u.obtained,u.enhancement,u.favorite FROM items i JOIN user_items u ON u.item_id=i.id ORDER BY u.favorite DESC,i.id")?;
    let items = item_stmt.query_map([], |row| Ok(TrackedItem { id: row.get(0)?, name_ru: row.get(1)?, name_en: row.get(2)?, obtained: row.get::<_,i64>(3)? != 0, enhancement: row.get(4)?, favorite: row.get::<_,i64>(5)? != 0 }))?.collect::<Result<Vec<_>,_>>()?;
    Ok(Bootstrap { profile, roadmap, checklist, items, database_version: "research-preview-2026-09-27".into() })
}

fn load_roadmap(connection: &Connection, gs: i64) -> Result<RoadmapStep, rusqlite::Error> {
    let (id,title,description,min_gs,max_gs) = connection.query_row(
        "SELECT id,title_ru,description_ru,min_gs,max_gs FROM roadmap_steps WHERE ?1 BETWEEN min_gs AND max_gs ORDER BY order_index LIMIT 1",
        [gs], |r| Ok((r.get::<_,i64>(0)?,r.get::<_,String>(1)?,r.get::<_,String>(2)?,r.get::<_,i64>(3)?,r.get::<_,i64>(4)?)))?;
    let mut statement = connection.prepare("SELECT id,title_ru,priority,explanation,source_status FROM roadmap_actions WHERE roadmap_step_id=?1 ORDER BY CASE priority WHEN 'S' THEN 0 WHEN 'A' THEN 1 ELSE 2 END,id")?;
    let actions = statement.query_map([id], |row| Ok(RoadmapAction { id: row.get(0)?, title: row.get(1)?, priority: row.get(2)?, explanation: row.get(3)?, source_status: row.get(4)? }))?.collect::<Result<Vec<_>,_>>()?;
    Ok(RoadmapStep { id, title, description, min_gs, max_gs, actions })
}

#[tauri::command]
fn save_profile(database: State<'_, Database>, profile: Profile) -> Result<Bootstrap, AppError> {
    let connection = database.0.lock().expect("database mutex poisoned");
    connection.execute("UPDATE user_profile SET class=?1,faction=?2,server=?3,current_gs=?4,current_level=?5,pvp_enabled=?6 WHERE id=1", params![profile.class_name,profile.faction,profile.server,profile.current_gs,profile.current_level,profile.pvp_enabled as i64])?;
    drop(connection);
    get_bootstrap(database)
}

#[tauri::command]
fn set_item_state(database: State<'_, Database>, advisor_database: State<'_, advisor::AdvisorDatabase>, item_id: i64, obtained: bool, favorite: bool, enhancement: i64) -> Result<Bootstrap, AppError> {
    let connection = database.0.lock().expect("database mutex poisoned");
    connection.execute("UPDATE user_items SET obtained=?2,favorite=?3,enhancement=?4 WHERE item_id=?1", params![item_id,obtained as i64,favorite as i64,enhancement])?;
    drop(connection);
    advisor::sync_active_item(&advisor_database.0.lock().expect("advisor database mutex poisoned"),item_id,obtained,enhancement)?;
    get_bootstrap(database)
}

#[tauri::command]
fn set_checklist_count(database: State<'_, Database>, advisor_database: State<'_, advisor::AdvisorDatabase>, activity_id: i64, count: i64) -> Result<Bootstrap, AppError> {
    let connection = database.0.lock().expect("database mutex poisoned");
    connection.execute("UPDATE user_checklist SET completion_count=?2,reset_at=?3 WHERE activity_id=?1", params![activity_id,count,chrono::Utc::now().to_rfc3339()])?;
    drop(connection);
    advisor::sync_active_checklist(&advisor_database.0.lock().expect("advisor database mutex poisoned"),activity_id,count)?;
    get_bootstrap(database)
}

fn search_like(connection: &Connection, needle: &str, limit: i64) -> Result<Vec<SearchResult>, rusqlite::Error> {
    let pattern = format!("%{}%", needle.to_lowercase());
    let mut stmt = connection.prepare("SELECT entity_type,entity_id,name_ru,name_en,details FROM search_index WHERE lower(name_ru) LIKE ?1 OR lower(name_en) LIKE ?1 OR lower(aliases) LIKE ?1 ORDER BY CASE WHEN lower(name_ru) LIKE ?2 THEN 0 ELSE 1 END,name_ru LIMIT ?3")?;
    let results = stmt.query_map(params![pattern, format!("{}%", needle.to_lowercase()), limit], |row| Ok(SearchResult { entity_type: row.get(0)?, entity_id: row.get(1)?, name_ru: row.get(2)?, name_en: row.get(3)?, details: row.get(4)?, localization_status: "community_ru".into(), source_status: "reference".into() }))?.collect();
    results
}

fn search_fts(connection: &Connection, needle: &str, limit: i64) -> Result<Vec<SearchResult>, rusqlite::Error> {
    let tokens = needle.split_whitespace().filter_map(|token| {
        let safe: String = token.chars().filter(|character| character.is_alphanumeric()).collect();
        (!safe.is_empty()).then(|| format!("{safe}*"))
    }).collect::<Vec<_>>().join(" ");
    if tokens.is_empty() { return Ok(Vec::new()); }
    let mut stmt = connection.prepare("SELECT entity_type,entity_id,name_ru,name_en,details FROM search_index WHERE search_index MATCH ?1 ORDER BY rank LIMIT ?2")?;
    let results = stmt.query_map(params![tokens, limit], |row| Ok(SearchResult { entity_type: row.get(0)?, entity_id: row.get(1)?, name_ru: row.get(2)?, name_en: row.get(3)?, details: row.get(4)?, localization_status: "community_ru".into(), source_status: "reference".into() }))?.collect();
    results
}

#[tauri::command]
fn search(database: State<'_, Database>, query: String, limit: Option<i64>) -> Result<Vec<SearchResult>, AppError> {
    let connection = database.0.lock().expect("database mutex poisoned");
    let trimmed = query.trim();
    if trimmed.is_empty() { return Ok(Vec::new()); }
    let command_query = trimmed.trim_start_matches('>').trim();
    let parts: Vec<&str> = command_query.split_whitespace().collect();
    let known_command = parts.first().copied().filter(|p| matches!(*p, "item"|"boss"|"dungeon"|"skill"));
    let needle = if known_command.is_some() { parts.get(1..).unwrap_or(&[]).join(" ") } else { command_query.to_string() };
    let requested_limit = limit.unwrap_or(20);
    let mut results = search_fts(&connection, &needle, requested_limit)?;
    if results.is_empty() { results = search_like(&connection, &needle, requested_limit)?; }
    if let Some(command) = known_command {
        let entity = match command { "dungeon" => "instance", other => other };
        results.retain(|item| item.entity_type == entity);
    }
    Ok(results)
}

#[tauri::command]
fn set_click_through(window: WebviewWindow, overlay_state: State<'_, OverlayState>, enabled: bool) -> Result<(), String> {
    window.set_ignore_cursor_events(enabled).map_err(|error| error.to_string())?;
    overlay_state.0.store(enabled, Ordering::Relaxed);
    Ok(())
}

#[tauri::command]
fn get_advisor_bundle(database: State<'_, advisor::AdvisorDatabase>) -> Result<serde_json::Value, AppError> {
    let connection=database.0.lock().expect("advisor database mutex poisoned");
    Ok(advisor::bundle(&connection)?)
}

#[tauri::command]
fn save_character(database: State<'_, advisor::AdvisorDatabase>, character: serde_json::Value) -> Result<serde_json::Value, AppError> {
    let connection=database.0.lock().expect("advisor database mutex poisoned");advisor::save_character(&connection,&character)?;Ok(advisor::bundle(&connection)?)
}

#[tauri::command]
fn create_character(database: State<'_, advisor::AdvisorDatabase>, class_id:String) -> Result<serde_json::Value, AppError> {
    let connection=database.0.lock().expect("advisor database mutex poisoned");advisor::create_character(&connection,&class_id)?;Ok(advisor::bundle(&connection)?)
}

#[tauri::command]
fn set_active_character(database: State<'_, advisor::AdvisorDatabase>, character_id:i64) -> Result<serde_json::Value, AppError> {
    let connection=database.0.lock().expect("advisor database mutex poisoned");advisor::activate(&connection,character_id)?;Ok(advisor::bundle(&connection)?)
}

#[tauri::command]
fn check_data_updates(database: State<'_, advisor::AdvisorDatabase>, provider_id:Option<String>) -> Result<serde_json::Value, AppError> {
    let connection=database.0.lock().expect("advisor database mutex poisoned");advisor::check_updates(&connection,provider_id.as_deref())?;Ok(advisor::bundle(&connection)?)
}

fn toggle_window(app: &AppHandle, label: &str, focus: bool) {
    if let Some(window) = app.get_webview_window(label) {
        if window.is_visible().unwrap_or(false) {
            let _ = window.hide();
        } else {
            let _ = window.show();
            if focus { let _ = window.set_focus(); }
        }
    }
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, _, _| toggle_window(app, "main", true)))
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .plugin(tauri_plugin_global_shortcut::Builder::new().with_handler(|app, shortcut, event| {
            if event.state() != ShortcutState::Pressed { return; }
            match shortcut.to_string().as_str() {
                "Alt+KeyQ" | "Alt+Q" => toggle_window(app, "main", true),
                "Alt+Shift+KeyQ" | "Alt+Shift+Q" => toggle_window(app, "compact", true),
                "Alt+Space" => toggle_window(app, "quick-search", true),
                "Alt+Shift+KeyL" | "Alt+Shift+L" => {
                    let overlay_state = app.state::<OverlayState>();
                    let enabled = !overlay_state.0.load(Ordering::Relaxed);
                    if let Some(window) = app.get_webview_window("compact") {
                        if window.set_ignore_cursor_events(enabled).is_ok() { overlay_state.0.store(enabled, Ordering::Relaxed); }
                    }
                },
                _ => {}
            }
        }).build())
        .setup(|app| {
            let data_dir = app.path().app_data_dir().map_err(|_| AppError::MissingDataDirectory)?;
            fs::create_dir_all(&data_dir)?;
            app.manage(Database(Mutex::new(open_database(&data_dir.join("companion.db"))?)));
            let advisor_database=advisor::open(&data_dir).map_err(|error| std::io::Error::other(error.to_string()))?;
            app.manage(advisor_database);
            app.manage(OverlayState(AtomicBool::new(false)));
            for shortcut in ["Alt+Q", "Alt+Shift+Q", "Alt+Space", "Alt+Shift+L"] {
                if let Err(error) = app.global_shortcut().register(shortcut) { eprintln!("Cannot register {shortcut}: {error}"); }
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_bootstrap,get_advisor_bundle,save_profile,set_item_state,set_checklist_count,search,set_click_through,save_character,create_character,set_active_character,check_data_updates])
        .run(tauri::generate_context!())
        .expect("failed to run AION 2 Companion");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn migrations_seed_searchable_data() {
        let mut connection = Connection::open_in_memory().unwrap();
        migrate(&mut connection).unwrap();
        let results = search_like(&connection, "кром", 10).unwrap();
        assert!(results.iter().any(|result| result.name_en.contains("Kromede")));
    }

    #[test]
    fn roadmap_changes_at_checkpoint() {
        let mut connection = Connection::open_in_memory().unwrap();
        migrate(&mut connection).unwrap();
        assert_eq!(load_roadmap(&connection, 1180).unwrap().id, 1);
        assert_eq!(load_roadmap(&connection, 1850).unwrap().id, 3);
    }
}
