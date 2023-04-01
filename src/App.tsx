import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { pomodoroListAtom, selectedPomodoroAtom, selectedPomodoroIDAtom } from "./atom.jotai";
import { defaultPomodoro } from "./queryLocalStorage";

export default function App() {
  const pomodoroList = useAtomValue(pomodoroListAtom);
  const selectedPomodoroID = useAtomValue(selectedPomodoroIDAtom);

  return (
    <div className="app w-2/3 border-2 border-purple-700">
      <PomodoroClock />
      <PomodoroList />
      <button
        onPointerDown={() => {
          if (pomodoroList.length) {
            localStorage.setItem("selectedPomodoro", selectedPomodoroID);
          } else {
            localStorage.removeItem("pomodoroList");
            localStorage.removeItem("selectedPomodoro");
          }
          localStorage.setItem("pomodoroList", JSON.stringify(pomodoroList));
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
  const setSelectedPomodoro = useSetAtom(selectedPomodoroIDAtom);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _, ...addedPomodoro } = defaultPomodoro;

  return (
    <div className="flex flex-col gap-1 bg-orange-700">
      POMODORO LIST
      {pomodoroList.map(pomodoro => (
        <div
          key={pomodoro.id}
          onPointerDown={() => setSelectedPomodoro(pomodoro.id)}
          className="bg-sky-500"
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
      <button onPointerDown={() => dispatchPomodoroList({ type: "ADD", payload: addedPomodoro })}>
        ADD POMODORO
      </button>
    </div>
  );
}
