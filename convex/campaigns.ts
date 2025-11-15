import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    criteria: v.string(),
    budget: v.number(),
    deadline: v.string(),
    status: v.optional(v.union(v.literal("draft"), v.literal("active"))),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if user is a company
    const user = await ctx.db.get(userId);
    if (user?.role !== "company") {
      throw new Error("Only companies can create campaigns");
    }

    const campaignId = await ctx.db.insert("campaigns", {
      title: args.title,
      description: args.description,
      criteria: args.criteria,
      budget: args.budget,
      deadline: args.deadline,
      status: args.status || "draft",
      companyId: userId,
    });

    return campaignId;
  },
});

export const update = mutation({
  args: {
    id: v.id("campaigns"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    criteria: v.optional(v.string()),
    budget: v.optional(v.number()),
    deadline: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const campaign = await ctx.db.get(args.id);
    if (!campaign) {
      throw new Error("Campaign not found");
    }

    if (campaign.companyId !== userId) {
      throw new Error("Not authorized to update this campaign");
    }

    const { id, ...updateFields } = args;
    await ctx.db.patch(args.id, updateFields);
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("campaigns"),
    status: v.union(v.literal("draft"), v.literal("active"), v.literal("closed")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const campaign = await ctx.db.get(args.id);
    if (!campaign) {
      throw new Error("Campaign not found");
    }

    if (campaign.companyId !== userId) {
      throw new Error("Not authorized to update this campaign");
    }

    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (user?.role !== "company") {
      throw new Error("Only companies can view their campaigns");
    }

    const campaigns = await ctx.db
      .query("campaigns")
      .withIndex("companyId", (q) => q.eq("companyId", userId))
      .collect();

    return campaigns;
  },
});

export const listActive = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const campaigns = await ctx.db
      .query("campaigns")
      .withIndex("status", (q) => q.eq("status", "active"))
      .collect();

    return campaigns;
  },
});

export const get = query({
  args: { id: v.id("campaigns") },
  handler: async (ctx, args) => {
    const campaign = await ctx.db.get(args.id);
    return campaign;
  },
});

/**
 * Extract campaign details from a pasted document
 */
export const extractFromDocument = action({
  args: {
    documentText: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.runQuery(internal.users.getCurrentUserInternal);
    if (user?.role !== "company") {
      throw new Error("Only companies can create campaigns");
    }

    // Import and use AI agent directly (avoid action-calling-action)
    const { campaignExtractorAgent } = await import("./ai/campaignExtractor");
    const { campaignExtractionSchema } = await import("./ai/campaignExtractionSchema");

    const prompt = `
Extract and structure the following campaign information into a professional format:

━━━━━━━━━━━━━━━━━━━━━━━━━
${args.documentText}
━━━━━━━━━━━━━━━━━━━━━━━━━

Please extract all relevant details and structure them for a creator partnership platform.
If any information is missing or unclear, use your expertise to suggest reasonable values.
`.trim();

    const result = await campaignExtractorAgent.generateObject(
      ctx,
      { userId },
      {
        prompt,
        schema: campaignExtractionSchema,
      }
    );

    return result.object;
  },
});

