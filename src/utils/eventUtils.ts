
import { Event, EventCategory } from "@/types/Event";
import { getCategoryColor } from "@/components/calendar/EventModal";
import { addDays, subDays, addHours } from "date-fns";

export const eventStyleGetter = (event: Event) => {
  const backgroundColor = getCategoryColor(event.category);
  const style = {
    backgroundColor,
    borderRadius: '4px',
    opacity: 0.8,
    color: 'white',
    border: '0px',
    display: 'block',
    padding: '2px 5px'
  };
  return {
    style
  };
};

export const generateEvents = (): Event[] => {
  const now = new Date();
  const categories: EventCategory[] = ["blue", "green", "yellow", "red", "purple"];
  
  const events: Event[] = [
    {
      id: "1",
      title: "Team Meeting",
      start: addHours(now, 2),
      end: addHours(now, 3),
      allDay: false,
      category: "blue",
      location: "Conference Room A"
    },
    {
      id: "2",
      title: "Project Deadline",
      start: addDays(now, 2),
      end: addDays(now, 2),
      allDay: true,
      category: "red",
      description: "Final submission for Q3 project"
    },
    {
      id: "3",
      title: "Lunch with Client",
      start: addDays(now, 1),
      end: addDays(now, 1),
      allDay: false,
      category: "green",
      location: "Downtown Bistro"
    },
    {
      id: "4",
      title: "Conference",
      start: subDays(now, 1),
      end: addDays(now, 1),
      allDay: true,
      category: "purple",
      description: "Annual industry conference"
    },
    {
      id: "5",
      title: "Training Session",
      start: addDays(now, 3),
      end: addDays(now, 3),
      allDay: false,
      category: "yellow",
      location: "Training Room B"
    }
  ];
  
  return events;
};
