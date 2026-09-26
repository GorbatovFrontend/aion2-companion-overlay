INSERT OR IGNORE INTO sources VALUES
(1,'AION 2 Official','https://aion2.plaync.com/','official','Global',100,'2026-09-27'),
(2,'AION2Hub','https://aion2hub.com/','community_database','Multi-region',70,'2026-09-27'),
(3,'Aion 2 Kodex','https://kodex.yavuz.app/en/','community_guide','TW/Global LST',65,'2026-09-27');

INSERT OR IGNORE INTO instances VALUES
(1,'Храм Огня','Fire Temple','FT,огненный храм,Кромеда,Kromede','Экспедиция',3,45,NULL,2400,5,NULL,'Поздняя экспедиция. Global-порог ещё требует подтверждения.','tw_reference'),
(2,'Небесный остров Вакрона','Vakron Sky Island','Vakron,Вакрон','Экспедиция',2,45,NULL,1800,5,NULL,'Ключевой этап экипировки после 1800 GS.','tw_reference'),
(3,'Пещера Крао','Krao Cave','Krao,Крао','Экспедиция',1,45,NULL,1400,5,NULL,'Ранний источник экипировки.','tw_reference');
INSERT OR IGNORE INTO bosses VALUES
(1,1,'Разгневанная Кромеда','Enraged Kromede','Кромеда,Kromede',NULL),
(2,2,'Вакрон','Vakron','Vakron Guard,Вакрон',NULL);
INSERT OR IGNORE INTO items VALUES
(1,'demo-kromede-book','Книга Кромеды','Enraged Kromede Spellbook','книга разгневанной кромеды,kromede book','Оружие','Книга','Уникальная',67,45,'Волшебник',NULL,'Сильное оружие позднего этапа. Название — неофициальный перевод.','A late-game spellbook for Sorcerer.','TW','research-2026-09-27','community_ru'),
(2,'demo-vakron-guard','Защита Вакрона','Vakron Guard','guard,щит вакрона','Доп. оружие','Защита','Уникальная',55,45,'Волшебник',NULL,'Целевой предмет этапа Вакрона.','A progression off-hand item.','TW','research-2026-09-27','community_ru'),
(3,'demo-aulamus-book','Книга Ауламуса','Aulamus Spellbook','aulamus,ауламус','Оружие','Книга','Редкая',50,45,'Волшебник',NULL,'Промежуточное оружие.','A midgame spellbook.','TW','research-2026-09-27','community_ru');
INSERT OR IGNORE INTO drops VALUES (1,1,NULL,'boss_drop'),(2,2,NULL,'boss_drop');
INSERT OR IGNORE INTO pity_rewards VALUES (1,28,1,'weapon_selector');
INSERT OR IGNORE INTO skills VALUES (1,'Волшебник','Адское пламя','Hellfire','hell fire,хеллфаер','Ключевой burst-навык. Значения уровней требуют проверки Global.',NULL,NULL,20,NULL,'TW-reference');
INSERT OR IGNORE INTO systems VALUES
(1,'odyle','Энергия Одиль','Odyle Energy','Ограниченный ресурс для наградных сундуков.','caution','Сохранять для более высокой ценности награды.'),
(2,'class-runes','Классовые руны','Class Runes','Постоянная система развития.','danger','Остановиться на +1: данные о риске +2 требуют Global-проверки.'),
(3,'theostone','Теокамни','Theostones','Эффект оружия; при снятии камень уничтожается.','danger','Не ставить в быстро заменяемое оружие.');
INSERT OR IGNORE INTO roadmap_steps VALUES
(1,'global',0,1599,1,'Фундамент после 45','Закройте постоянные системы и сохраните ограниченные ресурсы.','S'),
(2,'global',1600,1799,2,'Аксессуары и подготовка','Abyss accessories, weekly content и подготовка к transcendence.','S'),
(3,'global',1800,2199,3,'Этап Вакрона','Соберите weapon/guard и равномерно улучшайте комплект.','S'),
(4,'global',2200,2399,4,'Аркана и Transcendence','Заполните слоты арканы и улучшайте качество карт.','S'),
(5,'global',2400,99999,5,'Храм Огня','Оружие и аксессуары позднего этапа.','S');
INSERT OR IGNORE INTO roadmap_actions VALUES
(1,1,'activity','strongholds','Strongholds → пояс','S','Пояс — долгоживущий слот и безопаснее для вложений.','tw_reference'),
(2,1,'activity','sealed-dungeons','Sealed Dungeons → Даэванион','S','Постоянный прогресс ценнее временной экипировки.','tw_reference'),
(3,1,'system','odyle','Сохранять Одиль','A','Высокие tiers дают больше ценности на единицу ограниченной энергии.','tw_reference'),
(4,2,'activity','abyss','Abyss → аксессуары','S','Аксессуары заменяются реже оружия.','tw_reference'),
(5,2,'activity','nightmare','Nightmare','A','Еженедельный источник ресурсов permanent progression.','tw_reference'),
(6,3,'instance','2','Небесный остров Вакрона','S','Здесь начинается долгоживущий комплект; сначала weapon и guard.','tw_reference'),
(7,4,'system','arcana','Аркана: ширина до глубины','S','Пустой слот не даёт силы; сначала заполните все пять.','tw_reference'),
(8,5,'instance','1','Храм Огня → оружие','S','Оружие даёт крупнейший одиночный прирост этого этапа.','tw_reference');
INSERT OR IGNORE INTO activities VALUES
(1,'Ежедневное подземелье','daily',NULL,1,'Очки развития','Стабильный ежедневный прогресс.','A'),
(2,'Shugo','daily',NULL,1,'Кристаллы Даэваниона','Постоянная сила вместо быстро заменяемого gear.','S'),
(3,'Nightmare','weekly',14,NULL,'Валюта прогресса','Ресурс для permanent progression.','S'),
(4,'Испытание Вознесения','weekly',3,NULL,'Следы и экипировка','Шанс на сильный предмет и гарантированные следы.','A');
INSERT OR IGNORE INTO user_profile VALUES (1,'Волшебник','', '',1180,45,1);
INSERT OR IGNORE INTO user_items(item_id) SELECT id FROM items;
INSERT OR IGNORE INTO user_checklist(activity_id) SELECT id FROM activities;

DELETE FROM search_index;
INSERT INTO search_index SELECT 'item',id,name_ru,name_en,aliases,type || ' ' || COALESCE(subtype,'') FROM items;
INSERT INTO search_index SELECT 'instance',id,name_ru,name_en,aliases,COALESCE(category,'') FROM instances;
INSERT INTO search_index SELECT 'boss',id,name_ru,name_en,aliases,'Босс' FROM bosses;
INSERT INTO search_index SELECT 'skill',id,name_ru,name_en,aliases,class FROM skills;
INSERT INTO search_index SELECT 'system',id,name_ru,name_en,'',description FROM systems;
