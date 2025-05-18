import { createClient } from "@/utils/supabase/server";
import { AppError, ErrorCodes, ErrorMessages } from "@/types/errors";
import { SupabaseClient } from "@supabase/supabase-js";

export async function withDatabase<T>(
    operation: (supabase: SupabaseClient) => Promise<T>
): Promise<T> {
    const supabase = await createClient();
    
    try {
        return await operation(supabase);
    } catch (error) {
        console.error("Database operation failed:", error);
        throw new AppError(
            ErrorMessages[ErrorCodes.DATABASE_ERROR],
            ErrorCodes.DATABASE_ERROR
        );
    }
}

export async function getUserSession() {
    return await withDatabase(async (supabase) => {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (!userData.user?.id || userError) {
            throw new AppError(
                ErrorMessages[ErrorCodes.AUTHENTICATION_ERROR],
                ErrorCodes.AUTHENTICATION_ERROR
            );
        }
        
        return userData.user;
    });
} 