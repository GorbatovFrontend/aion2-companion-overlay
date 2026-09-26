import type { Priority } from "../types";

export function PriorityBadge({ value }: { value: Priority }) {
  return <span className={`priority priority-${value.toLowerCase()}`}>{value}</span>;
}
