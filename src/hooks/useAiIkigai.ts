import { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Participant } from "../models/participant.model";
import { updateParticipantAiIkigai } from "../services/participants.service";
import { generateIkigaiFromAnswers } from "../services/ikigaiAi.service";
import { queryKeys } from "./queryKeys";

interface UseAiIkigaiResult {
  aiIkigai: string | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Manages the AI Ikigai summary for a participant.
 *
 * - If `participant.aiIkigai` already exists in the DB: returns it immediately.
 * - If participant is finished and `aiIkigai` is missing: calls OpenAI once,
 *   saves the result to Firestore, and returns it via local state.
 *
 * The `generating` guard (ref) prevents double-calls during React strict-mode
 * double-effects or rapid re-renders.
 */
export function useAiIkigai(
  session: string | null,
  participantId: string | null,
  participant: Participant | null | undefined
): UseAiIkigaiResult {
  const queryClient = useQueryClient();
  const [localAiIkigai, setLocalAiIkigai] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const generating = useRef(false);

  useEffect(() => {
    if (!participant || !session || !participantId) return;

    // Already generated and stored: use it, no API call needed
    if (participant.aiIkigai) {
      setLocalAiIkigai(participant.aiIkigai);
      return;
    }

    // Only generate for participants who have finished
    if (!participant.isFinished) return;

    // Guard against concurrent calls
    if (generating.current) return;
    generating.current = true;

    setIsLoading(true);
    setError(null);

    generateIkigaiFromAnswers(participant.answers)
      .then(async (text) => {
        setLocalAiIkigai(text);
        await updateParticipantAiIkigai(session, participantId, text);
        queryClient.invalidateQueries({
          queryKey: queryKeys.participant(session, participantId),
        });
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => {
        setIsLoading(false);
        generating.current = false;
      });
  }, [participant, session, participantId, queryClient]);

  return {
    aiIkigai: participant?.aiIkigai ?? localAiIkigai,
    isLoading,
    error,
  };
}
