import dayjs from "dayjs";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { PomodoroFromInput, pomodoroListAtom, selectedPomodoroAtom } from "../atom.jotai";
import { defaultPomodoro, Pomodoro } from "../queryLocalStorage";
import * as d3 from "d3";
import * as d3Shape from "d3-shape";
import type { PieArcDatum } from "d3";
import alarmMP3 from "../assets/alarm.mp3";
import { FaPlay, FaPause, FaFastBackward, FaForward } from "react-icons/fa";
import { IconContext } from "react-icons";
import type { IconType } from "react-icons";

export const pomodoroToastAlertID = "pomodoroClockTimerAlert";

export default function PomodoroClock() {
  const pomodoro = useAtomValue(selectedPomodoroAtom);

  useEffect(() => {
    // preload alarm sound
    fetch(alarmMP3).catch(e => {
      console.error(e);
      toast.error("Couldn't load alarm sound due to a network error");
    });
  }, []);

  return (
    <div className="flex flex-col items-center">
      <PomodoroProperties
        pomodoro={pomodoro}
        key={"props:" + pomodoro.id}
      />
      <PomodoroTimer
        session={pomodoro.session}
        pause={pomodoro.pause}
        id={pomodoro.id}
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

  const disable = pomodoro.id === defaultPomodoro.id;
  return (
    <>
      <h1 className="max-w-full break-words text-center text-2xl">{pomodoro.name}</h1>
      <div className="flex gap-8">
        <RangeProperty
          edit={value => editValueByKey("session", value)}
          field={pomodoro.session}
          label={"SESSION"}
          disable={disable}
        />
        <RangeProperty
          edit={value => editValueByKey("pause", value)}
          field={pomodoro.pause}
          label={"PAUSE"}
          disable={disable}
        />
      </div>
    </>
  );
}

type RangePropertyProps = {
  field: PomodoroFromInput[keyof PomodoroFromInput];
  label: Uppercase<keyof PomodoroFromInput>;
  disable: boolean;
  edit: (value: PomodoroFromInput[keyof PomodoroFromInput]) => void;
};

function RangeProperty({ edit, field, label, disable }: RangePropertyProps) {
  return (
    <div className="flex flex-col items-center text-lg">
      <label htmlFor={label}>{label}</label>
      <span>{field}</span>
      <input
        id={label}
        type="range"
        min={1}
        max={59}
        step={1}
        value={field}
        onChange={({ target: { value } }) => edit(value)}
        className={`mt-1 accent-current ${disable ? "opacity-0" : "opacity-100"}`}
        disabled={disable}
      />
    </div>
  );
}

const updateInterval = 500;
function PomodoroTimer({ pause, session, id }: Pick<Pomodoro, "session" | "pause" | "id">) {
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

  function reset() {
    setIsSession(true);
    setTimer(0);
    setIsPlaying(false);
  }

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
  useEffect(() => {
    reset();
  }, [id]);

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
    const alarm = new Audio(alarmMP3);
    alarm.volume = 0.15;
    alarm.play();

    setIsSession(x => !x);
    setTimer(0);
    start.current = Date.now();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFragmentOver]);

  const prevSession = useRef(session);
  const prevPause = useRef(pause);
  useEffect(() => {
    const pieGen = d3Shape.pie<number>().sort(null);
    const prevPie = pieGen([prevSession.current, prevPause.current]);
    const pie = pieGen([session, pause]);
    const arc = d3Shape.arc<PieArcDatum<number>>().innerRadius(100).outerRadius(240);

    d3.select("svg#timerPieChart>g#pieSlicesGroup")
      .selectChildren("path.pieSlice")
      .data(pie)
      .join("path")
      .transition()
      .duration(updateInterval)
      .ease(d3.easeLinear)
      .attrTween("d", function (d, i) {
        const interpolateStart = d3.interpolate(prevPie[i].startAngle, d.startAngle);
        const interpolateEnd = d3.interpolate(prevPie[i].endAngle, d.endAngle);
        return function (t) {
          return arc.startAngle(interpolateStart(t)).endAngle(interpolateEnd(t))({ ...d }) ?? "";
        };
      });

    prevSession.current = session;
    prevPause.current = pause;
  }, [pause, session]);

  useEffect(() => {
    const rotation = (360 * (timer + (isSession ? 0 : session))) / (session + pause);
    const svg = d3
      .select("svg#timerPieChart>g#pieSlicesGroup")
      .transition()
      .duration(rotation ? updateInterval : updateInterval * 0.6)
      .ease(d3.easeLinear);
    if (!rotation && isPlaying) {
      svg.style("rotate", "0deg").transition().duration(0).style("rotate", "360deg");
    } else {
      svg.style("rotate", `${360 - rotation}deg`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, pause, timer, isSession]);

  return (
    <div className="m-4 flex flex-col items-center gap-2">
      <svg
        id="timerPieChart"
        className="w-4/5 fill-current stroke-[4]"
        viewBox="0 0 500 500"
      >
        <g
          id="pieSlicesGroup"
          className="origin-center stroke-current "
        >
          {["session", "pause"].map((x, i) => (
            <path
              key={x}
              className={`pieSlice origin-center translate-x-1/2 translate-y-1/2 ${
                !i ? "fill-neutral-800" : ""
              }`}
            ></path>
          ))}
        </g>
        <rect
          x="49%"
          y="10"
          width="2%"
          height="140"
          className="stroke-neutral-800"
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={40}
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
      <IconContext.Provider value={{ size: "100%" }}>
        <div className="grid w-4/5 grid-cols-3 gap-6">
          <ControlButton
            label={isPlaying ? "pause" : "play"}
            action={() => setIsPlaying(x => !x)}
            icon={isPlaying ? <FaPause /> : <FaPlay />}
          />
          <ControlButton
            label="reset"
            action={reset}
            icon={<FaFastBackward />}
          />
          <ControlButton
            label="next section"
            action={() => {
              setIsSession(x => !x);
              setTimer(0);
              setIsPlaying(false);
            }}
            icon={<FaForward />}
          />
        </div>
      </IconContext.Provider>
    </div>
  );
}
type ControlButtonProps = {
  icon: ReturnType<IconType>;
  action: () => void;
  label: string;
};

function ControlButton({ icon, action, label }: ControlButtonProps) {
  return (
    <button
      className="rounded-md border-2 border-current bg-neutral-700 p-1 text-3xl"
      onClick={action}
      aria-label={label}
    >
      <svg viewBox="0 0 200 100">{icon}</svg>
    </button>
  );
}
