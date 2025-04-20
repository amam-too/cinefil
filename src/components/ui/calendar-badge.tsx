import { getHumanReadableDate } from "@/utils/date";
import React from "react";

export const CalendarBadge = ({ date }: { date: string }) => (
  <div className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-1 text-sm font-medium text-muted-foreground shadow-sm ring-1 ring-inset ring-border">
    {getHumanReadableDate(date)}
  </div>
);
