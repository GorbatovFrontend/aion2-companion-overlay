use chrono::Utc;
use rusqlite::{params, Connection, OptionalExtension};
use serde_json::{json, Map, Value};
use std::{fs, path::Path, sync::Mutex};

const REFERENCE_SCHEMA: &str = include_str!("../migrations/reference/001_reference.sql");
const REFERENCE_SEED: &str = include_str!("../migrations/reference/002_seed_advisor.sql");
const USER_SCHEMA: &str = include_str!("../migrations/user/001_user.sql");

pub(crate) struct AdvisorDatabase(pub(crate) Mutex<Connection>);

pub(crate) fn open(data_dir: &Path) -> Result<AdvisorDatabase, Box<dyn std::error::Error>> {
    fs::create_dir_all(data_dir)?;
    let reference_path = data_dir.join("reference.db");
    let user_path = data_dir.join("user.db");
    let mut connection = Connection::open(reference_path)?;
    connection.pragma_update(None, "journal_mode", "WAL")?;
    connection.pragma_update(None, "foreign_keys", "ON")?;
    connection.execute_batch(REFERENCE_SCHEMA)?;
    connection.execute_batch(REFERENCE_SEED)?;
    connection.execute("INSERT OR IGNORE INTO schema_migrations VALUES(2,?1)", [Utc::now().to_rfc3339()])?;
    connection.execute("ATTACH DATABASE ?1 AS user", [user_path.to_string_lossy().as_ref()])?;
    connection.execute_batch(USER_SCHEMA)?;
    connection.execute("INSERT OR IGNORE INTO user.schema_migrations VALUES(1,?1)", [Utc::now().to_rfc3339()])?;
    seed_or_migrate_user(&mut connection, &data_dir.join("companion.db"))?;
    Ok(AdvisorDatabase(Mutex::new(connection)))
}

fn seed_or_migrate_user(connection: &mut Connection, legacy_path: &Path) -> rusqlite::Result<()> {
    let count: i64 = connection.query_row("SELECT COUNT(*) FROM user.characters", [], |row| row.get(0))?;
    if count > 0 { return Ok(()); }
    let mut class_id = "sorcerer".to_string(); let mut level = 45_i64; let mut gs = 1180_i64; let mut server = String::new(); let mut faction = String::new();
    if legacy_path.exists() {
        if let Ok(legacy) = Connection::open(legacy_path) {
            if let Ok(Some((class_name, old_faction, old_server, old_gs, old_level))) = legacy.query_row("SELECT class,faction,server,current_gs,current_level FROM user_profile WHERE id=1", [], |row| Ok((row.get::<_,String>(0)?,row.get::<_,String>(1)?,row.get::<_,String>(2)?,row.get::<_,i64>(3)?,row.get::<_,i64>(4)?))).optional() {
                class_id = match class_name.as_str() { "Храмовник"=>"templar","Гладиатор"=>"gladiator","Убийца"=>"assassin","Стрелок"=>"ranger","Заклинатель"=>"spiritmaster","Целитель"=>"cleric","Чародей"=>"chanter",_=>"sorcerer" }.into();
                faction=old_faction; server=old_server; gs=old_gs; level=old_level;
            }
        }
    }
    let now=Utc::now().to_rfc3339();
    connection.execute("INSERT INTO user.characters(name,class_id,server,faction,current_level,current_gs,primary_mode,play_context,active_build_id,pvp_enabled,is_active,created_at,updated_at) VALUES('Основной',?1,?2,?3,?4,?5,'pve','solo',?6,1,1,?7,?7)",params![class_id,server,faction,level,gs,if class_id=="sorcerer"{Some("sorcerer-pve")}else{None},now])?;
    let character_id=connection.last_insert_rowid();
    connection.execute("INSERT OR IGNORE INTO user.character_items(character_id,item_id) SELECT ?1,id FROM items",[character_id])?;
    connection.execute("INSERT OR IGNORE INTO user.character_skills(character_id,skill_id,current_level) VALUES(?1,1,7)",[character_id])?;
    connection.execute("INSERT OR IGNORE INTO user.character_systems VALUES(?1,'arcana','{\"filledSlots\":3}',0)",[character_id])?;
    connection.execute("INSERT OR IGNORE INTO user.character_systems VALUES(?1,'theostone','{\"installed\":false}',0)",[character_id])?;
    connection.execute("INSERT OR IGNORE INTO user.character_checklist(character_id,activity_id) SELECT ?1,id FROM activities",[character_id])?;
    Ok(())
}

