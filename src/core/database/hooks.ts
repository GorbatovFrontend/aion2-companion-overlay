import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { checkDataUpdates, createCharacter, getBootstrap, saveCharacter, saveProfile, searchLocal, setActiveCharacter, setChecklistCount, setItemState } from "./api";
import type { CharacterProfile, Profile, TrackedItem } from "../../types";

export const bootstrapKey = ["bootstrap"] as const;

export function useBootstrap() {
  return useQuery({ queryKey: bootstrapKey, queryFn: getBootstrap, staleTime: Infinity });
}

export function useSaveProfile() {
  const client = useQueryClient();
  return useMutation({ mutationFn: (profile: Profile) => saveProfile(profile), onSuccess: data => client.setQueryData(bootstrapKey, data) });
}

export function useChecklistMutation() {
  const client = useQueryClient();
  return useMutation({ mutationFn: ({ id, count }: {id: number; count: number}) => setChecklistCount(id, count), onSuccess: data => client.setQueryData(bootstrapKey, data) });
}

export function useItemMutation() {
  const client = useQueryClient();
  return useMutation({ mutationFn: (item: TrackedItem) => setItemState(item), onSuccess: data => client.setQueryData(bootstrapKey, data) });
}

export function useSearch(query: string) {
  return useQuery({ queryKey: ["search", query], queryFn: () => searchLocal(query), enabled: query.trim().length > 0, staleTime: 60_000 });
}

export function useCharacterMutations() {
  const client = useQueryClient();
  const apply = (data: Awaited<ReturnType<typeof saveCharacter>>) => client.setQueryData(bootstrapKey, data);
  return {
    save: useMutation({ mutationFn: (character: CharacterProfile) => saveCharacter(character), onSuccess: apply }),
    create: useMutation({ mutationFn: (classId: string) => createCharacter(classId), onSuccess: apply }),
    activate: useMutation({ mutationFn: (characterId: number) => setActiveCharacter(characterId), onSuccess: apply })
  };
}

export function useUpdateMutation() {
  const client = useQueryClient();
  return useMutation({ mutationFn: (providerId?: string) => checkDataUpdates(providerId), onSuccess: data => client.setQueryData(bootstrapKey, data) });
}
