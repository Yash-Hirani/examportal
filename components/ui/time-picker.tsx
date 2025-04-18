"use client";

import * as React from "react";
import { format } from "date-fns";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TimePicker({
  date,
  setDate,
}: {
  date?: Date;
  setDate: (date: Date | undefined) => void;
}) {
  const [selectedHour, setSelectedHour] = React.useState<string>(
    date ? format(date, "HH") : "12"
  );
  const [selectedMinute, setSelectedMinute] = React.useState<string>(
    date ? format(date, "mm") : "00"
  );

  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  React.useEffect(() => {
    if (date) {
      setSelectedHour(format(date, "HH"));
      setSelectedMinute(format(date, "mm"));
    }
  }, [date]);

  const handleTimeChange = (hour: string, minute: string) => {
    const newDate = date ? new Date(date) : new Date();
    newDate.setHours(Number.parseInt(hour, 10));
    newDate.setMinutes(Number.parseInt(minute, 10));
    newDate.setSeconds(0);
    setDate(newDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {date ? format(date, "HH:mm") : <span>Pick a time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <div className="flex gap-2">
          <Select
            value={selectedHour}
            onValueChange={(value) => {
              setSelectedHour(value);
              handleTimeChange(value, selectedMinute);
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue placeholder="Hour" />
            </SelectTrigger>
            <SelectContent>
              {hours.map((hour) => (
                <SelectItem key={hour} value={hour}>
                  {hour}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="flex items-center">:</span>
          <Select
            value={selectedMinute}
            onValueChange={(value) => {
              setSelectedMinute(value);
              handleTimeChange(selectedHour, value);
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue placeholder="Minute" />
            </SelectTrigger>
            <SelectContent>
              {minutes.map((minute) => (
                <SelectItem key={minute} value={minute}>
                  {minute}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  );
}
