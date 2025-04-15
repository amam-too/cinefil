"use server"

import { createClient } from "@/utils/supabase/server";

export interface Campaign {
    id: string;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    venue: string;
    screening_datetime: string;
    proposal_limit: number;
    created_at: string;
    updated_at: string;
    created_by: string;
}

export async function getCurrentCampaign(): Promise<Campaign> {
    const supabase = await createClient();
    
    const now = new Date().toISOString();
    
    const {data: campaignData, error: campaignError} = await supabase
        .from("campaigns")
        .select()
        .lte("start_date", now)
        .order("start_date", {ascending: false})
        .limit(1);
    
    if (!campaignData) {
        throw new Error("Campaign not found.");
    }
    
    const data = campaignData[0]
    
    if (!data) {
        console.error("No campaign data found.");
        throw new Error("Campaign not found.");
    }
    
    if (campaignError) {
        throw new Error("Could not get campaign");
    }
    
    return data as Campaign;
}