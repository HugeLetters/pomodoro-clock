import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { pomodoroListAtom } from "./atom.jotai";
import { PomodoroClock } from "./Clock";
import { PomodoroList } from "./List/List";
import { localStorageKey, queryLocalStorage } from "./queryLocalStorage";

export default function App() {
  const dispatchPomodoroList = useSetAtom(pomodoroListAtom);
  useEffect(() => {
    dispatchPomodoroList({ type: "SET", payload: queryLocalStorage() });
  }, [dispatchPomodoroList]);

  return (
    <div className="app w-2/3 border-2 border-purple-700">
      <PomodoroClock />
      <PomodoroList />
      <SaveButton />
    </div>
  );
}

function SaveButton() {
  const pomodoroList = useAtomValue(pomodoroListAtom);

  return (
    <button
      onClick={() => {
        localStorage.setItem(localStorageKey, JSON.stringify(pomodoroList));
      }}
    >
      SAVE DATA
    </button>
  );
}
