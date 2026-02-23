import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createSession, getSession } from "../services/sessions.service";
import { queryKeys } from "./queryKeys";

export function useSession(sessionId: string | null) {
  return useQuery({
    queryKey: queryKeys.session(sessionId ?? ""),
    queryFn: () => getSession(sessionId!),
    enabled: !!sessionId,
    staleTime: 60_000,
  });
}

/**
 * Mutation that creates a session doc (idempotent).
 * Call this on join/create — safe to call even if the session already exists.
 */
export function useEnsureSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sessionId, hostName }: { sessionId: string; hostName: string }) =>
      createSession(sessionId, hostName),
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.session(sessionId) });
    },
  });
}
