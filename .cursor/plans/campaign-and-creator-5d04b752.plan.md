<!-- 5d04b752-b63c-4b96-b900-a7f48a80fed8 d4e8516f-2b14-47ed-a7ad-4e859d274a4a -->
# AI Assistants: Profile Builder & Campaign Extractor

## Understanding the Flow

**Application = Video Submission** (not cover letters)

- Creators submit videos directly to campaigns
- No lengthy application forms needed
- Profile quality is key to getting selected

---

## Feature 1: Profile Creation Helper (Creators)

### What It Does

AI helps creators build compelling profiles by:

- Asking smart questions about their content
- Generating professional bio (multiple styles)
- Suggesting content categories
- Helping describe their audience
- Writing their "what makes me unique" pitch

### The Experience

**Current (BAD):**

```
Empty form with:
[ Name: ___________ ]
[ Bio: _____________ ] ← Intimidating blank box
[ Social Links: ____ ]
```

**New (GOOD):**

```
"Let's build your profile together! 🚀"

Step 1: Tell us about your content
→ "I make videos about sustainable living"

Step 2: Who's your audience?
→ "Mainly women 25-35 who care about the environment"

Step 3: What makes you different?
→ "I show realistic swaps, not perfect influencer life"

[✨ Generate Profile]

→ AI creates:
━━━━━━━━━━━━━━━━━━━━━━━━━
Name: [extracted or asked]

Bio Option 1 (Professional):
"Sustainability advocate helping 50K eco-conscious 
millennials make realistic lifestyle changes. 
Specializing in authentic content that proves 
sustainable living doesn't have to be perfect."

Bio Option 2 (Casual):
"Making sustainable living actually doable! 🌱
No perfect Instagram life here - just real swaps
for real people. 50K followers taking small steps
that actually matter."

Bio Option 3 (Impact-Focused):
"Proven track record: helped 1M+ people reduce 
plastic waste through realistic, achievable content.
Building a community where imperfect sustainability 
is celebrated."
━━━━━━━━━━━━━━━━━━━━━━━━━

Pick one → Edit → Done!
```

### Backend Implementation

**File: `convex/ai/profileHelper.ts`**

```typescript
- Agent: "Profile Creation Expert"
- Instructions: Help creators articulate their value
- Input: Answers to 3-4 simple questions
- Output: 3 bio options, suggested categories, audience description
```

**File: `convex/ai/profileSchema.ts`**

```typescript
- Zod schema for profile generation
- Fields: bioOptions (array of 3), categories, audienceDescription, 
         uniqueValue, contentStyle
```

**New Query: `convex/profiles.ts`**

```typescript
export const generateProfileHelp = action({
  args: {
    contentDescription: v.string(),
    audience: v.string(), 
    uniqueValue: v.string(),
  },
  handler: async (ctx, args) => {
    // Use AI agent to generate profile suggestions
    return {
      bioOptions: [...],
      categories: [...],
      audienceDesc: "...",
    };
  },
});
```

### Frontend Implementation

**New: `src/components/ProfileCreationWizard.tsx`**

- Step-by-step wizard (3 steps)
- Each step asks one question
- Final step shows AI-generated options
- Clean, focused UI (one question at a time)

**Update: `src/routes/profile/creator.tsx`**

- Show wizard for new profiles
- Show regular form for edits
- Option to "Regenerate with AI" on edits

**New: `src/components/BioSelector.tsx`**

- Shows 3 AI-generated bio options
- Radio buttons to select
- Edit button for customization
- Character count
- Preview of how it looks to companies

### User Flow

```
1. New creator signs up
2. Redirect to profile creation
3. See: "Let's build your profile in 2 minutes! 🚀"

4. Step 1/3: "What do you create content about?"
   [Large text box]
   Example: "I make videos about sustainable living..."
   [Next]

5. Step 2/3: "Who's your audience?"
   [Text box]
   Example: "Women 25-35 interested in eco-friendly lifestyle"
   [Next]

6. Step 3/3: "What makes your content unique?"
   [Text box]
   Example: "I show realistic changes, not perfect Instagram life"
   [Generate Profile ✨]

7. AI generates (2-3 seconds):
   - 3 bio options (different tones)
   - Suggested categories
   - Polished audience description

8. Creator picks bio option
9. Adds social media links
10. Click "Complete Profile"
11. Done! Can now apply to campaigns
```

---

## Feature 2: Campaign Document Extractor (Companies)

### What It Does

Company pastes their internal campaign brief/doc, AI extracts:

- Campaign title
- Description
- Requirements/criteria
- Budget (or suggests range)
- Deadline
- Target creator profile
- Deliverables expected

### The Experience

**Current (BAD):**

```
Empty form with 6+ fields to fill manually
Company has campaign brief in Google Doc
Has to copy/paste/reformat everything
```

**New (GOOD):**

```
"Create Campaign"

Two tabs:
[Fill Form Manually] [📄 Paste Campaign Brief] ← Click here

Large text area:
┌─────────────────────────────────────┐
│ Paste your campaign brief here...  │
│                                     │
│ (Google Doc, email, brief, etc)    │
│                                     │
│                                     │
│                                     │
│                                     │
└─────────────────────────────────────┘

[Extract Campaign Details ✨]

→ AI processes (3 seconds)

→ Shows structured campaign:
━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Title: "Eco Water Bottle Launch Campaign"

✅ Description: [AI-formatted professional copy]

✅ Requirements:
   • Content focus: Sustainability, eco-living
   • Follower range: 10K-100K
   • Platform: TikTok, Instagram
   • Engagement: >3%
   • Location: US-based

✅ Budget: $3,500 - $5,000
   (extracted or AI suggests based on scope)

✅ Deadline: December 15, 2024

✅ Deliverables:
   • 2 TikTok videos
   • 3 Instagram stories
   • Usage rights: 6 months
━━━━━━━━━━━━━━━━━━━━━━━━━

[Edit Details] [Create Campaign]
```

