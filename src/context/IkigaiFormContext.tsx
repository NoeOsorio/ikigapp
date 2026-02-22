import { useMemo, useState, type ReactNode } from "react";
import type { SnapshotPayload } from "../lib/nuqs";
import {
  IkigaiFormContext,
  type IkigaiFormContextValue,
} from "./ikigaiFormContextValue";

const initialState = {
  c1: [] as string[],
  c2: [] as string[],
  c3: [] as string[],
  c4: [] as string[],
  action: "",
};

export function IkigaiFormProvider({ children }: { children: ReactNode }) {
  const [c1, setC1] = useState<string[]>(initialState.c1);
  const [c2, setC2] = useState<string[]>(initialState.c2);
  const [c3, setC3] = useState<string[]>(initialState.c3);
  const [c4, setC4] = useState<string[]>(initialState.c4);
  const [action, setAction] = useState<string>(initialState.action);

  const value = useMemo<IkigaiFormContextValue>(
    () => ({
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
      buildPayload(name: string): SnapshotPayload {
        return {
          name,
          c1,
          c2,
          c3,
          c4,
          action,
        };
      },
    }),
    [c1, c2, c3, c4, action]
  );

  return (
    <IkigaiFormContext.Provider value={value}>
      {children}
    </IkigaiFormContext.Provider>
  );
}
