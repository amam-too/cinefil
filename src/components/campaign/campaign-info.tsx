"use client";

import { useEffect, useState } from "react";
import { getCurrentCampaign } from "@/server/services/campaigns";

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

export default function CampaignInfo() {
  const [screeningDate, setScreeningDate] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState<string>("...");

  useEffect(() => {
    async function fetchCampaign() {
      try {
        const campaign = await getCurrentCampaign();
        const date = new Date(campaign.screening_datetime);
        setScreeningDate(date);
        setCountdown(formatCountdown(date));

        // Update countdown every second.
        const interval = setInterval(() => {
          setCountdown(formatCountdown(date));
        }, 1000);

        return () => clearInterval(interval);
      } catch (error) {
        console.error("Error fetching campaign:", error);
      }
    }

    void fetchCampaign();
  }, []);

  return (
    <div className="z-30 flex flex-col items-center text-white">
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
