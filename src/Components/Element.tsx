import { useSetAtom } from "jotai";
import { useRef, useState } from "react";
import { PomodoroFromInput, pomodoroListAtom } from "../atom.jotai";
import { Pomodoro } from "../queryLocalStorage";
import { BsTrashFill } from "react-icons/bs";
import { IoIosSave } from "react-icons/io";
import { AiFillEdit } from "react-icons/ai";

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
      className={`flex flex-col items-center gap-2 rounded-lg p-2 transition-colors duration-300 ${
        pomodoro.selected ? "bg-neutral-500" : "bg-neutral-700"
      }`}
      aria-selected={true}
    >
      <div className="max-w-full self-stretch text-lg">
        <InputProperty
          field={pomodoro.name}
          label="NAME"
          edit={value => editValueByKey("name", value)}
        />
      </div>
      <div className="grid w-full grid-cols-9 gap-2 text-sm ">
        <div className="m-w-full col-span-4 flex justify-center gap-1">
          <span>Session:</span>
          <InputProperty
            field={pomodoro.session}
            label="SESSION"
            edit={value => editValueByKey("session", value)}
          />
        </div>
        <div className="m-w-full  col-span-4 flex justify-center gap-1">
          <span>Pause:</span>
          <InputProperty
            field={pomodoro.pause}
            label="PAUSE"
            edit={value => editValueByKey("pause", value)}
          />
        </div>
        <button
          onClick={event => {
            event.stopPropagation();
            deleteMe();
          }}
          aria-label="delete"
          className="col-span-1 w-5 self-end"
        >
          <BsTrashFill size="100%" />
        </button>
      </div>
    </div>
  );
}

type InputPropertyProps = {
  field: PomodoroFromInput[keyof PomodoroFromInput];
  label: Uppercase<keyof PomodoroFromInput>;
  edit: (value: string) => void;
};

function InputProperty({ field, label, edit }: InputPropertyProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(field.toString());
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const blurTimeout = useRef(0);
  function onBlur(event: React.FocusEvent) {
    if (event.relatedTarget !== buttonRef.current) return setIsEditing(false);
    blurTimeout.current = setTimeout(() => setIsEditing(false), 1500);
  }
  function onKeyDown({ key }: React.KeyboardEvent) {
    if (key !== "Enter") return;
    edit(inputValue);
    setIsEditing(false);
  }
  function onButtonClick(event: React.MouseEvent) {
    event.stopPropagation();
    setIsEditing(x => !x);
    clearTimeout(blurTimeout.current);

    if (isEditing) {
      inputRef.current?.blur();
      return edit(inputValue);
    }
    setInputValue(field.toString());
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  return (
    <div className="flex items-center justify-center">
      {isEditing ? (
        <input
          ref={inputRef}
          className="w-full rounded-md bg-neutral-600 "
          onChange={({ target: { value } }) => setInputValue(value)}
          value={inputValue}
          onClick={e => e.stopPropagation()}
          onBlur={onBlur}
          onFocus={() => clearTimeout(blurTimeout.current)}
          onKeyDown={onKeyDown}
          aria-label={label}
        />
      ) : (
        <span className=" overflow-hidden text-ellipsis whitespace-nowrap ">{field}</span>
      )}
      <button
        className="ml-1 h-4 w-6 shrink-0 rounded-md border bg-neutral-500 p-[1] "
        onClick={onButtonClick}
        ref={buttonRef}
        aria-label={isEditing ? "save" : "edit"}
      >
        {isEditing ? <IoIosSave size="100%" /> : <AiFillEdit size="100%" />}
      </button>
    </div>
  );
}
