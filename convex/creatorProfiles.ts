import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

export const createOrUpdate = mutation({
  args: {
    name: v.string(),
    bio: v.string(),
    socialMediaLinks: v.array(
      v.object({
        platform: v.string(),
        url: v.string(),
      })
    ),
    isComplete: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if user is a creator
    const user = await ctx.db.get(userId);
    if (user?.role !== "creator") {
      throw new Error("Only creators can create profiles");
    }

    // Check if profile already exists
    const existingProfile = await ctx.db
      .query("creatorProfiles")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .first();

    if (existingProfile) {
      // Update existing profile
      await ctx.db.patch(existingProfile._id, {
        name: args.name,
        bio: args.bio,
        socialMediaLinks: args.socialMediaLinks,
        isComplete: args.isComplete,
      });
      return existingProfile._id;
    } else {
      // Create new profile
      const profileId = await ctx.db.insert("creatorProfiles", {
        userId,
        name: args.name,
        bio: args.bio,
        socialMediaLinks: args.socialMediaLinks,
        isComplete: args.isComplete,
      });
      return profileId;
    }
  },
});

export const get = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("creatorProfiles")
      .withIndex("userId", (q) => q.eq("userId", args.userId))
      .first();

    return profile;
  },
});

export const isComplete = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("creatorProfiles")
      .withIndex("userId", (q) => q.eq("userId", args.userId))
      .first();

    return profile?.isComplete ?? false;
  },
});

export const getCurrentUserProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const profile = await ctx.db
      .query("creatorProfiles")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .first();

    return profile;
  },
});

/**
 * Generate AI-powered profile suggestions
 */
export const generateProfileSuggestions = action({
  args: {
    contentDescription: v.string(),
    audience: v.string(),
    uniqueValue: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.runQuery(internal.users.getCurrentUserInternal);
    if (user?.role !== "creator") {
      throw new Error("Only creators can generate profile suggestions");
    }

    // Import and use AI agent directly (avoid action-calling-action)
    const { profileHelperAgent } = await import("./ai/profileHelper");
    const { profileHelpSchema } = await import("./ai/profileSchema");

    const { contentDescription, audience, uniqueValue, name } = args;

    const prompt = `
Help this creator build their profile for a brand partnership platform.

${name ? `Creator Name: ${name}` : ""}

**What they create:**
${contentDescription}

**Their audience:**
${audience}

**What makes them unique:**
${uniqueValue}

---

Please generate profile suggestions that will help them attract brand partnerships.

IMPORTANT: You must return exactly 3 bio options with styles: "professional", "casual", and "impact_focused" (use underscore, not hyphen).
`.trim();

    try {
      const result = await profileHelperAgent.generateObject(
        ctx,
        { userId },
        {
          prompt,
          schema: profileHelpSchema,
        }
      );

      // Validate the result before returning
      if (!result.object) {
        throw new Error("AI did not generate a valid response object");
      }

      // Ensure we have exactly 3 bio options
      if (!result.object.bioOptions || result.object.bioOptions.length !== 3) {
        throw new Error(`Expected exactly 3 bio options, got ${result.object.bioOptions?.length || 0}`);
      }

      return result.object;
    } catch (error: any) {
      console.error("Error generating profile suggestions:", error);
      throw new Error(`Failed to generate profile suggestions: ${error.message || "Unknown error"}`);
    }
  },
});

