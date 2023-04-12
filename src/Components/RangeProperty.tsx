import { useState } from "react";
import { PomodoroFromInput } from "../atom.jotai";

type RangePropertyProps = {
  field: PomodoroFromInput[keyof PomodoroFromInput];
  label: Uppercase<keyof PomodoroFromInput>;
  edit: (value: PomodoroFromInput[keyof PomodoroFromInput]) => void;
};

export default function RangeProperty({ edit, field, label }: RangePropertyProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [range, setRange] = useState(field);

  return (
    <div>
      <div>
        {label}: <span>{isEditing ? range : field}</span>
        <button
          className="m-1 rounded-md border bg-sky-500 px-1 text-xs font-bold"
          onClick={() => {
            isEditing && edit(range);
            !isEditing && setRange(field);
            setIsEditing(x => !x);
          }}
        >
          {isEditing ? "💾" : "✏️"}
        </button>
        {isEditing && (
          <button
            onClick={() => {
              setIsEditing(false);
              setRange(field);
            }}
            className="m-1 rounded-md border bg-sky-500 px-1 text-xs font-bold"
          >
            ↩️
          </button>
        )}
      </div>
      {isEditing && (
        <input
          type="range"
          min={1}
          max={59}
          step={1}
          value={range}
          onChange={({ target: { value } }) => setRange(value)}
          className="accent-emerald-500"
        />
      )}
    </div>
  );
}
