import { useSetAtom } from "jotai";
import { useRef, useState } from "react";
import { PomodoroFromInput, pomodoroListAtom } from "../atom.jotai";
import { Pomodoro } from "../queryLocalStorage";

type PomodoroListElementProps = {
  pomodoro: Pomodoro;
  deleteMe: () => void;
  selectMe: () => void;
};
export function PomodoroListElement({ pomodoro, deleteMe, selectMe }: PomodoroListElementProps) {
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
    >
      <EditableField
        field={pomodoro.name}
        label="NAME"
        edit={value => editValueByKey("name", value)}
      />
      <EditableField
        field={pomodoro.session}
        label="SESSION"
        edit={value => editValueByKey("session", value)}
      />
      <EditableField
        field={pomodoro.pause}
        label="PAUSE"
        edit={value => editValueByKey("pause", value)}
      />
      <div>
        <span>ID: </span>
        {pomodoro.id}
      </div>
      <button
        className=" bg-blue-800"
        onClick={event => {
          event.stopPropagation();
          deleteMe();
        }}
      >
        DELETE POMODORO
      </button>
    </div>
  );
}

type EditableFieldProps = {
  field: PomodoroFromInput[keyof PomodoroFromInput];
  label: Uppercase<keyof PomodoroFromInput>;
  edit: (value: string) => void;
};

function EditableField({ field, label, edit }: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(field.toString());
  const inputRef = useRef(document.createElement("input"));

  function onBlur() {
    setIsEditing(false);
  }
  function onKeyDown({ key }: React.KeyboardEvent) {
    if (key !== "Enter") return;
    edit(inputValue);
    setIsEditing(false);
  }
  function onButtonClick(event: React.MouseEvent) {
    event.stopPropagation();
    setInputValue(field.toString());
    setIsEditing(true);
    setTimeout(() => inputRef.current.focus(), 0);
  }

  return (
    <div>
      <span>{label}: </span>
      {isEditing ? (
        <input
          ref={inputRef}
          className="h-5 rounded-md bg-sky-400"
          onChange={({ target: { value } }) => setInputValue(value)}
          value={inputValue}
          onClick={e => e.stopPropagation()}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
        />
      ) : (
        <span>{field}</span>
      )}
      {!isEditing && (
        <button
          className="m-1 rounded-md border bg-sky-500 px-1 text-xs font-bold"
          onClick={onButtonClick}
        >
          edit
        </button>
      )}
    </div>
  );
}
