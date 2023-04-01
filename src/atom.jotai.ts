import { atom } from "jotai";
import { atomWithReducer } from "jotai/utils";
import { toast } from "react-toastify";
import immer from "immer";
import queryLocalStorage, { defaultPomodoro, Pomodoro } from "./queryLocalStorage";
import { nanoid } from "nanoid";

const initPomodoroList = await queryLocalStorage("pomodoroList");
const initselectedPomodoroID = await queryLocalStorage("selectedPomodoro");

const pomodoroListReducer = immer(
  (state: Pomodoro[], { payload, type }: PomodoroListReducerPayload) => {
    let utilVar;
    switch (type) {
      case "ADD":
        state.push({ ...payload, id: nanoid() });
        break;
      case "DELETE":
        return state.filter(x => x.id !== payload);
      case "EDIT":
        utilVar = state.find(x => x.id === payload.id);
        if (!utilVar) {
          console.error(`Couldn't edit a Pomodoro with id "${payload.id}"`);
          toast("There was an error trying to edit this Pomodoro");
          break;
        }
        (utilVar[payload.key] satisfies Pomodoro[keyof Pomodoro]) = payload.value;
        break;
      default:
        return state;
    }
  }
);

export type PomodoroListReducerPayload =
  | {
      type: "DELETE";
      payload: Pomodoro["id"];
    }
  | { type: "ADD"; payload: Omit<Pomodoro, "id"> }
  | {
      type: "EDIT";
      payload: { id: Pomodoro["id"]; key: keyof Pomodoro; value: Pomodoro[keyof Pomodoro] };
    };

export const pomodoroListAtom = atomWithReducer(initPomodoroList, pomodoroListReducer);

export const selectedPomodoroIDAtom = atom(initselectedPomodoroID);
export const selectedPomodoroAtom = atom(get => {
  const pomodoroList = get(pomodoroListAtom);
  const selectedPomodoroID = get(selectedPomodoroIDAtom);

  if (selectedPomodoroID === defaultPomodoro.id) return defaultPomodoro;

  const selectedPomodoro = pomodoroList.find(pomodoro => pomodoro.id === selectedPomodoroID);

  if (!selectedPomodoro) {
    console.error(`Could not retrieve pomodoro with ID "${selectedPomodoroID}"`);
    const firstPomodoro = pomodoroList[0];
    if (!firstPomodoro) {
      pomodoroList.length &&
        toast.error(
          "There was an error trying to select this pomodoro\nA default one was used instead"
        );
      return defaultPomodoro;
    }
    toast.error("There was an error trying to select this pomodoro\nA first one was used instead");
    return firstPomodoro;
  }

  return selectedPomodoro;
});
