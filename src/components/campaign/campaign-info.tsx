"use client";

import {useEffect, useState, useMemo, useCallback} from "react";
import {getCurrentCampaign} from "@/server/services/campaigns";

interface Campaign {
  screening_datetime: string;
}

interface CountdownState {
  countdown: string;
  screeningDate: Date | null;
  error: string | null;
  isLoading: boolean;
  hasPassed: boolean;
}

/**
 * Formats a date to French locale string
 */
const formatDateToFrench = (date: Date): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(date);
};

/**
 * Formats the time remaining until the target date in the form "DDj HHh MMm SSs".
 */
function formatCountdown(targetDate: Date): { countdown: string; hasPassed: boolean } {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) {
    return { countdown: "00j 00h 00m 00s", hasPassed: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    countdown: `${String(days).padStart(2, "0")}j ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`,
    hasPassed: false
  };
}

interface ICSData {
  start: Date;
  end: Date;
  summary: string;
  description: string;
  location: string;
}

/**
 * Generates an .ics (iCalendar) file content for the given screening date.
 */
function generateICS(data: ICSData): string {
  const formatDate = (date: Date) => 
    date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//CinéFIL//EN
BEGIN:VEVENT
UID:${Date.now()}@cinefil.com
DTSTAMP:${formatDate(data.start)}
DTSTART:${formatDate(data.start)}
DTEND:${formatDate(data.end)}
SUMMARY:${data.summary}
DESCRIPTION:${data.description}
LOCATION:${data.location}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;
}

/**
 * Custom hook to manage the countdown state and campaign data
 */
function useCountdown(): CountdownState {
  const [state, setState] = useState<CountdownState>({
    countdown: "...",
    screeningDate: null,
    error: null,
    isLoading: true,
    hasPassed: false,
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let mounted = true;

    async function fetchCampaign() {
      try {
        const campaign = await getCurrentCampaign();
        
        if (!mounted) return;
        
        if (!campaign) {
          setState(prev => ({ 
            ...prev, 
            countdown: "Aucune campagne en cours",
            isLoading: false 
          }));
          return;
        }

        const date = new Date(campaign.screening_datetime);
        const { countdown, hasPassed } = formatCountdown(date);
        
        setState(prev => ({
          ...prev,
          screeningDate: date,
          countdown,
          hasPassed,
          isLoading: false,
        }));

        interval = setInterval(() => {
          if (!mounted) return;
          const { countdown, hasPassed } = formatCountdown(date);
          setState(prev => ({
            ...prev,
            countdown,
            hasPassed,
          }));
        }, 1000);
      } catch (error) {
        if (!mounted) return;
        console.error("Erreur lors de la récupération de la campagne:", error);
        setState(prev => ({
          ...prev,
          countdown: "Erreur de chargement",
          error: error instanceof Error ? error.message : "Une erreur est survenue",
          isLoading: false,
        }));
      }
    }

    void fetchCampaign();

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return state;
}

/**
 * CampaignInfo component displays the current campaign's screening date and countdown
 */
export default function CampaignInfo() {
  const { countdown, screeningDate, error, isLoading, hasPassed } = useCountdown();

  const handleDownloadICS = useCallback(() => {
    if (!screeningDate) return;

    const icsData: ICSData = {
      start: screeningDate,
      end: new Date(screeningDate.getTime() + 2 * 60 * 60 * 1000), // 2h duration
      summary: "🎬 Séance CinéFIL ! 🍿",
      description: "Rejoins-nous pour une nouvelle projection cinéma ! 🎞️",
      location: "Salle de projection habituelle",
    };

    const ics = generateICS(icsData);
    const formattedDate = screeningDate.toISOString().split("T")[0] ?? "date-manquante";
    const filename = `seance-cinefil-${formattedDate}.ics`;
    
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [screeningDate]);

  const content = useMemo(() => {
    if (isLoading) {
      return <span className="text-sm opacity-80">Chargement...</span>;
    }

    if (error) {
      return <span className="text-sm text-red-500">{error}</span>;
    }

    if (screeningDate) {
      return (
        <>
          <span className="text-sm opacity-80">
            {hasPassed ? (
              <>Dernière séance le {formatDateToFrench(screeningDate)}</>
            ) : (
              <>Prochaine séance le {formatDateToFrench(screeningDate)}</>
            )}
          </span>
          <span className={`text-lg font-semibold ${hasPassed ? 'text-gray-400' : ''}`}>
            {hasPassed ? 'Séance terminée' : countdown}
          </span>
        </>
      );
    }

    return <span className="text-sm opacity-80">{countdown}</span>;
  }, [isLoading, error, screeningDate, countdown, hasPassed]);

  return (
    <div
      className={`z-30 flex cursor-pointer flex-col items-center text-white transition hover:opacity-90 ${hasPassed ? 'opacity-70' : ''}`}
      onClick={handleDownloadICS}
      title={screeningDate ? "Cliquez pour ajouter à votre calendrier" : undefined}
    >
      {content}
    </div>
  );
}
