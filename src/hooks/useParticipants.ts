import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { subscribeToParticipants } from "../services/participants.service";
import type { Participant } from "../models/participant.model";
import { queryKeys } from "./queryKeys";

/**
 * Returns the live list of participants for a session.
 *
 * Uses a Firestore onSnapshot subscription to keep the React Query cache
 * up-to-date in real-time. staleTime is Infinity because the subscription
 * is the authoritative source of freshness.
 */
export function useParticipants(sessionId: string | null) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!sessionId) return;

    const unsubscribe = subscribeToParticipants(sessionId, (participants) => {
      queryClient.setQueryData<Participant[]>(
        queryKeys.participants(sessionId),
        participants
      );
    });

    return unsubscribe;
  }, [sessionId, queryClient]);

  return useQuery<Participant[]>({
    queryKey: queryKeys.participants(sessionId ?? ""),
    queryFn: () => [],          // subscription populates the cache; this is a fallback
    enabled: !!sessionId,
    staleTime: Infinity,
  });
}
