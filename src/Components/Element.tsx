import { useSetAtom } from "jotai";
import { PomodoroFromInput, pomodoroListAtom } from "../atom.jotai";
import { Pomodoro } from "../queryLocalStorage";
import InputProperty from "./InputProperty";

type PomodoroListElementProps = {
  pomodoro: Pomodoro;
  deleteMe: () => void;
  selectMe: () => void;
};
export default function PomodoroListElement({
  pomodoro,
  deleteMe,
  selectMe,
}: PomodoroListElementProps) {
  const dispatchPomodoroList = useSetAtom(pomodoroListAtom);
  function editValueByKey(key: keyof PomodoroFromInput, value: string) {
    dispatchPomodoroList({
      type: "EDIT",
      payload: { id: pomodoro.id, key, value },
    });
  }

  return (
    <div
      onClick={selectMe}
      className={`${pomodoro.selected ? "bg-sky-700" : "bg-sky-300"}`}
      aria-selected={true}
    >
      <InputProperty
        field={pomodoro.name}
        label="NAME"
        edit={value => editValueByKey("name", value)}
      />
      <InputProperty
        field={pomodoro.session}
        label="SESSION"
        edit={value => editValueByKey("session", value)}
      />
      <InputProperty
        field={pomodoro.pause}
        label="PAUSE"
        edit={value => editValueByKey("pause", value)}
      />
      <button
        className=" bg-blue-800"
        onClick={event => {
          event.stopPropagation();
          deleteMe();
        }}
      >
        🗑️
      </button>
    </div>
  );
}
