import { useRef, useState } from "react";
import { PomodoroFromInput } from "../atom.jotai";

type InputPropertyProps = {
  field: PomodoroFromInput[keyof PomodoroFromInput];
  label: Uppercase<keyof PomodoroFromInput>;
  edit: (value: string) => void;
};

export default function InputProperty({ field, label, edit }: InputPropertyProps) {
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
    <div>
      <span>{label}: </span>
      {isEditing ? (
        <input
          ref={inputRef}
          className="h-5 rounded-md bg-neutral-600 "
          onChange={({ target: { value } }) => setInputValue(value)}
          value={inputValue}
          onClick={e => e.stopPropagation()}
          onBlur={onBlur}
          onFocus={() => clearTimeout(blurTimeout.current)}
          onKeyDown={onKeyDown}
        />
      ) : (
        <span className="break-words">{field}</span>
      )}
      <button
        className="m-1 rounded-md border bg-neutral-500 px-1 text-xs "
        onClick={onButtonClick}
        ref={buttonRef}
      >
        {isEditing ? "💾" : "✏️"}
      </button>
    </div>
  );
}