fn character_json(connection:&Connection,id:i64)->rusqlite::Result<Value>{
    let mut value=connection.query_row("SELECT c.id,c.name,c.class_id,cl.name_ru,c.server,c.faction,c.current_level,c.current_gs,c.primary_mode,c.play_context,c.active_build_id FROM user.characters c JOIN classes cl ON cl.id=c.class_id WHERE c.id=?1",[id],|row|Ok(json!({"id":row.get::<_,i64>(0)?,"name":row.get::<_,String>(1)?,"classId":row.get::<_,String>(2)?,"className":row.get::<_,String>(3)?,"server":row.get::<_,String>(4)?,"faction":row.get::<_,String>(5)?,"currentLevel":row.get::<_,i64>(6)?,"currentGs":row.get::<_,i64>(7)?,"primaryMode":row.get::<_,String>(8)?,"playContext":row.get::<_,String>(9)?,"activeBuildId":row.get::<_,Option<String>>(10)?})))?;
    let mut items=Map::new(); let mut statement=connection.prepare("SELECT item_id,obtained,equipped,enhancement FROM user.character_items WHERE character_id=?1")?;
    for row in statement.query_map([id],|r|Ok((r.get::<_,i64>(0)?,r.get::<_,i64>(1)?,r.get::<_,i64>(2)?,r.get::<_,i64>(3)?)))? {let(row_id,obtained,equipped,enhancement)=row?;items.insert(row_id.to_string(),json!({"obtained":obtained!=0,"equipped":equipped!=0,"enhancement":enhancement}));}
    let mut skills=Map::new(); let mut statement=connection.prepare("SELECT s.slug,cs.current_level FROM user.character_skills cs JOIN skills s ON s.id=cs.skill_id WHERE cs.character_id=?1")?;
    for row in statement.query_map([id],|r|Ok((r.get::<_,String>(0)?,r.get::<_,i64>(1)?)))?{let(slug,level)=row?;skills.insert(slug,json!(level));}
    let mut systems=Map::new(); let mut statement=connection.prepare("SELECT system_slug,value_json FROM user.character_systems WHERE character_id=?1")?;
    for row in statement.query_map([id],|r|Ok((r.get::<_,String>(0)?,r.get::<_,String>(1)?)))?{let(slug,data)=row?;systems.insert(slug,serde_json::from_str(&data).unwrap_or_else(|_|json!({})));}
    let completeness=30+(if !items.is_empty(){15}else{0})+(if !skills.is_empty(){15}else{0})+(if !systems.is_empty(){15}else{0});
    if let Some(object)=value.as_object_mut(){object.insert("items".into(),Value::Object(items));object.insert("skills".into(),Value::Object(skills));object.insert("systems".into(),Value::Object(systems));object.insert("profileCompleteness".into(),json!(completeness));}
    Ok(value)
}

