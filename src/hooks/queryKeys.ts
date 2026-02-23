export const queryKeys = {
  session: (sessionId: string) =>
    ["session", sessionId] as const,

  participant: (sessionId: string, participantId: string) =>
    ["participant", sessionId, participantId] as const,

  participants: (sessionId: string) =>
    ["participants", sessionId] as const,
} as const;
