import { z } from "zod/v3";

/**
 * Schema for AI-generated profile suggestions
 */
export const profileHelpSchema = z.object({
  bioOptions: z
    .array(
      z.object({
        style: z.enum(["professional", "casual", "impact_focused"]).describe("Must be exactly one of: professional, casual, or impact_focused"),
        text: z.string().min(30).max(600).describe("Bio text between 30-600 characters"),
      })
    )
    .min(3)
    .max(3)
    .describe("Exactly three bio options, one for each style: professional, casual, and impact_focused"),

  suggestedCategories: z
    .array(z.string().min(1).describe("Category name"))
    .min(2)
    .max(5)
    .describe("2-5 content categories/niches (e.g., sustainability, fitness, tech)"),

  audienceDescription: z
    .string()
    .min(15)
    .max(500)
    .describe("Polished description of their target audience (15-500 characters)"),

  uniqueValueProp: z
    .string()
    .min(20)
    .max(400)
    .describe("What makes this creator unique and valuable to brands (20-400 characters)"),
});

export type ProfileHelp = z.infer<typeof profileHelpSchema>;