pub(crate) fn bundle(connection:&Connection)->rusqlite::Result<Value>{
    let active_id=connection.query_row("SELECT id FROM user.characters ORDER BY is_active DESC,id LIMIT 1",[],|r|r.get::<_,i64>(0))?;
    let mut characters=Vec::new();let mut stmt=connection.prepare("SELECT id FROM user.characters ORDER BY id")?;for row in stmt.query_map([],|r|r.get::<_,i64>(0))?{characters.push(character_json(connection,row?)?);}
    let mut classes=Vec::new();let mut stmt=connection.prepare("SELECT id,name_ru,name_en,role_ru,weapon_ru,damage_type_ru,mechanics_ru,strengths_ru,weaknesses_ru,region,patch,confidence,COALESCE(source_id,'unknown') FROM classes ORDER BY rowid")?;for row in stmt.query_map([],|r|Ok(json!({"id":r.get::<_,String>(0)?,"nameRu":r.get::<_,String>(1)?,"nameEn":r.get::<_,String>(2)?,"roleRu":r.get::<_,Option<String>>(3)?,"weaponRu":r.get::<_,Option<String>>(4)?,"damageTypeRu":r.get::<_,Option<String>>(5)?,"mechanicsRu":r.get::<_,Option<String>>(6)?,"strengthsRu":r.get::<_,Option<String>>(7)?,"weaknessesRu":r.get::<_,Option<String>>(8)?,"region":r.get::<_,String>(9)?,"patch":r.get::<_,String>(10)?,"confidence":r.get::<_,String>(11)?,"source":r.get::<_,String>(12)?})))?{classes.push(row?);}
    let mut builds=Vec::new();let mut stmt=connection.prepare("SELECT id,class_id,name_ru,name_en,mode,concept_ru,region,patch,confidence FROM class_builds ORDER BY rowid")?;for row in stmt.query_map([],|r|Ok((r.get::<_,String>(0)?,r.get::<_,String>(1)?,r.get::<_,String>(2)?,r.get::<_,String>(3)?,r.get::<_,String>(4)?,r.get::<_,String>(5)?,r.get::<_,String>(6)?,r.get::<_,String>(7)?,r.get::<_,String>(8)?)))?{let(id,class_id,name_ru,name_en,mode,concept,region,patch,confidence)=row?;let mut components=Vec::new();let mut cs=connection.prepare("SELECT id,component_type,target_id,label_ru,weight,required,stage,acquisition_ru,reason_ru,priority FROM build_components WHERE build_id=?1")?;for c in cs.query_map([&id],|r|Ok(json!({"id":r.get::<_,i64>(0)?,"componentType":r.get::<_,String>(1)?,"targetId":r.get::<_,String>(2)?,"labelRu":r.get::<_,String>(3)?,"weight":r.get::<_,f64>(4)?,"required":r.get::<_,i64>(5)?!=0,"stage":r.get::<_,String>(6)?,"acquisitionRu":r.get::<_,Option<String>>(7)?,"reasonRu":r.get::<_,Option<String>>(8)?,"priority":r.get::<_,String>(9)?})))?{components.push(c?)}let mut stats=Vec::new();let mut ss=connection.prepare("SELECT name_ru,order_index,explanation_ru,breakpoint,confirmed FROM stat_priorities WHERE build_id=?1 ORDER BY order_index")?;for s in ss.query_map([&id],|r|Ok(json!({"nameRu":r.get::<_,String>(0)?,"orderIndex":r.get::<_,i64>(1)?,"explanationRu":r.get::<_,String>(2)?,"breakpoint":r.get::<_,Option<String>>(3)?,"confirmed":r.get::<_,i64>(4)?!=0})))?{stats.push(s?)}builds.push(json!({"id":id,"classId":class_id,"nameRu":name_ru,"nameEn":name_en,"mode":mode,"conceptRu":concept,"region":region,"patch":patch,"confidence":confidence,"components":components,"stats":stats}));}
    let mut rules=Vec::new();let mut stmt=connection.prepare("SELECT id,class_id,build_id,conditions_json,recommendation_json,region,patch,confidence,COALESCE(source_id,'unknown') FROM recommendation_rules WHERE enabled=1")?;for row in stmt.query_map([],|r|Ok((r.get::<_,String>(0)?,r.get::<_,Option<String>>(1)?,r.get::<_,Option<String>>(2)?,r.get::<_,String>(3)?,r.get::<_,String>(4)?,r.get::<_,String>(5)?,r.get::<_,String>(6)?,r.get::<_,String>(7)?,r.get::<_,String>(8)?)))?{let(id,class_id,build_id,conditions,recommendation,region,patch,confidence,source)=row?;rules.push(json!({"id":id,"classId":class_id,"buildId":build_id,"conditions":serde_json::from_str::<Value>(&conditions).unwrap_or(json!({})),"recommendation":serde_json::from_str::<Value>(&recommendation).unwrap_or(json!({})),"region":region,"patch":patch,"confidence":confidence,"source":source}));}
    let mut providers=Vec::new();let mut stmt=connection.prepare("SELECT s.id,s.name,s.enabled,p.status,p.last_checked,p.last_success,p.source_version,p.error FROM sources s JOIN provider_versions p ON p.provider_id=s.id ORDER BY s.trust_priority DESC")?;for row in stmt.query_map([],|r|Ok(json!({"id":r.get::<_,String>(0)?,"name":r.get::<_,String>(1)?,"enabled":r.get::<_,i64>(2)?!=0,"status":r.get::<_,String>(3)?,"lastChecked":r.get::<_,Option<String>>(4)?,"lastSuccess":r.get::<_,Option<String>>(5)?,"version":r.get::<_,Option<String>>(6)?,"error":r.get::<_,Option<String>>(7)?})))?{providers.push(row?);}
    Ok(json!({"activeCharacter":character_json(connection,active_id)?,"characters":characters,"classes":classes,"builds":builds,"rules":rules,"providerStatuses":providers}))
}

