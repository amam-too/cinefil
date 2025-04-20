import { type Proposition } from "@/types/proposition";
import { type Vote } from "@/types/vote";

export type VoteForMovieResponse =
  | {
      success: boolean;
      message: string;
    }
  | {
      success: false;
      message: string;
      votes: Vote[];
    };

export type ProposeAMovieResponse =
  | {
      success: boolean;
      message: string;
    }
  | {
      success: false;
      message: string;
      propositions: Proposition[];
    };