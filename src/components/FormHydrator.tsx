import { useEffect, useRef } from "react";
import { useIkigaiForm } from "../context/ikigaiFormContextValue";
import { useParticipant } from "../hooks/useParticipant";
import { nameToParticipantId } from "../models/participant.model";
import { getSnapshotPayload, getDraftPayload, setDraftPayload } from "../lib/snapshotStorage";
import { hasPayloadContent } from "../lib/payload";

function formIsEmpty(c1: string[], c2: string[], c3: string[], c4: string[], action: string): boolean {
  return (
    c1.length === 0 &&
    c2.length === 0 &&
    c3.length === 0 &&
    c4.length === 0 &&
    action.trim() === ""
  );
}

interface FormHydratorProps {
  session: string | null;
  name: string | null;
}

/**
 * Hydrates the workshop form from Firestore (participant), then sessionStorage snapshot,
 * then localStorage draft, so that re-entering the Ikigai flow shows previous answers.
 * Also persists the current form to localStorage (debounced) so drafts survive tab close.
 */
export function FormHydrator({ session, name }: FormHydratorProps) {
  const participantId = name ? nameToParticipantId(name) : null;
  const { data: participant } = useParticipant(session, participantId);
  const { c1, c2, c3, c4, action, setC1, setC2, setC3, setC4, setAction } = useIkigaiForm();
  const hasHydratedRef = useRef(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydrate once from saved data when form is still empty
  useEffect(() => {
    if (!session || !name || hasHydratedRef.current) return;
    if (!formIsEmpty(c1, c2, c3, c4, action)) return; // don't overwrite if user already typed

    // 1) Firestore participant (source of truth after save)
    if (participant?.answers) {
      const a = participant.answers;
      const hasAny =
        (a.c1?.length ?? 0) > 0 ||
        (a.c2?.length ?? 0) > 0 ||
        (a.c3?.length ?? 0) > 0 ||
        (a.c4?.length ?? 0) > 0 ||
        (a.action?.trim() ?? "") !== "";
      if (hasAny) {
        setC1(a.c1 ?? []);
        setC2(a.c2 ?? []);
        setC3(a.c3 ?? []);
        setC4(a.c4 ?? []);
        setAction(a.action ?? "");
        hasHydratedRef.current = true;
        return;
      }
    }

    // 2) sessionStorage snapshot (e.g. after reaching result then going back)
    const fromSnapshot = getSnapshotPayload(session, name);
    if (fromSnapshot && hasPayloadContent(fromSnapshot)) {
      setC1(fromSnapshot.c1 ?? []);
      setC2(fromSnapshot.c2 ?? []);
      setC3(fromSnapshot.c3 ?? []);
      setC4(fromSnapshot.c4 ?? []);
      setAction(fromSnapshot.action ?? "");
      hasHydratedRef.current = true;
      return;
    }

    // 3) localStorage draft (survives tab close)
    const fromDraft = getDraftPayload(session, name);
    if (fromDraft) {
      const hasAny =
        fromDraft.c1.length > 0 ||
        fromDraft.c2.length > 0 ||
        fromDraft.c3.length > 0 ||
        fromDraft.c4.length > 0 ||
        fromDraft.action.trim() !== "";
      if (hasAny) {
        setC1(fromDraft.c1);
        setC2(fromDraft.c2);
        setC3(fromDraft.c3);
        setC4(fromDraft.c4);
        setAction(fromDraft.action);
        hasHydratedRef.current = true;
      }
    }
  }, [
    session,
    name,
    participant?.id,
    participant?.answers,
    c1,
    c2,
    c3,
    c4,
    action,
    setC1,
    setC2,
    setC3,
    setC4,
    setAction,
  ]);

  // Persist draft to localStorage when form changes (debounced)
  useEffect(() => {
    if (!session || !name) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      setDraftPayload(session, name, { c1, c2, c3, c4, action });
      saveTimeoutRef.current = null;
    }, 500);
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [session, name, c1, c2, c3, c4, action]);

  return null;
}
