import { useAtomValue } from "jotai";
import { useState } from "react";
import { toast } from "react-toastify";
import { pomodoroListAtom } from "../atom.jotai";
import { localStorageKey } from "../queryLocalStorage";
import tomatoPNG from "../assets/tomato.png";

export default function FixedButtons() {
  const [toggle, setToggle] = useState(false);

  return (
    <>
      <button
        onClick={() => setToggle(x => !x)}
        className="fixed left-1 top-1  "
        aria-label="manage cache"
      >
        <svg
          viewBox="0 0 50 50"
          className={`w-5 fill-current stroke-[5] ${!toggle ? "motion-safe:animate-pulse " : ""} `}
        >
          <clipPath id="circleClip">
            <circle
              cx="50%"
              cy="50%"
              r="50%"
            ></circle>
          </clipPath>
          <circle
            cx="50%"
            cy="50%"
            r="50%"
          ></circle>
          <image
            href={tomatoPNG}
            width="40"
            className={`translate-x-[5px] translate-y-[4px] transition-opacity duration-500 ${
              toggle ? "opacity-0" : "opacity-100"
            }`}
          />
          <path
            d="M0,0L50,50M50,0L0,50"
            className={` transition-colors duration-500 ${
              toggle ? "stroke-neutral-800" : "stroke-transparent"
            } `}
            clipPath="url(#circleClip)"
          />
        </svg>
      </button>
      <div
        className={`fixed top-8 grid gap-y-3 transition-[opacity_left] duration-500 ${
          toggle ? "left-1 opacity-100 " : " -left-[100%] opacity-0"
        }  `}
      >
        <SaveButton disabled={!toggle} />
        <ClearCacheButton
          key={toggle.toString()}
          disabled={!toggle}
        />
      </div>
    </>
  );
}

function SaveButton({ disabled }: { disabled: boolean }) {
  const pomodoroList = useAtomValue(pomodoroListAtom);

  return (
    <button
      className="rounded-md border border-black  bg-neutral-500 p-3"
      onClick={() => {
        localStorage.setItem(localStorageKey, JSON.stringify(pomodoroList));
        toast.success("Data was saved to browser cache");
      }}
      disabled={disabled}
    >
      SAVE DATA
    </button>
  );
}

function ClearCacheButton({ disabled }: { disabled: boolean }) {
  const [toggle, setToggle] = useState(false);

  return (
    <div className="relative gap-1">
      <button
        className=" rounded-md border border-black bg-neutral-500 p-3"
        onClick={() => setToggle(x => !x)}
        disabled={disabled}
      >
        CLEAR CACHE
      </button>
      <div
        className={`absolute left-0 top-0 -z-10 grid grid-cols-2 gap-1 ${
          toggle ? "translate-x-[117%] opacity-100" : "translate-x-0 opacity-0"
        }  transition-[opacity_translate]`}
      >
        <button
          onClick={() => {
            setToggle(false);
            localStorage.removeItem(localStorageKey);
            toast.warn("Data was cleared from browser cache");
          }}
          className="rounded-md border border-black bg-green-500 p-3"
          disabled={!toggle}
        >
          Yes
        </button>
        <button
          onClick={() => setToggle(false)}
          className="rounded-md border border-black bg-red-500 p-3"
          disabled={!toggle}
        >
          No
        </button>
      </div>
    </div>
  );
}
