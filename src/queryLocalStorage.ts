import { toast } from "react-toastify";

export default function queryLocalStorage(key: "pomodoroList"): Promise<Pomodoro[]>;
export default function queryLocalStorage(key: "selectedPomodoro"): Promise<string>;
export default function queryLocalStorage(key: keyof LocalStorage) {
  const rawValue = localStorage.getItem(key);
  if (!rawValue) return queryDefaultData(key);
  const result = new Promise(res => {
    res(JSON.parse(rawValue));
  }).catch(() => rawValue);
  return result;
}

function queryDefaultData(key: keyof LocalStorage) {
  console.warn(`Key "${key}" did not exist in localStorage\nDefault data was provided`);
  toast.info("Could not find requested data in local storage\nDefault data will be used instead");
  return defaultData[key];
}

export const defaultPomodoro = {
  name: "25+5 Clock",
  session: 25,
  pause: 5,
  id: "imdefaultpomodoro",
} satisfies Pomodoro;

const defaultData = {
  pomodoroList: [defaultPomodoro],
  selectedPomodoro: defaultPomodoro.id,
} satisfies LocalStorage;

export type LocalStorage<T = Pomodoro> = {
  pomodoroList: T extends string ? string : Pomodoro[];
  selectedPomodoro: string;
};

export type Pomodoro = {
  name: string;
  session: number;
  pause: number;
  id: string;
};