### Backend Implementation

**File: `convex/ai/campaignExtractor.ts`**

```typescript
- Agent: "Campaign Strategist"  
- Instructions: Extract and structure campaign info
- Input: Raw document text
- Output: Complete campaign object
```

**File: `convex/ai/campaignExtractionSchema.ts`**

```typescript
- Zod schema matching campaigns table
- Fields: title, description, criteria, budget, deadline, 
         deliverables, targetProfile
- Smart defaults if info missing
```

**New Action: `convex/campaigns.ts`**

```typescript
export const extractFromDocument = action({
  args: {
    documentText: v.string(),
  },
  handler: async (ctx, args) => {
    // Use AI to extract structured campaign
    const result = await campaignExtractor.generateObject(...);
    return result.object; // Ready to save
  },
});
```

### Frontend Implementation

**Update: `src/components/CampaignForm.tsx`**

- Add tab switcher at top
- Tab 1: Manual form (existing)
- Tab 2: Document paste (new)
- If using paste, pre-fill form with extracted data
- Allow editing extracted data

**New: `src/components/DocumentPasteExtractor.tsx`**

- Large textarea for pasting
- "Extract" button
- Loading state with spinner
- Shows extracted fields with edit options
- "Use These Details" → switches to manual tab with pre-filled data

### User Flow

```
1. Company clicks "New Campaign"
2. Sees two tabs:
   [Manual Form] [📄 Paste Brief]
3. Clicks "Paste Brief"
4. Pastes their internal doc (any format):
   "We're launching eco-friendly water bottles.
   Looking for creators with 10K-100K followers
   in the sustainability space. Budget is $5K.
   Need 2 TikToks and 3 IG stories by Dec 15..."
   
5. Clicks "Extract Campaign ✨"
6. AI processes (3-5 seconds)
7. Shows structured output with all fields
8. Company reviews, makes edits
9. Clicks "Create Campaign"
10. Done! Campaign is live
```

---

## Update Application Flow (Simplified)

### New Application Model

```
No cover letters!
Just video submissions:

1. Creator sees campaign
2. Clicks "Submit Video"
3. Uploads video or pastes link
4. Optional: Add short note (optional, 1-2 sentences)
5. Submit
6. Done!
```

### Schema Changes Needed

**Update `applications` table:**

```typescript
applications: defineTable({
  campaignId: v.id("campaigns"),
  creatorId: v.id("users"),
  creatorProfileId: v.id("creatorProfiles"),
  status: v.union(...),
  
  // NEW: Video submission instead of cover letter
  videoUrl: v.string(), // YouTube, TikTok, or uploaded
  note: v.optional(v.string()), // Short optional note
  
  // REMOVE: coverLetter, proposedRate
  
  fitScore: v.optional(v.number()),
  fitReasoning: v.optional(v.string()),
  appliedAt: v.number(),
})
```

---

## Implementation Order

### Day 1: Profile Creation Helper

1. Create AI agent & schema (1 hour)
2. Build ProfileCreationWizard UI (2 hours)
3. Add backend action (1 hour)
4. Test & polish (1 hour)

**Total: 5 hours**

### Day 2: Campaign Extractor  

1. Create AI agent & schema (1 hour)
2. Build DocumentPasteExtractor UI (2 hours)
3. Add backend action (1 hour)
4. Test with real briefs (1 hour)

**Total: 5 hours**

### Day 3: Simplify Applications

1. Update schema (remove cover letter) (30 min)
2. Update ApplicationForm (video upload) (2 hours)
3. Update ApplicantsList (show videos) (1 hour)
4. Update AI scoring (use profile + video) (1 hour)
5. Test flow (30 min)

**Total: 5 hours**

**Grand Total: ~15 hours** (2 days of focused work)

---

## Files to Create/Modify

### New Files (6):

- `convex/ai/profileHelper.ts`
- `convex/ai/profileSchema.ts`
- `convex/ai/campaignExtractor.ts`
- `convex/ai/campaignExtractionSchema.ts`
- `src/components/ProfileCreationWizard.tsx`
- `src/components/DocumentPasteExtractor.tsx`
- `src/components/BioSelector.tsx`
- `src/components/VideoUpload.tsx`

### Modified Files (7):

- `convex/schema.ts` (update applications table)
- `convex/applications.ts` (video instead of coverLetter)
- `convex/campaigns.ts` (add extraction action)
- `src/components/CampaignForm.tsx` (add paste tab)
- `src/components/ApplicationForm.tsx` (video upload)
- `src/components/ApplicantsList.tsx` (show videos)
- `src/routes/profile/creator.tsx` (use wizard)

---

## Success Metrics

**Profile Helper:**

- >80% of creators use AI wizard
- Profile completion time <3 minutes (vs 15+ min)
- Profile completion rate >90% (vs 60%)

**Campaign Extractor:**

- >60% of campaigns use paste feature
- Campaign creation time <2 minutes (vs 10+ min)
- Extraction accuracy >85%

**Video Applications:**

- Application time <1 minute
- Application completion rate >95%
- Better quality signals for AI scoring

### To-dos

- [ ] Create Application Assistant agent and schema
- [ ] Add getApplicationAssistance query to backend
- [ ] Build AI assistance UI in ApplicationForm
- [ ] Create Campaign Assistant agent and schema
- [ ] Add extractCampaign action to backend
- [ ] Build campaign extraction UI
- [ ] Create shared AI UI components
- [ ] Test both features and polish UX