import { Suggestion } from "@/types/suggestion";

export type VoteForMovieResponse = {
  success: boolean
  message: string
}

export type ProposeAMovieResponse = {
    success: boolean;
    message: string;
} | {
    success: false;
    message: string;
    propositions: Suggestion[]
}


export type SuggestMovieResponse = {
  success: boolean
  message: string
}
