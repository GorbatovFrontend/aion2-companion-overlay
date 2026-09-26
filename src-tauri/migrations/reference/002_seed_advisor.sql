INSERT OR IGNORE INTO sources VALUES
('official','Official AION 2','https://aion2.plaync.com/','official','multi',100,1,'manual review required','2026-09-27'),
('aion2hub','AION2Hub','https://aion2hub.com/','structured-community','multi',70,0,'API/license not confirmed','2026-09-27'),
('kodex','Aion 2 Kodex','https://kodex.yavuz.app/en/','editorial-guide','tw_global_lst',65,0,'reference only; no article redistribution','2026-09-27'),
('questlog','QuestLog','https://questlog.gg/aion-2/en-nc/db/search','structured-community','multi',60,0,'API/license not confirmed','2026-09-27'),
('aion2app','Aion2.app','https://aion2.app/','community','multi',50,0,'API/license not confirmed','2026-09-27');
INSERT OR IGNORE INTO classes VALUES
('templar','Храмовник','Templar','Танк','Меч и щит','Физический',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'official','multi','research-2026-09-27','low'),
('gladiator','Гладиатор','Gladiator','Боец','Двуручное оружие','Физический',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'official','multi','research-2026-09-27','low'),
('assassin','Убийца','Assassin','Ближний DPS','Парное оружие','Физический',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'official','multi','research-2026-09-27','low'),
('ranger','Стрелок','Ranger','Дальний DPS','Лук','Физический',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'official','multi','research-2026-09-27','low'),
('sorcerer','Волшебник','Sorcerer','Дальний DPS / контроль','Книга','Магический',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'official','multi','research-2026-09-27','medium'),
('spiritmaster','Заклинатель','Spiritmaster','Дальний DPS / призыв','Сфера','Магический',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'official','multi','research-2026-09-27','low'),
('cleric','Целитель','Cleric','Лечение / поддержка','Булава','Магический',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'official','multi','research-2026-09-27','low'),
('chanter','Чародей','Chanter','Поддержка / боец','Посох','Физический / поддержка',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'official','multi','research-2026-09-27','low');
INSERT OR IGNORE INTO instances VALUES
(1,'Храм Огня','Fire Temple','FT,огненный храм,Кромеда,Kromede','Экспедиция',3,45,NULL,2400,5,'Поздняя экспедиция. Global-порог не подтверждён.','tw_reference'),
(2,'Небесный остров Вакрона','Vakron Sky Island','Vakron,Вакрон','Экспедиция',2,45,NULL,1800,5,'Ключевой этап экипировки после 1800 GS.','tw_reference');
INSERT OR IGNORE INTO bosses VALUES (1,1,'Разгневанная Кромеда','Enraged Kromede','Кромеда,Kromede'),(2,2,'Вакрон','Vakron','Vakron Guard,Вакрон');
INSERT OR IGNORE INTO items VALUES
(1,'demo-kromede-book','Книга Кромеды','Enraged Kromede Spellbook','книга разгневанной кромеды,kromede book','Оружие','Книга','Уникальная',67,45,'sorcerer','Сильное оружие позднего этапа; перевод неофициальный.','TW','research-2026-09-27','community_ru'),
(2,'demo-vakron-guard','Защита Вакрона','Vakron Guard','guard,щит вакрона','Доп. оружие','Защита','Уникальная',55,45,'sorcerer','Целевой предмет этапа Вакрона.','TW','research-2026-09-27','community_ru'),
(3,'demo-aulamus-book','Книга Ауламуса','Aulamus Spellbook','aulamus,ауламус','Оружие','Книга','Редкая',50,45,'sorcerer','Промежуточное оружие.','TW','research-2026-09-27','community_ru');
INSERT OR IGNORE INTO drops VALUES (1,1,NULL,'boss_drop'),(2,2,NULL,'boss_drop');
INSERT OR IGNORE INTO skills VALUES (1,'hellfire','sorcerer','Адское пламя','Hellfire','hell fire,хеллфаер','Ключевой burst-навык; точные Global уровни не подтверждены.',20,'kodex','tw_global_lst','research-2026-09-27','low');
INSERT OR IGNORE INTO systems VALUES
(1,'odyle','Энергия Одиль','Odyle Energy','Ограниченный ресурс.','caution','Сохранять для более высокой ценности награды.'),
(2,'class-runes','Классовые руны','Class Runes','Постоянная система развития.','danger','Остановиться на +1 до Global-проверки риска.'),
(3,'theostone','Теокамни','Theostones','Эффект оружия; при снятии камень уничтожается.','danger','Не ставить в быстро заменяемое оружие.'),
(4,'arcana','Аркана','Arcana','Карты постоянного прогресса.','safe','Сначала заполнить пустые слоты.');
INSERT OR IGNORE INTO roadmap_steps VALUES
(1,'global',0,1599,1,'Фундамент после 45','Закройте постоянные системы и сохраните ограниченные ресурсы.','S'),
(2,'global',1600,1799,2,'Аксессуары и подготовка','Abyss accessories и подготовка к transcendence.','S'),
(3,'global',1800,2199,3,'Этап Вакрона','Соберите weapon/guard и равномерно улучшайте комплект.','S'),
(4,'global',2200,2399,4,'Аркана и Transcendence','Заполните слоты арканы.','S'),
(5,'global',2400,99999,5,'Храм Огня','Оружие и аксессуары позднего этапа.','S');
INSERT OR IGNORE INTO roadmap_actions VALUES
(1,1,'activity','strongholds','Strongholds → пояс','S','Пояс — долгоживущий слот.','tw_reference'),
(2,1,'activity','sealed-dungeons','Sealed Dungeons → Даэванион','S','Постоянный прогресс ценнее временной экипировки.','tw_reference'),
(3,2,'activity','abyss','Abyss → аксессуары','S','Аксессуары заменяются реже оружия.','tw_reference'),
(4,3,'instance','2','Небесный остров Вакрона','S','Сначала weapon и guard.','tw_reference'),
(5,4,'system','arcana','Аркана: ширина до глубины','S','Сначала заполните все пять слотов.','tw_reference'),
(6,5,'instance','1','Храм Огня → оружие','S','Оружие — крупнейший одиночный прирост этапа.','tw_reference');
INSERT OR IGNORE INTO activities VALUES
(1,'Ежедневное подземелье','daily',NULL,1,'Очки развития','Стабильный прогресс.','A'),
(2,'Shugo','daily',NULL,1,'Кристаллы Даэваниона','Постоянная сила.','S'),
(3,'Nightmare','weekly',14,NULL,'Валюта прогресса','Permanent progression.','S');
INSERT OR IGNORE INTO class_builds VALUES
('sorcerer-pve','sorcerer','PvE: контроль и burst','PvE Boss','pve','all','Безопасный путь развития PvE без неподтверждённых BiS-заявлений.','Используйте подтверждённый opener после обновления Global данных.',NULL,NULL,NULL,'Не инвестируйте редкие ресурсы в временное оружие.','tw_global_lst','research-2026-09-27',NULL,'seed-v1','low'),
('sorcerer-solo','sorcerer','Solo PvP','Solo PvP','solo_pvp','all','Контроль дистанции и сохранение defensive tools.','Точная ротация требует Global-проверки.',NULL,NULL,NULL,'Не копируйте PvE preset без проверки defensive Stigma.','tw_global_lst','research-2026-09-27',NULL,'seed-v1','low');
INSERT OR IGNORE INTO class_builds(id,class_id,name_ru,name_en,mode,stage,concept_ru,region,patch,source_version,confidence)
SELECT id||'-starter',id,'Стартовый путь: '||name_ru,'Starter '||name_en,'pve','all','Общий безопасный progression path. Точный class build пока не подтверждён.','unverified','research-2026-09-27','seed-v1','low' FROM classes WHERE id<>'sorcerer';
INSERT OR IGNORE INTO build_components VALUES
(1,'sorcerer-pve','item','2','Защита Вакрона',25,1,'midgame','Небесный остров Вакрона','Долгоживущий upgrade для этапа.','S'),
(2,'sorcerer-pve','skill','1','Адское пламя',25,1,'fresh45',NULL,'Высокий приоритет; точный breakpoint не подтверждён.','S'),
(3,'sorcerer-pve','system','arcana:5','Пять заполненных слотов Арканы',20,1,'midgame',NULL,'Пустой слот не даёт силы.','A'),
(4,'sorcerer-pve','item','1','Книга Кромеды',30,1,'late','Храм Огня','Поздняя цель оружия.','S');
INSERT OR IGNORE INTO skill_breakpoints VALUES (1,1,'sorcerer-pve','fresh45',10,'S','Высокий приоритет; точный Global breakpoint не подтверждён.',0);
INSERT OR IGNORE INTO stat_priorities VALUES
(1,'sorcerer-pve','magic_damage','Магический урон',1,'Базовый offensive приоритет; точный cap не подтверждён.',NULL,0),
(2,'sorcerer-pve','accuracy','Точность',2,'Проверяйте требования конкретного контента.',NULL,0),
(3,'sorcerer-solo','control','Контроль / status accuracy',1,'Ценность зависит от Global формул.',NULL,0);
INSERT OR IGNORE INTO recommendation_rules VALUES
('general-fresh45',NULL,NULL,'{"and":[{"path":"level","gte":45},{"path":"gs","lt":1600}]}','{"type":"progression","priority":"S","title":"Закрыть постоянные системы","reason":"На раннем этапе постоянный прогресс безопаснее глубоких вложений во временный gear.","gain":"Сохранение ресурсов и стабильный рост.","consequence":"Дорогие вложения могут потеряться при быстрой замене предмета.","target":"roadmap"}',1,'tw_global_lst','research-2026-09-27','medium','kodex'),
('sorc-hellfire-fresh45','sorcerer','sorcerer-pve','{"and":[{"path":"level","gte":45},{"path":"gs","lte":1900},{"path":"skills.hellfire","lt":10}]}','{"type":"upgrade_skill","priority":"S","title":"Hellfire: повысить приоритет","reason":"Навык помечен как ключевой burst, но точный Global breakpoint пока не подтверждён.","gain":"Усиление ключевого damage window.","consequence":"Burst останется слабее целевого профиля.","target":"hellfire","targetLevel":10}',1,'tw_global_lst','research-2026-09-27','low','kodex'),
('sorc-solo-control','sorcerer','sorcerer-solo','{"path":"primaryMode","equals":"solo_pvp"}','{"type":"change_build","priority":"S","title":"Переключиться на контроль и защитные инструменты","reason":"Solo PvP требует иного профиля, чем PvE burst preset.","gain":"Больше контроля дистанции и устойчивости.","consequence":"PvE preset оставит меньше ответов на давление игрока.","target":"sorcerer-solo"}',1,'tw_global_lst','research-2026-09-27','low','official'),
('sorc-vakron-guard','sorcerer','sorcerer-pve','{"and":[{"path":"gs","gte":1600},{"path":"gs","lt":2200},{"path":"items.2.obtained","equals":false}]}','{"type":"obtain_item","priority":"S","title":"Получить Защиту Вакрона","reason":"Guard — отсутствующий долгоживущий slot upgrade этапа.","gain":"Закрывает слабый off-hand slot.","consequence":"Общий комплект останется несбалансированным.","target":"2"}',1,'tw_global_lst','research-2026-09-27','medium','kodex'),
('arcana-fill',NULL,NULL,'{"path":"systems.arcana.filledSlots","lt":5}','{"type":"fill_system","priority":"A","title":"Заполнить пустые слоты Арканы","reason":"Пустой слот не даёт силы; сначала ширина, затем качество.","gain":"Более эффективный ранний прирост.","consequence":"Улучшение занятых слотов оставит часть системы пустой.","target":"arcana"}',1,'tw_global_lst','research-2026-09-27','medium','kodex'),
('stop-theostone-temporary',NULL,NULL,'{"and":[{"path":"gs","lt":1800},{"path":"systems.theostone.installed","equals":false}]}','{"type":"stop","priority":"STOP","title":"Не устанавливать дорогой Theostone","reason":"Текущее оружие, вероятно, будет заменено; transfer path не подтверждён.","gain":"Сохранение редкого ресурса.","consequence":"Камень может быть потерян при замене или снятии.","target":"theostone"}',1,'tw_global_lst','research-2026-09-27','medium','kodex');
INSERT OR IGNORE INTO provider_versions(provider_id,status,record_count) VALUES ('official','manual_only',0),('aion2hub','disabled',0),('kodex','manual_only',0),('questlog','disabled',0),('aion2app','disabled',0);
DELETE FROM search_index;
INSERT INTO search_index SELECT 'item',id,name_ru,name_en,aliases,type||' '||COALESCE(subtype,'') FROM items;
INSERT INTO search_index SELECT 'instance',id,name_ru,name_en,aliases,COALESCE(category,'') FROM instances;
INSERT INTO search_index SELECT 'boss',id,name_ru,name_en,aliases,'Босс' FROM bosses;
INSERT INTO search_index SELECT 'skill',id,name_ru,name_en,aliases,'Навык '||class_id FROM skills;
INSERT INTO search_index SELECT 'class',rowid,name_ru,name_en,id,COALESCE(role_ru,'') FROM classes;
