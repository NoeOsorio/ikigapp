import { createContext, useContext } from "react";
import type { SnapshotPayload } from "../lib/nuqs";

export interface IkigaiFormState {
  c1: string[];
  c2: string[];
  c3: string[];
  c4: string[];
  action: string;
}

type SetArray = (value: string[] | ((prev: string[]) => string[])) => void;
type SetString = (value: string | ((prev: string) => string)) => void;

export interface IkigaiFormContextValue extends IkigaiFormState {
  setC1: SetArray;
  setC2: SetArray;
  setC3: SetArray;
  setC4: SetArray;
  setAction: SetString;
  buildPayload: (name: string) => SnapshotPayload;
}

export const IkigaiFormContext = createContext<IkigaiFormContextValue | null>(null);

export function useIkigaiForm(): IkigaiFormContextValue {
  const ctx = useContext(IkigaiFormContext);
  if (ctx == null) {
    throw new Error("useIkigaiForm must be used within IkigaiFormProvider");
  }
  return ctx;
}

export function useIkigaiFormOptional(): IkigaiFormContextValue | null {
  return useContext(IkigaiFormContext);
}
