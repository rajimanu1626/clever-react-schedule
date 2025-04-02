
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { NylasScheduling } from "@nylas/react";
import { Event } from "@/types/Event";
import { Button } from "@/components/ui/button";

interface SchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (start: Date, end: Date) => void;
}

const SchedulerModal = ({ isOpen, onClose, onSchedule }: SchedulerModalProps) => {
  const [apiKey, setApiKey] = useState<string>(
    localStorage.getItem("nylasApiKey") || ""
  );
  const [configurationId, setConfigurationId] = useState<string>(
    localStorage.getItem("nylasConfigId") || ""
  );

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setApiKey(value);
    localStorage.setItem("nylasApiKey", value);
  };

  const handleConfigIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfigurationId(value);
    localStorage.setItem("nylasConfigId", value);
  };

  const handleScheduleSuccess = (data: any) => {
    if (data.event) {
      const start = new Date(data.event.start_time * 1000);
      const end = new Date(data.event.end_time * 1000);
      onSchedule(start, end);
    }
  };

  if (!apiKey || !configurationId) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogTitle>Nylas Configuration Required</DialogTitle>
          <DialogDescription>
            Please enter your Nylas API key and Configuration ID to use the scheduler component.
          </DialogDescription>
          <div className="space-y-4 mt-4">
            <div>
              <label htmlFor="apiKey" className="text-sm font-medium">Nylas API Key</label>
              <input
                id="apiKey"
                type="text"
                className="w-full p-2 border rounded mt-1"
                placeholder="Nylas API Key"
                value={apiKey}
                onChange={handleApiKeyChange}
              />
            </div>
            <div>
              <label htmlFor="configId" className="text-sm font-medium">Configuration ID</label>
              <input
                id="configId"
                type="text"
                className="w-full p-2 border rounded mt-1"
                placeholder="Configuration ID"
                value={configurationId}
                onChange={handleConfigIdChange}
              />
            </div>
            <Button 
              onClick={onClose} 
              className="w-full"
            >
              Save Configuration
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90vw] h-[80vh]">
        <DialogTitle>Schedule Meeting</DialogTitle>
        <DialogDescription>Select a time for your meeting.</DialogDescription>
        <div className="h-full mt-4">
          <NylasScheduling
            configurationId={configurationId}
            onSuccess={handleScheduleSuccess}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SchedulerModal;
