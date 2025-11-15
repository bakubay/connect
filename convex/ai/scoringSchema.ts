import { z } from "zod/v3";

/**
 * Schema for structured AI fit score output
 */
export const fitScoreSchema = z.object({
  score: z
    .number()
    .min(0)
    .max(100)
    .describe("Overall fit score from 0-100, where 100 is a perfect match"),
  
  reasoning: z
    .string()
    .min(100)
    .describe(
      "Detailed explanation of the score, highlighting strengths and weaknesses"
    ),
  
  strengths: z
    .array(z.string())
    .min(1)
    .max(5)
    .describe("Key strengths of this application (1-5 points)"),
  
  concerns: z
    .array(z.string())
    .max(5)
    .describe("Potential concerns or areas for improvement (0-5 points)"),
  
  recommendation: z
    .enum(["strongly_recommend", "recommend", "consider", "pass"])
    .describe(
      "Overall recommendation: strongly_recommend (90+), recommend (75-89), consider (60-74), pass (<60)"
    ),
});

export type FitScoreResult = z.infer<typeof fitScoreSchema>;

