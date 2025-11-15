import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Internal mutation to create a partnership (called from applications.updateStatus)
 */
export const createInternal = internalMutation({
  args: {
    campaignId: v.id("campaigns"),
    creatorId: v.id("users"),
    applicationId: v.id("applications"),
  },
  handler: async (ctx, args) => {
    // Check if partnership already exists
    const existing = await ctx.db
      .query("partnerships")
      .withIndex("applicationId", (q) => q.eq("applicationId", args.applicationId))
      .first();

    if (existing) {
      return existing._id;
    }

    const partnershipId = await ctx.db.insert("partnerships", {
      campaignId: args.campaignId,
      creatorId: args.creatorId,
      applicationId: args.applicationId,
      status: "pending",
      createdAt: Date.now(),
    });

    return partnershipId;
  },
});

/**
 * Create a partnership manually (for future use)
 */
export const create = mutation({
  args: {
    campaignId: v.id("campaigns"),
    creatorId: v.id("users"),
    applicationId: v.id("applications"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if user owns the campaign
    const campaign = await ctx.db.get(args.campaignId);
    if (!campaign) {
      throw new Error("Campaign not found");
    }
    if (campaign.companyId !== userId) {
      throw new Error("Not authorized to create partnerships for this campaign");
    }

    // Check if application exists and is selected
    const application = await ctx.db.get(args.applicationId);
    if (!application) {
      throw new Error("Application not found");
    }
    if (application.status !== "selected") {
      throw new Error("Can only create partnerships for selected applications");
    }

    // Check if partnership already exists
    const existing = await ctx.db
      .query("partnerships")
      .withIndex("applicationId", (q) => q.eq("applicationId", args.applicationId))
      .first();

    if (existing) {
      throw new Error("Partnership already exists for this application");
    }

    const partnershipId = await ctx.db.insert("partnerships", {
      campaignId: args.campaignId,
      creatorId: args.creatorId,
      applicationId: args.applicationId,
      status: "pending",
      createdAt: Date.now(),
    });

    return partnershipId;
  },
});

/**
 * Get all partnerships for a campaign with creator and application details
 */
export const getByCampaign = query({
  args: { campaignId: v.id("campaigns") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if user owns this campaign
    const campaign = await ctx.db.get(args.campaignId);
    if (!campaign) {
      throw new Error("Campaign not found");
    }
    if (campaign.companyId !== userId) {
      throw new Error("Not authorized to view partnerships for this campaign");
    }

    const partnerships = await ctx.db
      .query("partnerships")
      .withIndex("campaignId", (q) => q.eq("campaignId", args.campaignId))
      .collect();

    // Fetch related data for each partnership
    const partnershipsWithDetails = await Promise.all(
      partnerships.map(async (partnership) => {
        const creator = await ctx.db.get(partnership.creatorId);
        const application = await ctx.db.get(partnership.applicationId);
        const profile = application
          ? await ctx.db.get(application.creatorProfileId)
          : null;

        return {
          ...partnership,
          creator,
          application,
          profile,
        };
      })
    );

    // Sort by creation date (newest first)
    return partnershipsWithDetails.sort((a, b) => b.createdAt - a.createdAt);
  },
});

/**
 * Get a single partnership by ID
 */
export const get = query({
  args: { id: v.id("partnerships") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const partnership = await ctx.db.get(args.id);
    if (!partnership) {
      return null;
    }

    // Check if user is authorized (either campaign owner or the creator)
    const campaign = await ctx.db.get(partnership.campaignId);
    if (!campaign) {
      throw new Error("Campaign not found");
    }

    if (campaign.companyId !== userId && partnership.creatorId !== userId) {
      throw new Error("Not authorized to view this partnership");
    }

    // Fetch related data
    const creator = await ctx.db.get(partnership.creatorId);
    const application = await ctx.db.get(partnership.applicationId);
    const profile = application
      ? await ctx.db.get(application.creatorProfileId)
      : null;

    return {
      ...partnership,
      creator,
      application,
      profile,
      campaign,
    };
  },
});

/**
 * Update partnership status (for future use)
 */
export const updateStatus = mutation({
  args: {
    id: v.id("partnerships"),
    status: v.union(
      v.literal("pending"),
      v.literal("negotiating"),
      v.literal("approved"),
      v.literal("active"),
      v.literal("completed")
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const partnership = await ctx.db.get(args.id);
    if (!partnership) {
      throw new Error("Partnership not found");
    }

    // Check if user owns the campaign
    const campaign = await ctx.db.get(partnership.campaignId);
    if (!campaign || campaign.companyId !== userId) {
      throw new Error("Not authorized to update this partnership");
    }

    await ctx.db.patch(args.id, { status: args.status });
  },
});

/**
 * Get count of partnerships for a campaign (for display on campaign page)
 */
export const getCountByCampaign = query({
  args: { campaignId: v.id("campaigns") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return 0;
    }

    // Check if user owns this campaign
    const campaign = await ctx.db.get(args.campaignId);
    if (!campaign || campaign.companyId !== userId) {
      return 0;
    }

    const partnerships = await ctx.db
      .query("partnerships")
      .withIndex("campaignId", (q) => q.eq("campaignId", args.campaignId))
      .collect();

    return partnerships.length;
  },
});

