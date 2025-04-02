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
    
    const {data: campaignData, error: campaignError} = await supabase
        .from("campaigns")
        .select()
        .lte("start_date", new Date().toISOString())
        .order("start_date")
        .single()
    
    if (!campaignData || campaignError) {
        throw new Error(campaignError?.message ?? "No campaign was found.");
    }
    
    return campaignData as Campaign;
}