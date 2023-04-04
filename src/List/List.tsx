import { useAtom } from "jotai";
import { pomodoroListAtom } from "../atom.jotai";
import { defaultPomodoro } from "../queryLocalStorage";
import { PomodoroListElement } from "./Element";

export function PomodoroList() {
  const [pomodoroList, dispatchPomodoroList] = useAtom(pomodoroListAtom);

  return (
    <div className="flex flex-col gap-1 bg-orange-700">
      POMODORO LIST
      {pomodoroList.map(pomodoro => (
        <PomodoroListElement
          key={pomodoro.id}
          pomodoro={pomodoro}
          deleteMe={() => dispatchPomodoroList({ type: "DELETE", payload: pomodoro.id })}
          selectMe={() => dispatchPomodoroList({ type: "SELECT", payload: pomodoro.id })}
        />
      ))}
      <button onClick={() => dispatchPomodoroList({ type: "ADD", payload: defaultPomodoro })}>
        ADD POMODORO
      </button>
    </div>
  );
}
