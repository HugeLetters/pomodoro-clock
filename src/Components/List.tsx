import { useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";
import { pomodoroListAtom, selectedPomodoroAtom } from "../atom.jotai";
import { defaultPomodoro } from "../queryLocalStorage";
import PomodoroListElement from "./Element";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { toast } from "react-toastify";
import { AiFillPlusSquare } from "react-icons/ai";

export default function PomodoroList() {
  const [pomodoroList, dispatchPomodoroList] = useAtom(pomodoroListAtom);
  const selectedPomodoro = useAtomValue(selectedPomodoroAtom);
  useEffect(() => {
    if (!(selectedPomodoro.id === defaultPomodoro.id && pomodoroList.length)) return;
    dispatchPomodoroList({ type: "SELECT", payload: pomodoroList[0].id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPomodoro]);
  useEffect(() => {
    if (!pomodoroList.length)
      toast.info("You can press button at the top left to save your pomodoros for later");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [parent] = useAutoAnimate();

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="flex max-w-full flex-col gap-2"
        ref={parent}
      >
        {pomodoroList.map(pomodoro => (
          <PomodoroListElement
            key={pomodoro.id}
            pomodoro={pomodoro}
            deleteMe={() => dispatchPomodoroList({ type: "DELETE", payload: pomodoro.id })}
            selectMe={() => dispatchPomodoroList({ type: "SELECT", payload: pomodoro.id })}
          />
        ))}
      </div>
      <button
        onClick={() => dispatchPomodoroList({ type: "ADD", payload: defaultPomodoro })}
        className="w-10 self-center"
        aria-label="add"
      >
        <AiFillPlusSquare size="100%" />
      </button>
    </div>
  );
}
