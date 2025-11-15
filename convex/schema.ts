import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    role: v.optional(v.union(v.literal("company"), v.literal("creator"))),
  }).index("email", ["email"]),
  campaigns: defineTable({
    title: v.string(),
    description: v.string(),
    criteria: v.string(),
    budget: v.number(),
    deadline: v.string(),
    status: v.union(v.literal("draft"), v.literal("active"), v.literal("closed")),
    companyId: v.id("users"),
  })
    .index("companyId", ["companyId"])
    .index("status", ["status"]),
  creatorProfiles: defineTable({
    userId: v.id("users"),
    name: v.string(),
    bio: v.string(),
    socialMediaLinks: v.array(
      v.object({
        platform: v.string(),
        url: v.string(),
      })
    ),
    isComplete: v.boolean(),
  }).index("userId", ["userId"]),
  applications: defineTable({
    campaignId: v.id("campaigns"),
    creatorId: v.id("users"),
    creatorProfileId: v.id("creatorProfiles"),
    status: v.union(
      v.literal("pending"),
      v.literal("reviewing"),
      v.literal("selected"),
      v.literal("rejected")
    ),
    videoUrl: v.optional(v.string()), // External URL (TikTok, YouTube, etc.)
    uploadedFiles: v.optional(v.array(v.object({
      storageId: v.id("_storage"),
      filename: v.string(),
      fileType: v.string(),
      fileSize: v.number(),
    }))),
    fitScore: v.optional(v.number()),
    fitReasoning: v.optional(v.string()),
    appliedAt: v.number(),
  })
    .index("campaignId", ["campaignId"])
    .index("creatorId", ["creatorId"])
    .index("status", ["status"])
    .index("campaignId_creatorId", ["campaignId", "creatorId"]),
  partnerships: defineTable({
    campaignId: v.id("campaigns"),
    creatorId: v.id("users"),
    applicationId: v.id("applications"),
    status: v.union(
      v.literal("pending"),      // Just selected, no contact yet
      v.literal("negotiating"),  // Future: in negotiation
      v.literal("approved"),     // Future: deal approved
      v.literal("active"),       // Future: work in progress
      v.literal("completed")     // Future: deliverables done
    ),
    createdAt: v.number(),
  })
    .index("campaignId", ["campaignId"])
    .index("creatorId", ["creatorId"])
    .index("applicationId", ["applicationId"])
    .index("campaignId_creatorId", ["campaignId", "creatorId"]),
  products: defineTable({
    title: v.string(),
    imageId: v.string(),
    price: v.number(),
  }),
  todos: defineTable({
    text: v.string(),
    completed: v.boolean(),
  }),
})
