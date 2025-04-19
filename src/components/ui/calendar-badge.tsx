import { getHumanReadableDate } from "@/utils/date";
import React from "react";

export const CalendarBadge = ({ date }: { date: string }) => (
  <div className="absolute right-5 top-5">{getHumanReadableDate(date)}</div>
);