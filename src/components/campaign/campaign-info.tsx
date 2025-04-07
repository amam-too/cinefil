"use client";

import {useEffect, useState} from "react";
import {getCurrentCampaign} from "@/server/services/campaigns";

/**
 * Formats the time remaining until the target date in the form "DDj HHh MMm SSs".
 * @param targetDate The future date to count down to.
 * @returns A formatted countdown string.
 */
function formatCountdown(targetDate: Date): string {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) {
    return "00j 00h 00m 00s";
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${String(days).padStart(2, "0")}j ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
}

/**
 * Generates an .ics (iCalendar) file content for the given screening date.
 * @param screeningDate The date and time of the screening.
 * @returns The full content of the ICS file as a string.
 */
function generateICS(screeningDate: Date): string {
  const start =
    screeningDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const endDate = new Date(screeningDate.getTime() + 2 * 60 * 60 * 1000); // 2h duration
  const end = endDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//CinéFIL//EN
BEGIN:VEVENT
UID:${Date.now()}@cinefil.com
DTSTAMP:${start}
DTSTART:${start}
DTEND:${end}
SUMMARY:🎬 Séance CinéFIL ! 🍿
DESCRIPTION:Rejoins-nous pour une nouvelle projection cinéma ! 🎞️
LOCATION:Salle de projection habituelle
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;
}

/**
 * Converts a date into a string formatted as "YYYY-MM-DD" for file naming.
 * @param date The date to format.
 * @returns The formatted date string.
 */
function formatDateForFilename(date: Date): string {
  return date.toISOString().split("T")[0] ?? "date-manquante";
}

/**
 * Triggers a download of the given ICS content with the specified filename.
 * @param icsContent The ICS content to be saved.
 * @param filename The filename for the download (defaults to "seance-cinefil.ics").
 */
function downloadICSFile(icsContent: string, filename = "seance-cinefil.ics") {
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function CampaignInfo() {
  const [screeningDate, setScreeningDate] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState<string>("...");

  useEffect(() => {
    let interval: NodeJS.Timeout;

    async function fetchCampaign() {
      try {
        const campaign = await getCurrentCampaign();
        const date = new Date(campaign.screening_datetime);
        setScreeningDate(date);
        setCountdown(formatCountdown(date));

        interval = setInterval(() => {
          setCountdown(formatCountdown(date));
        }, 1000);
      } catch (error) {
        console.error("Erreur lors de la récupération de la campagne:", error);
      }
    }

    void fetchCampaign();

    return () => clearInterval(interval);
  }, []);

  const handleDownloadICS = () => {
    if (!screeningDate) return;

    const ics = generateICS(screeningDate);
    const formattedDate = formatDateForFilename(screeningDate);
    const filename = `seance-cinefil-${formattedDate}.ics`;
    downloadICSFile(ics, filename);
  };

  return (
    <div
      className="z-30 flex cursor-pointer flex-col items-center text-white transition hover:opacity-90"
      onClick={handleDownloadICS}
      title="Cliquez pour ajouter à votre calendrier"
    >
      {screeningDate ? (
        <>
          <span className="text-sm opacity-80">
            Prochaine séance le {screeningDate.toLocaleString("fr-FR")}
          </span>
          <span className="text-lg font-semibold">{countdown}</span>
        </>
      ) : (
        <span className="text-sm opacity-80">Chargement...</span>
      )}
    </div>
  );
}
