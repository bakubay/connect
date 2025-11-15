# 🚀 Quick Start Guide

## Initial Setup

### 1. Set Environment Variable
```bash
npx convex env set OPENAI_API_KEY your_openai_key_here
```

### 2. Make sure Convex is running
The agent component should already be installed. If you see errors, the dev server will show them.

---

## ✨ New Features Ready to Test

### For Creators:

**1. AI-Powered Profile Creation**
```
1. Sign up with role "Creator"
2. You'll see the profile wizard
3. Answer 3 quick questions
4. AI generates 3 bio styles
5. Pick one & add social links
6. Done in <3 minutes!
```

**2. Video Submissions**
```
1. Browse campaigns at /browse
2. Click "Submit Video"
3. Paste your TikTok/Instagram/YouTube link
4. Add optional note
5. Submit - AI scores automatically!
```

### For Companies:

**1. Campaign from Document**
```
1. Click "New Campaign"
2. Choose "📄 Paste Campaign Brief" tab
3. Paste your internal brief/doc
4. Click "Extract Campaign Details ✨"
5. Review extracted info
6. Publish!
```

**2. AI-Ranked Applicants**
```
1. Open your campaign
2. Click "View Applicants"
3. See ranked list (AI scores 0-100)
4. Watch submitted videos
5. Select/reject creators
```

---

## 🧪 Testing the AI Features

### Test Profile Wizard:
```
Content: "I make videos about sustainable living and eco-friendly products"
Audience: "Women 25-35 who care about environment but want realistic tips"
Unique: "I show imperfect sustainable living, not Instagram perfection"

→ Should generate 3 different bio styles
```

### Test Campaign Extraction:
```
Paste this:
"We're launching eco-friendly water bottles made from recycled ocean plastic. 
Looking for creators with 10K-100K followers in sustainability/eco-living space. 
Budget is $5,000. Need 2 TikTok videos and 3 Instagram stories by December 15. 
Target audience is environmentally conscious millennials ages 22-35."

→ Should extract all fields correctly
```

### Test Video Submission:
```
1. Create a campaign as company
2. Sign in as creator (different account)
3. Complete profile with wizard
4. Submit video: https://www.tiktok.com/@example/video/123
5. Check if AI scoring happens (might take 3-5 seconds)
```

---

## 🐛 Troubleshooting

### "OpenAI API Error"
→ Check that `OPENAI_API_KEY` is set in Convex deployment

### "Agent not found"
→ Run `npx convex dev` - should see "✔ Installed component agent"

### "Profile wizard not showing"
→ Make sure you're signed in as a Creator role

### "Campaign extraction not working"
→ Check Convex logs for AI errors

---

## 📊 What to Observe

### Creator Flow:
- How long does profile wizard take?
- Do users edit AI-generated bios?
- Which bio style do they prefer?
- How many apply to campaigns?

### Company Flow:
- Do they use paste or manual form?
- Is extraction accurate?
- Do they edit extracted data?
- How many applications do they get?

### AI Performance:
- Profile generation speed (~2-3 seconds)
- Campaign extraction speed (~3-5 seconds)
- Fit scoring speed (~3-5 seconds)
- Accuracy of scores

---

## 🎯 Key Metrics

Monitor in Convex logs:
- AI token usage
- Generation success rate
- Average response time
- Error rate

---

## 🔄 Iteration Ideas

Based on testing, consider:
1. Add more bio style options
2. Campaign templates (common use cases)
3. Video preview embedding
4. Batch scoring for multiple applications
5. Export applicants list

---

**Ready to test!** The app is fully functional with AI-powered features.

