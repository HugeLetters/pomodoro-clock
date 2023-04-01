export const locatlStorareKey = "pomodoroList" as const;

export function queryLocalStorage(): Pomodoro[];
export function queryLocalStorage() {
  const rawValue = localStorage.getItem(locatlStorareKey);
  if (!rawValue) return [];
  return JSON.parse(rawValue);
}

export const defaultPomodoro = {
  name: "25+5 Clock",
  session: 25,
  pause: 5,
  id: "iAmaDefaultPomodoro",
  selected: true,
} satisfies Pomodoro;

export type Pomodoro = {
  name: string;
  session: number;
  pause: number;
  selected: boolean;
  id: string;
};
