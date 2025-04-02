
export type EventCategory = "blue" | "green" | "yellow" | "red" | "purple";

export interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  category: EventCategory;
  description?: string;
  location?: string;
}
