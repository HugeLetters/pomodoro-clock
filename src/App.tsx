import { useAtom, useAtomValue } from "jotai";
import { pomodoroListAtom, selectedPomodoroAtom } from "./atom.jotai";
import { defaultPomodoro, locatlStorareKey } from "./queryLocalStorage";

export default function App() {
  const pomodoroList = useAtomValue(pomodoroListAtom);

  return (
    <div className="app w-2/3 border-2 border-purple-700">
      <PomodoroClock />
      <PomodoroList />
      <button
        onPointerDown={() => {
          localStorage.setItem(locatlStorareKey, JSON.stringify(pomodoroList));
        }}
      >
        SAVE DATA
      </button>
    </div>
  );
}

function PomodoroClock() {
  const selectedPomodoro = useAtomValue(selectedPomodoroAtom);

  return (
    <div className=" bg-yellow-400 ">
      SELECTED POMODORO
      <div>NAME - {selectedPomodoro.name}</div>
      <div>SESSION - {selectedPomodoro.session}</div>
      <div>PAUSE - {selectedPomodoro.pause}</div>
      <div>ID - {selectedPomodoro.id}</div>
      <div>CLOCK</div>
    </div>
  );
}

function PomodoroList() {
  const [pomodoroList, dispatchPomodoroList] = useAtom(pomodoroListAtom);

  return (
    <div className="flex flex-col gap-1 bg-orange-700">
      POMODORO LIST
      {pomodoroList.map(pomodoro => (
        <div
          key={pomodoro.id}
          onPointerDown={() => dispatchPomodoroList({ type: "SELECT", payload: pomodoro.id })}
          className={`${pomodoro.selected ? "bg-sky-700" : "bg-sky-300"}`}
        >
          <div className="bg-green-500 ">NAME - {pomodoro.name}</div>
          <div>SESSION - {pomodoro.session}</div>
          <div>PAUSE - {pomodoro.pause}</div>
          <div>ID - {pomodoro.id}</div>
          <button
            onPointerDown={event => {
              event.stopPropagation();
              dispatchPomodoroList({ type: "DELETE", payload: pomodoro.id });
            }}
          >
            DELETE POMODORO
          </button>
        </div>
      ))}
      <button onPointerDown={() => dispatchPomodoroList({ type: "ADD", payload: defaultPomodoro })}>
        ADD POMODORO
      </button>
    </div>
  );
}
