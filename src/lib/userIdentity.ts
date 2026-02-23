/**
 * User identity management using sessionStorage.
 * Persists the actual logged-in user's participant ID across navigation,
 * even when viewing other participants' snapshots.
 */

const USER_IDENTITY_KEY = "ikigapp:user-identity";

export interface UserIdentity {
  session: string;
  participantId: string;
}

/**
 * Save the current user's identity to sessionStorage.
 * Call this when the user first joins/creates a session.
 * @param session - The session ID
 * @param participantId - The participant's Firestore document ID (generated from name)
 */
export function setUserIdentity(session: string, participantId: string): void {
  try {
    const identity: UserIdentity = { session, participantId };
    sessionStorage.setItem(USER_IDENTITY_KEY, JSON.stringify(identity));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Get the current user's identity from sessionStorage.
 * Returns null if not found or if storage is unavailable.
 */
export function getUserIdentity(): UserIdentity | null {
  try {
    const stored = sessionStorage.getItem(USER_IDENTITY_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as UserIdentity;
  } catch {
    return null;
  }
}

/**
 * Clear the current user's identity from sessionStorage.
 * Useful when logging out or switching sessions.
 */
export function clearUserIdentity(): void {
  try {
    sessionStorage.removeItem(USER_IDENTITY_KEY);
  } catch {
    // Ignore storage errors
  }
}

/**
 * Check if the given participant ID matches the current logged-in user.
 * This is safe to use even when viewing other participants' content.
 */
export function isCurrentUser(participantId: string): boolean {
  const identity = getUserIdentity();
  return identity?.participantId === participantId;
}
