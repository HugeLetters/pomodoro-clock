import { toast } from "react-toastify";
import { z } from "zod";

export const localStorageKey = "pomodoroList" as const;

export default function queryLocalStorage() {
  const data = localStorage.getItem(localStorageKey);
  if (!data) return [];
  const parseResult = z
    .array(
      pomodoroSchema.catch({
        id: "",
        name: "",
        pause: 0,
        selected: false,
        session: 0,
      })
    )
    .safeParse(JSON.parse(data));
  if (!parseResult.success) {
    console.error("localStorage validation error. See next log message");
    console.error(parseResult.error.issues);
    localStorage.removeItem(localStorageKey);
    toast.error("Your localStorage data was corrupted\nApplication data has been cleared.");
    return [];
  }
  const result = parseResult.data;
  const filteredResult = result.filter(({ id }) => Boolean(id));
  if (filteredResult.length < result.length) {
    toast.warn("Some of your Pomodoros data was corrupted\nCorrupted data was deleted");
    localStorage.setItem(localStorageKey, JSON.stringify(filteredResult));
  }
  return filteredResult;
}

export const defaultPomodoro = {
  name: "25+5 Clock",
  session: 25,
  pause: 5,
  id: "iAmaDefaultPomodoro",
  selected: true,
} as const satisfies Pomodoro;

export const pomodoroSchema = z.object({
  name: z.coerce.string({ invalid_type_error: "Value must be a string" }).min(1).max(255),
  session: z.coerce.number({ invalid_type_error: "Value must be an integer" }).min(1).max(59).int(),
  pause: z.coerce.number({ invalid_type_error: "Value must be an integer" }).min(1).max(59).int(),
  selected: z.boolean(),
  id: z.string().min(1),
});

export type Pomodoro = z.infer<typeof pomodoroSchema>;
