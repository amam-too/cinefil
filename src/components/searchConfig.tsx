"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import React from "react";
import { SearchParams } from "@/app/searchParams";

export default function SearchConfig() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleDisplayShown = useDebouncedCallback((value): void => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(SearchParams.DISPLAY_SHOWN, "true");
    } else {
      params.delete(SearchParams.DISPLAY_SHOWN);
    }

    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  const params = new URLSearchParams(searchParams);
  const displayShownBoolValue: boolean =
    params.get(SearchParams.DISPLAY_SHOWN) === "true" || false;
  return (
    <div className="flex flex-row items-center space-x-2 p-4">
      <Switch
        id="display-shown"
        onCheckedChange={handleDisplayShown}
        defaultChecked={displayShownBoolValue}
      />
      <Label htmlFor="display-shown">Afficher les films déjà diffusés</Label>
    </div>
  );
}
