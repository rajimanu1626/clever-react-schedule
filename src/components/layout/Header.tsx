
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalendarIcon } from "lucide-react";

interface HeaderProps {
  onCreateEvent: () => void;
}

const Header = ({ onCreateEvent }: HeaderProps) => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2">
        <CalendarIcon className="h-6 w-6 text-blue-500" />
        <h1 className="text-xl font-semibold">React Calendar</h1>
      </div>
      <Button className="flex items-center gap-1" onClick={onCreateEvent}>
        <Plus size={16} /> Create Event
      </Button>
    </header>
  );
};

export default Header;
