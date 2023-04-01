import { atom } from "jotai";
import { atomWithReducer } from "jotai/utils";
import { toast } from "react-toastify";
import immer from "immer";
import { queryLocalStorage, defaultPomodoro, Pomodoro } from "./queryLocalStorage";
import { nanoid } from "nanoid";

const initPomodoroList = queryLocalStorage();

const pomodoroListReducer = immer(
  (state: Pomodoro[], { payload, type }: PomodoroListReducerPayload) => {
    switch (type) {
      case "ADD": {
        state.push({ ...payload, id: nanoid(), selected: state.length ? false : true });
        break;
      }
      case "DELETE": {
        const deletedIndex = state.findIndex(x => x.id === payload);
        if (deletedIndex === -1) {
          console.error(`Couldn't delete Pomodoro with ID "${payload}"`);
          toast.error("There was an error trying to delete this Pomodoro");
          break;
        }
        const isSelected = state[deletedIndex].selected;
        state.splice(deletedIndex, 1);
        if (isSelected && state.length) state[0].selected = true;
        break;
      }
      case "EDIT": {
        const editedIndex = state.find(x => x.id === payload.id);
        if (!editedIndex) {
          console.error(`Couldn't edit a Pomodoro with ID "${payload.id}"`);
          toast.error("There was an error trying to edit this Pomodoro");
          break;
        }
        (editedIndex[payload.key] satisfies PomodoroFromInput[keyof PomodoroFromInput]) =
          payload.value;
        break;
      }
      case "SELECT": {
        state.forEach(pomodoro => {
          pomodoro.id === payload ? (pomodoro.selected = true) : (pomodoro.selected = false);
        });
        break;
      }
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
  | { type: "ADD"; payload: PomodoroFromInput }
  | {
      type: "EDIT";
      payload: {
        id: Pomodoro["id"];
        key: keyof PomodoroFromInput;
        value: Pomodoro[keyof PomodoroFromInput];
      };
    }
  | { type: "SELECT"; payload: Pomodoro["id"] };
type PomodoroFromInput = Omit<Pomodoro, "id" | "selected">;

export const pomodoroListAtom = atomWithReducer(initPomodoroList, pomodoroListReducer);
export const selectedPomodoroAtom = atom(get => {
  const pomodoroList = get(pomodoroListAtom);
  if (!pomodoroList.length) return defaultPomodoro;
  const selectedPomodoro = pomodoroList.find(x => x.selected);
  if (!selectedPomodoro) {
    // TODO how do I set the selected value for first pomodoro if this happens?
    toast.error("Couldn't find the selected pomodoro\nResetting the value");
    return defaultPomodoro;
  }
  return selectedPomodoro;
});
