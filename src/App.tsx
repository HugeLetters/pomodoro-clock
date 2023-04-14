import { useSetAtom } from "jotai";
import { useRef } from "react";
import { pomodoroListAtom } from "./atom.jotai";
import PomodoroClock from "./Components/Clock";
import PomodoroList from "./Components/List";
import queryLocalStorage from "./queryLocalStorage";

export default function App() {
  const dispatchPomodoroList = useSetAtom(pomodoroListAtom);
  const init = useRef(true);

  if (init) {
    dispatchPomodoroList({ type: "SET", payload: queryLocalStorage() });
    init.current = false;
  }

  return (
    <div className="max-w-full p-2">
      <PomodoroClock />
      <PomodoroList />
    </div>
  );
}
