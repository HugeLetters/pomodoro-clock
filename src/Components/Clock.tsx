import dayjs from "dayjs";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { PomodoroFromInput, pomodoroListAtom, selectedPomodoroAtom } from "../atom.jotai";
import InputProperty from "./InputProperty";
import { defaultPomodoro, Pomodoro } from "../queryLocalStorage";
import RangeProperty from "./RangeProperty";
import StaticProperty from "./StaticProperty";
import * as d3 from "d3";
import * as d3Shape from "d3-shape";
import type { PieArcDatum } from "d3";
import alarmWAV from "../assets/alarm.wav";

export const pomodoroToastAlertID = "pomodoroClockTimerAlert";

export default function PomodoroClock() {
  const pomodoro = useAtomValue(selectedPomodoroAtom);

  return (
    <div>
      <PomodoroProperties
        pomodoro={pomodoro}
        key={"props:" + pomodoro.id}
      />
      <PomodoroTimer
        session={pomodoro.session}
        pause={pomodoro.pause}
        key={"timer:" + pomodoro.id}
      />
    </div>
  );
}

type PomodoroPropertiesProps = {
  pomodoro: Pomodoro;
};

function PomodoroProperties({ pomodoro }: PomodoroPropertiesProps) {
  const dispatchPomodoroList = useSetAtom(pomodoroListAtom);
  function editValueByKey(
    key: keyof PomodoroFromInput,
    value: PomodoroFromInput[keyof PomodoroFromInput]
  ) {
    dispatchPomodoroList({
      type: "EDIT",
      payload: { id: pomodoro.id, key, value },
    });
  }

  return (
    <div>
      {pomodoro.id === defaultPomodoro.id ? (
        <>
          <StaticProperty
            field={pomodoro.name}
            label="NAME"
          />
          <StaticProperty
            field={pomodoro.session}
            label="SESSION"
          />
          <StaticProperty
            field={pomodoro.pause}
            label="PAUSE"
          />
        </>
      ) : (
        <>
          <InputProperty
            edit={value => editValueByKey("name", value)}
            field={pomodoro.name}
            label={"NAME"}
          />
          <RangeProperty
            edit={value => editValueByKey("session", value)}
            field={pomodoro.session}
            label={"SESSION"}
          />
          <RangeProperty
            edit={value => editValueByKey("pause", value)}
            field={pomodoro.pause}
            label={"PAUSE"}
          />
        </>
      )}
    </div>
  );
}

const updateInterval = 500;
function PomodoroTimer({ pause, session }: Pick<Pomodoro, "session" | "pause">) {
  session = 60000 * session;
  pause = 60000 * pause;
  const start = useRef(Date.now());
  const [isPlaying, setIsPlaying] = useState(false);
  // goes from 0 to session|pause
  const [timer, setTimer] = useState(0);
  const [isSession, setIsSession] = useState(true);
  const fragmentDuration = isSession ? session : pause;
  const isFragmentOver = timer > fragmentDuration;
  let preventFragmentOver = false;

  // field editing
  useEffect(() => {
    if (!isSession) return;
    start.current = Date.now();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    preventFragmentOver = true;
    setTimer(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);
  useEffect(() => {
    if (isSession) return;
    start.current = Date.now();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    preventFragmentOver = true;
    setTimer(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pause]);

  // Start up a timer
  useEffect(() => {
    if (!isPlaying) return;
    start.current = Date.now() - timer;
    const interval = setInterval(() => {
      setTimer(Date.now() - start.current);
    }, updateInterval);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  // Run an alert when a pomodoro fragment ends
  useEffect(() => {
    if (!isFragmentOver || preventFragmentOver) return;

    toast.info(`${!isSession ? "Pause" : "Session"} over`, {
      pauseOnFocusLoss: false,
      toastId: pomodoroToastAlertID,
      autoClose: 3000,
    });
    const alarm = new Audio(alarmWAV);
    alarm.volume = 0.15;
    // todo turn this on later
    false && alarm.play();

    setIsSession(x => !x);
    setTimer(0);
    start.current = Date.now();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFragmentOver]);

  useEffect(() => {
    const data = [session, pause];
    const svg = d3.select("svg#timerPieChart>g#pieSlicesGroup");
    const pie = d3Shape.pie<number>().sort(null)(data);
    const arc = d3Shape.arc<PieArcDatum<number>>().innerRadius(100).outerRadius(250);
    const rotation = (360 * (timer + (isSession ? 0 : session))) / (session + pause);
    const pieSlices = svg
      .selectChildren("path.pieSlice")
      .data(pie)
      .join("path")
      .classed("pieSlice", true)
      .style("translate", "50% 50%")
      .attr("d", arc)
      .transition()
      .duration(rotation ? updateInterval : updateInterval * 0.6)
      .ease(d3.easeLinear)
      .attr("fill", (_, i) => `hsl(${180 * i + rotation},80%,60%)`);

    if (!rotation) {
      pieSlices.style("rotate", "0deg").transition().duration(0).style("rotate", "360deg");
    } else {
      pieSlices.style("rotate", `${360 - rotation}deg`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, pause, timer, isSession]);

  return (
    <div>
      <svg
        id="timerPieChart"
        className="w-52"
        viewBox="0 0 500 500"
      >
        <g id="pieSlicesGroup" />
        <rect
          width="2%"
          height="150"
          x="49%"
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={40}
          className="fill-slate-100"
        >
          <tspan dy="-20">{isSession ? "Session" : "Pause"}</tspan>
          <tspan
            x="50%"
            dy="60"
          >
            {dayjs(fragmentDuration - timer).format("mm:ss")}
          </tspan>
        </text>
      </svg>
      <button
        onClick={() => setIsPlaying(x => !x)}
        className="m-1  rounded-md border-2 border-blue-900 bg-sky-500 p-0.5 px-2 text-3xl"
      >
        {!isPlaying ? "▶️" : "⏸️"}
      </button>
      <button
        className="m-1  rounded-md border-2 border-blue-900 bg-sky-500 p-0.5 px-2 text-3xl"
        onClick={() => {
          setIsSession(true);
          setTimer(0);
          setIsPlaying(false);
        }}
      >
        ⏮️
      </button>
      <button
        className="m-1  rounded-md border-2 border-blue-900 bg-sky-500 p-0.5 px-2 text-3xl"
        onClick={() => {
          setIsSession(x => !x);
          setTimer(0);
          setIsPlaying(false);
        }}
      >
        ⏩
      </button>
    </div>
  );
}
