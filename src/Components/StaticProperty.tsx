import { Pomodoro } from "../queryLocalStorage";

type StaticPropertyProps = {
  field: Pomodoro[keyof Pomodoro];
  label: Uppercase<keyof Pomodoro>;
  children?: React.ReactNode;
};

export default function StaticProperty({ field, label, children }: StaticPropertyProps) {
  return (
    <div>
      <span>{label}: </span>
      <span>{field}</span>
      {children}
    </div>
  );
}
