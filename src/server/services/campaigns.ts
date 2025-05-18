"use server"

import { withDatabase } from "@/utils/database";
import { AppError, ErrorCodes, ErrorMessages } from "@/types/errors";

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

export async function getCurrentCampaign(): Promise<Campaign | null> {
    return await withDatabase(async (supabase) => {
        const now = new Date().toISOString();
        
        const { data: campaignData, error: campaignError } = await supabase
            .from("campaigns")
            .select()
            .lte("start_date", now)
            .order("start_date", { ascending: false })
            .limit(1);
        
        if (campaignError) {
            console.error("Error fetching campaign:", campaignError);
            throw new AppError(
                ErrorMessages[ErrorCodes.DATABASE_ERROR],
                ErrorCodes.DATABASE_ERROR
            );
        }
        
        if (!campaignData || campaignData.length === 0) {
            return null;
        }
        
        return campaignData[0] as Campaign;
    });
}