pub(crate) fn save_character(connection:&Connection,character:&Value)->rusqlite::Result<()> {
    let id=character["id"].as_i64().unwrap_or(0);
    let transaction=connection.unchecked_transaction()?;
    transaction.execute("UPDATE user.characters SET name=?2,class_id=?3,server=?4,faction=?5,current_level=?6,current_gs=?7,primary_mode=?8,play_context=?9,active_build_id=?10,updated_at=?11 WHERE id=?1",params![id,character["name"].as_str().unwrap_or("Персонаж"),character["classId"].as_str().unwrap_or("sorcerer"),character["server"].as_str().unwrap_or(""),character["faction"].as_str().unwrap_or(""),character["currentLevel"].as_i64().unwrap_or(45),character["currentGs"].as_i64().unwrap_or(0),character["primaryMode"].as_str().unwrap_or("pve"),character["playContext"].as_str().unwrap_or("solo"),character["activeBuildId"].as_str(),Utc::now().to_rfc3339()])?;
    if let Some(skills)=character["skills"].as_object(){for(slug,level)in skills{transaction.execute("INSERT INTO user.character_skills(character_id,skill_id,current_level) SELECT ?1,id,?3 FROM skills WHERE slug=?2 ON CONFLICT(character_id,skill_id) DO UPDATE SET current_level=excluded.current_level",params![id,slug,level.as_i64().unwrap_or(0)])?;}}
    if let Some(items)=character["items"].as_object(){for(item_id,state)in items{if let Ok(item_id)=item_id.parse::<i64>(){transaction.execute("INSERT INTO user.character_items(character_id,item_id,obtained,equipped,enhancement) VALUES(?1,?2,?3,?4,?5) ON CONFLICT(character_id,item_id) DO UPDATE SET obtained=excluded.obtained,equipped=excluded.equipped,enhancement=excluded.enhancement",params![id,item_id,state["obtained"].as_bool().unwrap_or(false) as i64,state["equipped"].as_bool().unwrap_or(false) as i64,state["enhancement"].as_i64().unwrap_or(0)])?;}}}
    if let Some(systems)=character["systems"].as_object(){for(slug,state)in systems{transaction.execute("INSERT INTO user.character_systems(character_id,system_slug,value_json) VALUES(?1,?2,?3) ON CONFLICT(character_id,system_slug) DO UPDATE SET value_json=excluded.value_json",params![id,slug,serde_json::to_string(state).unwrap_or_else(|_|"{}".into())])?;}}
    transaction.commit()
}

pub(crate) fn sync_active_item(connection:&Connection,item_id:i64,obtained:bool,enhancement:i64)->rusqlite::Result<()> {
    connection.execute("INSERT INTO user.character_items(character_id,item_id,obtained,equipped,enhancement) SELECT id,?1,?2,?2,?3 FROM user.characters WHERE is_active=1 ON CONFLICT(character_id,item_id) DO UPDATE SET obtained=excluded.obtained,equipped=excluded.equipped,enhancement=excluded.enhancement",params![item_id,obtained as i64,enhancement])?;
    Ok(())
}

pub(crate) fn sync_active_checklist(connection:&Connection,activity_id:i64,count:i64)->rusqlite::Result<()> {
    connection.execute("INSERT INTO user.character_checklist(character_id,activity_id,completion_count,last_reset_at) SELECT id,?1,?2,?3 FROM user.characters WHERE is_active=1 ON CONFLICT(character_id,activity_id) DO UPDATE SET completion_count=excluded.completion_count,last_reset_at=excluded.last_reset_at",params![activity_id,count,Utc::now().to_rfc3339()])?;
    Ok(())
}
pub(crate) fn create_character(connection:&Connection,class_id:&str)->rusqlite::Result<()> {connection.execute("UPDATE user.characters SET is_active=0",[])?;let count:i64=connection.query_row("SELECT COUNT(*) FROM user.characters",[],|r|r.get(0))?;let now=Utc::now().to_rfc3339();let name:String=connection.query_row("SELECT name_ru FROM classes WHERE id=?1",[class_id],|r|r.get(0))?;connection.execute("INSERT INTO user.characters(name,class_id,current_level,current_gs,primary_mode,play_context,active_build_id,is_active,created_at,updated_at) VALUES(?1,?2,45,0,'pve','solo',(SELECT id FROM class_builds WHERE class_id=?2 LIMIT 1),1,?3,?3)",params![format!("{} {}",name,count+1),class_id,now])?;let id=connection.last_insert_rowid();connection.execute("INSERT INTO user.character_items(character_id,item_id) SELECT ?1,id FROM items",[id])?;connection.execute("INSERT INTO user.character_checklist(character_id,activity_id) SELECT ?1,id FROM activities",[id])?;Ok(())}
pub(crate) fn activate(connection:&Connection,id:i64)->rusqlite::Result<()> {let transaction=connection.unchecked_transaction()?;transaction.execute("UPDATE user.characters SET is_active=0",[])?;transaction.execute("UPDATE user.characters SET is_active=1 WHERE id=?1",[id])?;transaction.commit()}
pub(crate) fn check_updates(connection:&Connection,provider:Option<&str>)->rusqlite::Result<()> {let now=Utc::now().to_rfc3339();match provider{Some(id)=>{connection.execute("UPDATE provider_versions SET last_checked=?2 WHERE provider_id=?1",params![id,now])?;},None=>{connection.execute("UPDATE provider_versions SET last_checked=?1 WHERE provider_id IN(SELECT id FROM sources WHERE enabled=1)",[&now])?;}}connection.execute("INSERT INTO user.update_history(provider_id,started_at,finished_at,status,message) VALUES(?1,?2,?2,'unchanged','No enabled structured provider; local data retained')",params![provider.unwrap_or("all"),now])?;Ok(())}
