"use client";
import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { learningGoals } from "@/lib/learning-goals";

const LearningGoalContext = createContext<{
  selected: number;
  setSelected: Dispatch<SetStateAction<number>>;
} | null>(null);
export function LearningGoalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selected, setSelected] = useState(0);
  return (
    <LearningGoalContext.Provider value={{ selected, setSelected }}>
      {children}
    </LearningGoalContext.Provider>
  );
}
export function useLearningGoal() {
  const state = useContext(LearningGoalContext);
  if (!state) throw new Error("Learning goal provider is missing");
  return state;
}
export function useIntroHref(path: string) {
  const { selected } = useLearningGoal();
  return path === "/" ? `/book?goal=${learningGoals[selected].id}` : "/book";
}
