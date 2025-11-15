# AI Features Documentation

## Overview

This directory contains AI-powered features using the Convex Agent framework.

## Features

### 1. Application Fit Scoring

Automatically scores creator applications against campaign requirements using GPT-4o-mini.

**How it works:**
1. Creator submits application
2. AI agent analyzes:
   - Creator profile (bio, social media)
   - Application cover letter
   - Campaign requirements
   - Proposed rate vs budget
3. Returns structured score (0-100) with:
   - Overall fit score
   - Detailed reasoning
   - List of strengths (1-5 points)
   - List of concerns (0-5 points)
   - Recommendation tier

**Files:**
- `fitScoringAgent.ts` - Agent configuration and instructions
- `scoringSchema.ts` - Zod schema for structured output
- `scoreApplication.ts` - Action that performs scoring

**Usage:**
Scoring happens automatically when an application is submitted. The score is saved to the `applications` table and used to rank applicants.

## Environment Setup

Required environment variable:
```bash
OPENAI_API_KEY=your_key_here
```

Add to Convex deployment:
```bash
npx convex env set OPENAI_API_KEY your_key_here
```

## Future Features

### 2. Partnership Negotiation (Coming Soon)
AI-powered negotiation agent that:
- Manages conversation between company and creator
- Proposes fair terms based on market data
- Helps reach mutually beneficial agreements

### 3. Campaign Optimization (Coming Soon)
AI suggestions for:
- Better campaign descriptions
- More effective requirements
- Optimal budget recommendations

