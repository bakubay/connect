import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    return await ctx.storage.generateUploadUrl();
  },
});

export const submit = mutation({
  args: {
    campaignId: v.id("campaigns"),
    videoUrl: v.optional(v.string()),
    uploadedFiles: v.optional(v.array(v.object({
      storageId: v.id("_storage"),
      filename: v.string(),
      fileType: v.string(),
      fileSize: v.number(),
    }))),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if user is a creator
    const user = await ctx.db.get(userId);
    if (user?.role !== "creator") {
      throw new Error("Only creators can apply to campaigns");
    }

    // Get creator profile
    const profile = await ctx.db
      .query("creatorProfiles")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .first();

    if (!profile || !profile.isComplete) {
      throw new Error("Please complete your profile before applying");
    }

    // Check if already applied
    const existingApplication = await ctx.db
      .query("applications")
      .withIndex("campaignId_creatorId", (q) =>
        q.eq("campaignId", args.campaignId).eq("creatorId", userId)
      )
      .first();

    if (existingApplication) {
      throw new Error("You have already applied to this campaign");
    }

    // Check if campaign exists and is active
    const campaign = await ctx.db.get(args.campaignId);
    if (!campaign) {
      throw new Error("Campaign not found");
    }
    if (campaign.status !== "active") {
      throw new Error("This campaign is not accepting applications");
    }

    // Validate that at least one submission method is provided
    if (!args.videoUrl && (!args.uploadedFiles || args.uploadedFiles.length === 0)) {
      throw new Error("Please provide either a video URL or upload files");
    }

    const applicationId = await ctx.db.insert("applications", {
      campaignId: args.campaignId,
      creatorId: userId,
      creatorProfileId: profile._id,
      status: "pending",
      videoUrl: args.videoUrl,
      uploadedFiles: args.uploadedFiles,
      appliedAt: Date.now(),
    });

    // Schedule AI scoring (runs asynchronously)
    await ctx.scheduler.runAfter(
      0,
      internal.ai.scoreApplication.scoreApplication,
      { applicationId }
    );

    return applicationId;
  },
});

export const getFileUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const getByCreator = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const applications = await ctx.db
      .query("applications")
      .withIndex("creatorId", (q) => q.eq("creatorId", userId))
      .collect();

    // Fetch campaign details for each application
    const applicationsWithCampaigns = await Promise.all(
      applications.map(async (app) => {
        const campaign = await ctx.db.get(app.campaignId);
        return { ...app, campaign };
      })
    );

    return applicationsWithCampaigns;
  },
});

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
      throw new Error("Not authorized to view applicants");
    }

    const applications = await ctx.db
      .query("applications")
      .withIndex("campaignId", (q) => q.eq("campaignId", args.campaignId))
      .collect();

    // Fetch creator profiles for each application
    const applicationsWithProfiles = await Promise.all(
      applications.map(async (app) => {
        const profile = await ctx.db.get(app.creatorProfileId);
        const creator = await ctx.db.get(app.creatorId);
        return { ...app, profile, creator };
      })
    );

    return applicationsWithProfiles;
  },
});

export const getRankedByCampaign = query({
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
      throw new Error("Not authorized to view applicants");
    }

    const applications = await ctx.db
      .query("applications")
      .withIndex("campaignId", (q) => q.eq("campaignId", args.campaignId))
      .collect();

    // Fetch creator profiles
    const applicationsWithProfiles = await Promise.all(
      applications.map(async (app) => {
        const profile = await ctx.db.get(app.creatorProfileId);
        const creator = await ctx.db.get(app.creatorId);
        return { ...app, profile, creator };
      })
    );

    // Sort by fit score (highest first), then by application date
    return applicationsWithProfiles.sort((a, b) => {
      if (a.fitScore !== undefined && b.fitScore !== undefined) {
        return b.fitScore - a.fitScore;
      }
      if (a.fitScore !== undefined) return -1;
      if (b.fitScore !== undefined) return 1;
      return b.appliedAt - a.appliedAt;
    });
  },
});

export const updateStatus = mutation({
  args: {
    applicationId: v.id("applications"),
    status: v.union(
      v.literal("pending"),
      v.literal("reviewing"),
      v.literal("selected"),
      v.literal("rejected")
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const application = await ctx.db.get(args.applicationId);
    if (!application) {
      throw new Error("Application not found");
    }

    // Check if user owns the campaign
    const campaign = await ctx.db.get(application.campaignId);
    if (!campaign || campaign.companyId !== userId) {
      throw new Error("Not authorized to update this application");
    }

    await ctx.db.patch(args.applicationId, { status: args.status });

    // Auto-create partnership when application is selected
    if (args.status === "selected") {
      await ctx.scheduler.runAfter(
        0,
        internal.partnerships.createInternal,
        {
          campaignId: application.campaignId,
          creatorId: application.creatorId,
          applicationId: args.applicationId,
        }
      );
    }
  },
});

export const hasApplied = query({
  args: { campaignId: v.id("campaigns") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return false;
    }

    const application = await ctx.db
      .query("applications")
      .withIndex("campaignId_creatorId", (q) =>
        q.eq("campaignId", args.campaignId).eq("creatorId", userId)
      )
      .first();

    return !!application;
  },
});

export const getApplication = query({
  args: { campaignId: v.id("campaigns") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const application = await ctx.db
      .query("applications")
      .withIndex("campaignId_creatorId", (q) =>
        q.eq("campaignId", args.campaignId).eq("creatorId", userId)
      )
      .first();

    return application;
  },
});

