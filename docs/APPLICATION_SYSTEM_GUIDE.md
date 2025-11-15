# 📋 Campaign Application System Guide

## Overview

The campaign application system allows **creators** to apply to campaigns by submitting video URLs and/or uploading files directly. **Companies** can then review applications with AI-powered fit scoring.

---

## 🎯 How It Works

### For Creators (Applying to Campaigns)

#### 1. **Browse Campaigns**
- Navigate to `/browse` to see all active campaigns
- View campaign details including title, description, budget, criteria, and deadline
- Click "Apply Now" on any campaign that interests you

#### 2. **Submit Your Application** (`/campaigns/{campaignId}/apply`)

You have **two ways** to submit content:

**Option A: Video URL (External Link)**
- Paste a link to your existing content on:
  - TikTok
  - Instagram (Reels, Posts)
  - YouTube (Videos, Shorts)
  - Any public video platform
- Example: `https://www.tiktok.com/@user/video/123456789`

**Option B: Direct File Upload**
- Click "Choose Files" to upload from your device
- Supported formats:
  - **Videos**: MP4, MOV, AVI, WebM, etc.
  - **Images**: JPG, PNG, GIF, etc.
  - **Documents**: PDF (portfolios, media kits)
- Max size: **20MB per file**
- Can upload **multiple files**

**Option C: Both!**
- You can provide a video URL **and** upload files

**Additional Fields:**
- **Note** (optional): Up to 280 characters to tell the company why you're interested
- This note is visible to the company reviewing your application

#### 3. **AI Scoring (Automatic)**
- After submission, an AI automatically scores your fit (0-100)
- The AI analyzes:
  - Your creator profile
  - Campaign criteria
  - Your submitted content
- This helps companies prioritize applications

#### 4. **Track Your Applications** (`/my-applications`)
- View all your submitted applications
- See status updates:
  - **Pending**: Just submitted, awaiting review
  - **Reviewing**: Company is actively reviewing
  - **Selected**: Congratulations! You've been chosen
  - **Rejected**: Not selected for this campaign
- View your AI fit score and reasoning
- Access your submitted files and video URLs

---

### For Companies (Reviewing Applications)

#### 1. **View Applicants** (`/campaigns/{campaignId}/applicants`)

**Dashboard Overview:**
- Total applicants count
- Status breakdown (Pending, Selected, Rejected)

**Ranked List:**
- Applications are automatically sorted by AI fit score (highest first)
- See each applicant's:
  - **Ranking**: Position based on AI fit score
  - **Fit Score**: 0-100 score with AI reasoning
  - **Profile**: Name, bio, social media links
  - **Submitted Content**:
    - Video URL (with "Watch Video" link)
    - Uploaded files (with download/view buttons)
  - **Creator's Note**: Personal message from the creator
  - **Status**: Current application status

#### 2. **Review & Update Status**

For each application, you can:
- **Review**: Mark as "reviewing" to show active consideration
- **Select**: Choose this creator for the campaign
- **Reject**: Decline the application

Actions are instant and visible to the creator on their "My Applications" page.

---

## 🔧 Technical Details

### File Upload Flow

The system uses Convex's file storage with a 3-step process:

1. **Generate Upload URL** (mutation: `applications.generateUploadUrl`)
   - Frontend requests a temporary upload URL (valid for 1 hour)
   - This URL is unique and secure

2. **Upload File** (POST request to upload URL)
   - File is sent directly to Convex storage
   - Returns a `storageId` (unique identifier)

3. **Save to Database** (mutation: `applications.submit`)
   - Application is created with:
     - `videoUrl` (optional)
     - `uploadedFiles` array (optional)
     - `note` (optional)
   - At least one of `videoUrl` or `uploadedFiles` is required

### Database Schema

```typescript
applications: {
  campaignId: Id<"campaigns">,
  creatorId: Id<"users">,
  creatorProfileId: Id<"creatorProfiles">,
  status: "pending" | "reviewing" | "selected" | "rejected",
  videoUrl?: string,
  uploadedFiles?: Array<{
    storageId: Id<"_storage">,
    filename: string,
    fileType: string,
    fileSize: number
  }>,
  note?: string,
  fitScore?: number,
  fitReasoning?: string,
  appliedAt: number
}
```

### File Download/Preview

Files are retrieved using:
```typescript
query getFileUrl({ storageId: Id<"_storage"> })
```

This returns a temporary URL that can be used to:
- View files in browser
- Download files
- Display image/video previews

---

## 🚀 User Flow Examples

### Example 1: Creator with Existing TikTok Content

