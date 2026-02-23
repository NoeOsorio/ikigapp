import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getParticipant,
  createParticipant,
  updateParticipantStep,
  updateParticipantAnswers,
  saveShareLink,
  type CreateParticipantInput,
} from "../services/participants.service";
import { createSession } from "../services/sessions.service";
import { nameToParticipantId, type ParticipantAnswers } from "../models/participant.model";
import type { StepValue } from "../lib/nuqs";
import { queryKeys } from "./queryKeys";

export function useParticipant(sessionId: string | null, participantId: string | null) {
  return useQuery({
    queryKey: queryKeys.participant(sessionId ?? "", participantId ?? ""),
    queryFn: () => getParticipant(sessionId!, participantId!),
    enabled: !!sessionId && !!participantId,
    staleTime: 30_000,
  });
}

/**
 * Joins a session: creates the session doc (idempotent) and the participant doc.
 * Safe to call if the session or participant already exists.
 */
export function useJoinSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sessionId,
      hostName,
      participant,
    }: {
      sessionId: string;
      hostName: string;
      participant: CreateParticipantInput;
    }) => {
      await createSession(sessionId, hostName);
      await createParticipant(sessionId, participant);
    },
    onSuccess: (_, { sessionId, participant }) => {
      const pid = nameToParticipantId(`${participant.firstName} ${participant.lastName}`);
      queryClient.invalidateQueries({ queryKey: queryKeys.session(sessionId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.participants(sessionId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.participant(sessionId, pid) });
    },
  });
}

export function useUpdateStep() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sessionId,
      participantId,
      step,
    }: {
      sessionId: string;
      participantId: string;
      step: StepValue;
    }) => updateParticipantStep(sessionId, participantId, step),
    onSuccess: (_, { sessionId, participantId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.participant(sessionId, participantId) });
    },
  });
}

export function useUpdateAnswers() {
  return useMutation({
    mutationFn: ({
      sessionId,
      participantId,
      answers,
    }: {
      sessionId: string;
      participantId: string;
      answers: Partial<ParticipantAnswers>;
    }) => updateParticipantAnswers(sessionId, participantId, answers),
  });
}

export function useSaveShareLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sessionId,
      participantId,
      shareLink,
    }: {
      sessionId: string;
      participantId: string;
      shareLink: string;
    }) => saveShareLink(sessionId, participantId, shareLink),
    onSuccess: (_, { sessionId, participantId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.participant(sessionId, participantId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.participants(sessionId) });
    },
  });
}
