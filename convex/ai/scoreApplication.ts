import { internalAction, internalMutation, internalQuery } from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";
import { fitScoringAgent } from "./fitScoringAgent";
import { fitScoreSchema, type FitScoreResult } from "./scoringSchema";

/**
 * Score a creator application using AI
 * 
 * This action:
 * 1. Fetches application, creator profile, and campaign details
 * 2. Uses AI agent with structured output to score the fit
 * 3. Saves the score and reasoning to the application
 */
export const scoreApplication = internalAction({
  args: {
    applicationId: v.id("applications"),
  },
  handler: async (ctx, { applicationId }): Promise<FitScoreResult> => {
    // Fetch application data directly
    const application = await ctx.runQuery(
      internal.ai.scoreApplication.getApplicationData,
      { applicationId }
    );

    if (!application) {
      throw new Error("Application not found");
    }

    const { campaign, profile } = application;

    // Build context prompt for the AI
    const prompt: string = `
# Campaign Details
**Title:** ${campaign.title}
**Description:** ${campaign.description}
**Budget:** $${campaign.budget.toLocaleString()}
**Deadline:** ${campaign.deadline}

**Requirements/Criteria:**
${campaign.criteria}

---

# Creator Profile
**Name:** ${profile.name}
**Bio:** ${profile.bio}

**Social Media:**
${profile.socialMediaLinks.map((link: { platform: string; url: string }) => `- ${link.platform}: ${link.url}`).join("\n")}

---

# Video Submission
${application.videoUrl ? `**Video URL:** ${application.videoUrl}` : "**Uploaded Files:** See application for details"}

---

Please analyze this creator's profile and submission against the campaign requirements.
Provide a comprehensive fit score based on their profile quality, social media presence, and how well they match the campaign criteria.
`.trim();

    // Generate structured fit score using AI agent
    // Use applicationId as threadId for tracking this specific scoring session
    const result = await fitScoringAgent.generateObject(
      ctx,
      { threadId: applicationId },
      {
        prompt,
        schema: fitScoreSchema,
      }
    );

    const fitScore = result.object as FitScoreResult;

    // Save score to database
    await ctx.runMutation(internal.ai.scoreApplication.saveFitScore, {
      applicationId,
      score: fitScore.score,
      reasoning: fitScore.reasoning,
      strengths: fitScore.strengths,
      concerns: fitScore.concerns,
      recommendation: fitScore.recommendation,
    });

    return fitScore;
  },
});

/**
 * Internal query to fetch all application data for scoring
 * This avoids circular dependency by being a separate query
 */
export const getApplicationData = internalQuery({
  args: { applicationId: v.id("applications") },
  handler: async (ctx, { applicationId }) => {
    const application = await ctx.db.get(applicationId);
    if (!application) return null;

    const campaign = await ctx.db.get(application.campaignId);
    const profile = await ctx.db.get(application.creatorProfileId);

    if (!campaign || !profile) return null;

    return {
      campaign,
      profile,
      videoUrl: application.videoUrl,
    };
  },
});

/**
 * Internal mutation to save fit score
 */
export const saveFitScore = internalMutation({
  args: {
    applicationId: v.id("applications"),
    score: v.number(),
    reasoning: v.string(),
    strengths: v.array(v.string()),
    concerns: v.array(v.string()),
    recommendation: v.string(),
  },
  handler: async (ctx, args) => {
    const { applicationId, score, reasoning, strengths, concerns, recommendation } = args;

    // Create detailed reasoning text
    const detailedReasoning = `
**Score: ${score}/100** (${recommendation.replace(/_/g, " ")})

${reasoning}

**Strengths:**
${strengths.map((s) => `• ${s}`).join("\n")}

${concerns.length > 0 ? `**Concerns:**\n${concerns.map((c) => `• ${c}`).join("\n")}` : ""}
`.trim();

    await ctx.db.patch(applicationId, {
      fitScore: score,
      fitReasoning: detailedReasoning,
    });
  },
});