1. Creator browses campaigns at `/browse`
2. Finds "Summer Fashion Campaign" with $5,000 budget
3. Clicks "Apply Now"
4. Pastes TikTok video URL: `https://www.tiktok.com/@fashionista/video/123`
5. Adds note: "Love your brand! This video got 100K views and matches your aesthetic"
6. Clicks "Submit Application"
7. AI scores application: 87/100 - "Strong engagement and style match"
8. Application appears in company's applicants list

### Example 2: Creator Uploading Portfolio

1. Creator clicks "Apply Now" on campaign
2. Skips video URL field
3. Clicks "Choose Files"
4. Uploads:
   - `portfolio.pdf` (2.5 MB)
   - `sample_video.mp4` (15 MB)
   - `brand_collab_example.jpg` (800 KB)
5. Adds note: "Attached my full portfolio and recent work samples"
6. Clicks "Submit Application"
7. All files are uploaded and saved
8. Company can view/download all files

### Example 3: Company Reviewing Applications

1. Company logs in, views campaign
2. Clicks "View Applicants"
3. Sees 25 applications ranked by AI fit score
4. Top applicant has 92/100 score
5. Reviews:
   - Creator's bio and social links
   - Watches submitted TikTok video
   - Downloads PDF portfolio
   - Reads creator's note
6. Impressed! Clicks "Select" button
7. Status updates to "Selected"
8. Creator sees "Selected" status on their dashboard

---

## 📁 File Types & Best Practices

### Recommended File Types

**For Creators:**
- **Videos**: MP4 (most compatible), MOV
- **Images**: JPG (photos), PNG (graphics with transparency)
- **Documents**: PDF (portfolios, media kits)

**Size Optimization:**
- Keep files under 20MB (hard limit)
- Compress videos if needed (online tools available)
- Use external URLs for large video files

### File Naming
Use descriptive names:
- ✅ `portfolio_2024.pdf`
- ✅ `brand_collab_nike.mp4`
- ❌ `IMG_1234.jpg`

---

## 🎨 UI Components

### ApplicationForm (`src/components/ApplicationForm.tsx`)
- **Video URL input**: Optional text field with validation
- **File upload section**: Drag-and-drop style file picker
- **Uploaded files preview**: Shows file name, size, and remove option
- **Note textarea**: 280 character limit
- **Submit button**: Disabled until valid submission

### ApplicantsList (`src/components/ApplicantsList.tsx`)
- **Summary cards**: Total, pending, selected, rejected counts
- **Ranked applications**: Sorted by fit score
- **File display**: Individual file items with download buttons
- **Status actions**: Review, Select, Reject buttons

### ApplicationsList (`src/components/ApplicationsList.tsx`)
- **Creator's dashboard**: All their applications
- **Status badges**: Color-coded with icons
- **Fit score display**: Shows AI analysis
- **Submitted content**: Links to videos and uploaded files

---

## 🔐 Security & Permissions

### Upload Authorization
- Only authenticated creators can generate upload URLs
- Upload URLs expire after 1 hour
- Files are stored securely in Convex storage

### Access Control
- Creators can only view their own applications
- Companies can only view applications for their campaigns
- File URLs are temporary and expire after use

### Validation
- File size limit: 20MB
- File type restrictions: videos, images, PDFs only
- At least one submission method required (URL or files)
- Creator must have complete profile to apply

---

## 📊 AI Scoring System

The AI analyzes:
1. **Creator Profile**: Bio, niche, audience
2. **Campaign Criteria**: Requirements and goals
3. **Submitted Content**: Quality and relevance

Score ranges:
- **90-100**: Excellent fit, highly recommended
- **75-89**: Good fit, strong candidate
- **60-74**: Moderate fit, consider reviewing
- **Below 60**: Lower fit, may not match criteria

The AI also provides reasoning to help companies understand the score.

---

## 🐛 Troubleshooting

### "File too large" error
- Solution: Compress file or use external URL for videos

### "Please provide at least one submission"
- Solution: Add either a video URL or upload files (or both)

### "Please complete your profile"
- Solution: Go to `/profile/creator` and fill out all fields

### Upload stuck at "Uploading..."
- Solution: Check internet connection, try smaller file

### Can't see uploaded files
- Solution: Refresh page, files may still be processing

---

## 🎓 Quick Start Checklist

### For Creators:
- [ ] Complete your creator profile
- [ ] Browse active campaigns
- [ ] Prepare content (video URL or files)
- [ ] Submit application
- [ ] Track status on "My Applications"

### For Companies:
- [ ] Create a campaign
- [ ] Set it to "active" status
- [ ] Wait for applications
- [ ] Review ranked applicants
- [ ] Update application statuses
- [ ] Select your creators!

---

## 📞 Support

For technical issues or questions:
- Check application status at `/my-applications`
- Review campaign details at `/campaigns/{campaignId}`
- Contact support if files aren't uploading

---

**Happy Connecting! 🎉**

