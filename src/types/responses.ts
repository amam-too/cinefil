import { type Proposition } from "@/types/proposition";

export type VoteForMovieResponse = {
    success: boolean;
    message: string;
}

export type ProposeAMovieResponse = {
    success: boolean;
    message: string;
} | {
    success: false;
    message: string;
    propositions: Proposition[]
}