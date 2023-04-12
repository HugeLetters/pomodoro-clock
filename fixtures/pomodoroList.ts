import { Pomodoro } from "../src/queryLocalStorage";

export default [
  { name: "First", id: "RG48LCXDItCnOBCM0M_RD", pause: 5, session: 30, selected: false },
  { name: "Second", id: "laVv3DylhITHrQSgIYZmo", pause: 30, session: 10, selected: true },
  { name: "Third", id: "OIjbDml9xLCQB-N3b1_xF", pause: 1, session: 1, selected: false },
] satisfies Readonly<Required<Pomodoro>[]>;
