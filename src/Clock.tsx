import { useAtomValue } from "jotai";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { selectedPomodoroAtom } from "./atom.jotai";
import { Pomodoro } from "./queryLocalStorage";

export function PomodoroClock() {
  const pomodoro = useAtomValue(selectedPomodoroAtom);

  return (
    <div className=" bg-yellow-400 ">
      <h1>SELECTED POMODORO</h1>
      <div>NAME - {pomodoro.name}</div>
      <div>SESSION - {pomodoro.session}</div>
      <div>PAUSE - {pomodoro.pause}</div>
      <div>ID - {pomodoro.id}</div>
      <PomodoroTimer
        session={pomodoro.session}
        pause={pomodoro.pause}
        key={pomodoro.id}
      />
    </div>
  );
}

// todo - can I make it so changing pause while in session and vice-versa doesn't reset timer?
function PomodoroTimer({ pause, session }: Pick<Pomodoro, "session" | "pause">) {
  session = 60000 * session;
  pause = 60000 * pause;
  const loopDurationSeconds = pause + session;

  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [start, setStart] = useState(Date.now());
  const isSession = timer - session <= 0;
  const didJustReset = useRef(true);

  useEffect(() => {
    setStart(Date.now());
    if (didJustReset.current) return;
    toast.warn(`${!isSession ? "Session" : "Pause"} over`, {
      pauseOnFocusLoss: false,
      toastId: "pomodoro clock timer alert",
      autoClose: 3000,
    });
    // todo turn this on later
    false && new Audio("./src/assets/alarm.wav").play();
  }, [isSession]);

  useEffect(() => {
    didJustReset.current = true;
    setStart(Date.now() - timer);
    const interval = isPlaying
      ? setInterval(() => {
          // todo - remove 10x multiplier
          setTimer(((Date.now() - start) * 10) % loopDurationSeconds);
          didJustReset.current = false;
        }, 1000)
      : -1;
    return () => clearInterval(interval);
  }, [isPlaying, start]);

  useEffect(() => {
    setTimer(0);
    setStart(Date.now());
  }, [session, pause]);

  return (
    <div>
      <h1>TIMER</h1>
      <div>{(timer / 1000).toFixed(0)}</div>
      <div>{isSession ? "Session" : "Pause"}</div>
      <button onClick={() => setIsPlaying(state => !state)}>{isPlaying ? "PAUSE" : "PLAY"}</button>
    </div>
  );
}
