import { z } from "zod/v3";

/**
 * Schema for extracted campaign data from documents
 */
export const campaignExtractionSchema = z.object({
  title: z
    .string()
    .min(10)
    .max(200)
    .describe("Clear, compelling campaign title"),

  description: z
    .string()
    .min(100)
    .describe(
      "Professional campaign description that attracts creators"
    ),

  criteria: z
    .string()
    .min(50)
    .describe(
      "Structured list of creator requirements (follower count, niche, platform, etc.)"
    ),

  budget: z
    .number()
    .positive()
    .describe("Campaign budget in USD"),

  deadline: z
    .string()
    .describe("Application deadline in YYYY-MM-DD format"),

  deliverables: z
    .string()
    .optional()
    .describe("Expected content deliverables from creators"),

  suggestedImprovements: z
    .array(z.string())
    .max(3)
    .describe("Suggestions to make the campaign more attractive to creators"),
});

export type CampaignExtraction = z.infer<typeof campaignExtractionSchema>;

