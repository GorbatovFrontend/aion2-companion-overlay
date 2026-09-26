PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS schema_migrations(version INTEGER PRIMARY KEY, applied_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS sources(id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE, url TEXT NOT NULL, source_type TEXT NOT NULL, region TEXT NOT NULL, trust_priority INTEGER NOT NULL, last_updated TEXT);
CREATE TABLE IF NOT EXISTS items(id INTEGER PRIMARY KEY, external_id TEXT, name_ru TEXT NOT NULL, name_en TEXT NOT NULL, aliases TEXT NOT NULL DEFAULT '', type TEXT NOT NULL, subtype TEXT, grade TEXT, item_level INTEGER, required_level INTEGER, class_restriction TEXT, icon TEXT, description_ru TEXT, description_en TEXT, source_region TEXT NOT NULL, source_version TEXT, localization_status TEXT NOT NULL DEFAULT 'unknown');
CREATE TABLE IF NOT EXISTS item_stats(item_id INTEGER NOT NULL REFERENCES items(id), stat_id TEXT NOT NULL, value TEXT NOT NULL, PRIMARY KEY(item_id, stat_id));
CREATE TABLE IF NOT EXISTS skills(id INTEGER PRIMARY KEY, class TEXT NOT NULL, name_ru TEXT NOT NULL, name_en TEXT NOT NULL, aliases TEXT NOT NULL DEFAULT '', description TEXT, cooldown REAL, resource_cost TEXT, max_level INTEGER, icon TEXT, patch_version TEXT);
CREATE TABLE IF NOT EXISTS instances(id INTEGER PRIMARY KEY, name_ru TEXT NOT NULL, name_en TEXT NOT NULL, aliases TEXT NOT NULL DEFAULT '', category TEXT, stars INTEGER, min_level INTEGER, min_gear_score_global INTEGER, min_gear_score_tw INTEGER, party_size INTEGER, odyle_cost INTEGER, description TEXT, source_status TEXT NOT NULL DEFAULT 'unverified');
CREATE TABLE IF NOT EXISTS bosses(id INTEGER PRIMARY KEY, instance_id INTEGER REFERENCES instances(id), name_ru TEXT NOT NULL, name_en TEXT NOT NULL, aliases TEXT NOT NULL DEFAULT '', icon TEXT);
CREATE TABLE IF NOT EXISTS drops(boss_id INTEGER NOT NULL REFERENCES bosses(id), item_id INTEGER NOT NULL REFERENCES items(id), drop_rate REAL, reward_type TEXT, PRIMARY KEY(boss_id, item_id));
CREATE TABLE IF NOT EXISTS pity_rewards(instance_id INTEGER NOT NULL REFERENCES instances(id), clears_required INTEGER NOT NULL, item_id INTEGER REFERENCES items(id), selector_group TEXT);
CREATE TABLE IF NOT EXISTS systems(id INTEGER PRIMARY KEY, slug TEXT NOT NULL UNIQUE, name_ru TEXT NOT NULL, name_en TEXT NOT NULL, description TEXT, risk_level TEXT NOT NULL DEFAULT 'safe', stop_rule TEXT);
CREATE TABLE IF NOT EXISTS roadmap_steps(id INTEGER PRIMARY KEY, region TEXT NOT NULL, min_gs INTEGER NOT NULL, max_gs INTEGER NOT NULL, order_index INTEGER NOT NULL, title_ru TEXT NOT NULL, description_ru TEXT NOT NULL, priority TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS roadmap_actions(id INTEGER PRIMARY KEY, roadmap_step_id INTEGER NOT NULL REFERENCES roadmap_steps(id), action_type TEXT NOT NULL, target_id TEXT NOT NULL, title_ru TEXT NOT NULL, priority TEXT NOT NULL, explanation TEXT NOT NULL, source_status TEXT NOT NULL DEFAULT 'community');
CREATE TABLE IF NOT EXISTS activities(id INTEGER PRIMARY KEY, name_ru TEXT NOT NULL, cadence TEXT NOT NULL, weekly_limit INTEGER, daily_limit INTEGER, reward TEXT, reason TEXT, priority TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS user_profile(id INTEGER PRIMARY KEY CHECK(id=1), class TEXT NOT NULL, faction TEXT, server TEXT, current_gs INTEGER NOT NULL, current_level INTEGER NOT NULL, pvp_enabled INTEGER NOT NULL DEFAULT 1);
CREATE TABLE IF NOT EXISTS user_items(item_id INTEGER PRIMARY KEY REFERENCES items(id), obtained INTEGER NOT NULL DEFAULT 0, enhancement INTEGER NOT NULL DEFAULT 0, equipped INTEGER NOT NULL DEFAULT 0, favorite INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS user_progress(system_id INTEGER PRIMARY KEY REFERENCES systems(id), value TEXT, completed INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS user_checklist(activity_id INTEGER PRIMARY KEY REFERENCES activities(id), completion_count INTEGER NOT NULL DEFAULT 0, reset_at TEXT);
CREATE TABLE IF NOT EXISTS source_records(entity_type TEXT NOT NULL, entity_id INTEGER NOT NULL, source_id INTEGER NOT NULL REFERENCES sources(id), source_url TEXT NOT NULL, fetched_at TEXT NOT NULL, PRIMARY KEY(entity_type, entity_id, source_id));
CREATE TABLE IF NOT EXISTS app_settings(key TEXT PRIMARY KEY, value TEXT NOT NULL);

CREATE VIRTUAL TABLE IF NOT EXISTS search_index USING fts5(entity_type UNINDEXED, entity_id UNINDEXED, name_ru, name_en, aliases, details, tokenize='unicode61 remove_diacritics 2');
