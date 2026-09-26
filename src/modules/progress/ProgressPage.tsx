import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useBootstrap, useCharacterMutations, useItemMutation } from "../../core/database/hooks";
import type { Profile } from "../../types";

export function ProgressPage() {
  const { data } = useBootstrap();
  const itemMutation = useItemMutation();
  const characterMutations = useCharacterMutations();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => { if (data) setProfile(data.profile); }, [data]);
  if (!data || !profile) return null;

  const saveCharacter = () => {
    if (!data.activeCharacter) return;
    characterMutations.save.mutate({
      ...data.activeCharacter,
      currentLevel: profile.currentLevel,
      currentGs: profile.currentGs,
      server: profile.server,
    });
  };

  return <div className="page">
    <div className="page-heading"><div><span className="eyebrow">ЛОКАЛЬНЫЙ ПРОФИЛЬ</span><h1>Мой прогресс</h1><p>Состояние хранится только в SQLite на этом компьютере.</p></div></div>
    <section className="profile-form">
      <label>Класс<select value={data.activeCharacter?.classId ?? "sorcerer"} onChange={event => {
        const definition = data.classes?.find(value => value.id === event.target.value);
        if (data.activeCharacter && definition) characterMutations.save.mutate({ ...data.activeCharacter, classId: definition.id, className: definition.nameRu, activeBuildId: data.builds?.find(value => value.classId === definition.id)?.id });
      }}>{data.classes?.map(value => <option key={value.id} value={value.id}>{value.nameRu}</option>)}</select></label>
      <label>Уровень<input type="number" min="1" max="60" value={profile.currentLevel} onChange={event => setProfile({ ...profile, currentLevel: Number(event.target.value) })}/></label>
      <label>Gear score<input type="number" min="0" max="99999" value={profile.currentGs} onChange={event => setProfile({ ...profile, currentGs: Number(event.target.value) })}/></label>
      <label>Режим<select value={data.activeCharacter?.primaryMode ?? "pve"} onChange={event => {
        if (!data.activeCharacter) return;
        const primaryMode = event.target.value as "pve" | "solo_pvp";
        const activeBuildId = data.builds?.find(value => value.classId === data.activeCharacter?.classId && value.mode === primaryMode)?.id;
        characterMutations.save.mutate({ ...data.activeCharacter, primaryMode, activeBuildId });
      }}><option value="pve">PvE</option><option value="solo_pvp">Solo PvP</option></select></label>
      <button className="primary-button" disabled={!data.activeCharacter || characterMutations.save.isPending} onClick={saveCharacter}>Сохранить и пересчитать</button>
    </section>
    {data.activeCharacter?.classId === "sorcerer" && <section className="skill-editor"><div><strong>Адское пламя</strong><small>Hellfire</small></div><label>Уровень<input type="number" min="0" max="20" value={data.activeCharacter.skills.hellfire ?? 0} onChange={event => data.activeCharacter && characterMutations.save.mutate({ ...data.activeCharacter, skills: { ...data.activeCharacter.skills, hellfire: Number(event.target.value) }, profileCompleteness: Math.max(data.activeCharacter.profileCompleteness, 60) })}/></label></section>}
    <section className="inventory-section"><div className="section-header"><h2>Ключевые предметы</h2><span>Отметьте полученные вручную</span></div>
      <div className="inventory-table">{data.items.map(item => <div className={`inventory-row ${item.obtained ? "obtained" : ""}`} key={item.id}><button className="item-check" onClick={() => itemMutation.mutate({ ...item, obtained: !item.obtained })}>{item.obtained ? "✓" : ""}</button><div><strong>{item.nameRu}</strong><small>{item.nameEn}</small></div><label>+<input type="number" min="0" max="20" value={item.enhancement} onChange={event => itemMutation.mutate({ ...item, enhancement: Number(event.target.value) })}/></label><button className={`favorite ${item.favorite ? "active" : ""}`} onClick={() => itemMutation.mutate({ ...item, favorite: !item.favorite })}><Star size={17}/></button></div>)}</div>
    </section>
  </div>;
}
