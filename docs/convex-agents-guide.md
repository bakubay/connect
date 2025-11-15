# Convex Agents Framework Guide

## Installation

Install the agent component:

```bash
npm install @convex-dev/agent
```

Create a `convex.config.ts` file in your `convex/` folder:

```typescript
// convex/convex.config.ts
import { defineApp } from "convex/server";
import agent from "@convex-dev/agent/convex.config";

const app = defineApp();
app.use(agent);

export default app;
```

Run `npx convex dev` to generate code for the component.

## Defining an Agent

```typescript
import { components } from "./_generated/api";
import { Agent } from "@convex-dev/agent";
import { openai } from "@ai-sdk/openai";

const agent = new Agent(components.agent, {
  name: "My Agent",
  languageModel: openai.chat("gpt-4o-mini"),
  instructions: "You are a helpful assistant.",
  tools: { myTool },
  maxSteps: 3,
});
```

## Basic Usage

```typescript
import { action } from "./_generated/server";
import { v } from "convex/values";

export const helloWorld = action({
  args: { city: v.string() },
  handler: async (ctx, { city }) => {
    const threadId = await createThread(ctx, components.agent);
    const prompt = `What is the weather in ${city}?`;
    const result = await agent.generateText(ctx, { threadId }, { prompt });
    return result.text;
  },
});
```

## Asynchronous Generation (Recommended)

### Step 1: Save message in mutation

```typescript
import { saveMessage } from "@convex-dev/agent";
import { mutation } from "./_generated/server";

export const sendMessage = mutation({
  args: { threadId: v.id("threads"), prompt: v.string() },
  handler: async (ctx, { threadId, prompt }) => {
    const { messageId } = await saveMessage(ctx, components.agent, {
      threadId,
      prompt,
    });
    await ctx.scheduler.runAfter(0, internal.example.generateResponseAsync, {
      threadId,
      promptMessageId: messageId,
    });
  },
});
```

### Step 2: Generate response in action

```typescript
export const generateResponseAsync = internalAction({
  args: { threadId: v.string(), promptMessageId: v.string() },
  handler: async (ctx, { threadId, promptMessageId }) => {
    await agent.generateText(ctx, { threadId }, { promptMessageId });
  },
});

// Or use the built-in utility:
export const generateResponseAsync = agent.asTextAction();
```

## Generating Structured Objects

```typescript
import { z } from "zod/v3";

const result = await agent.generateObject(
  ctx,
  { threadId },
  {
    prompt: "Generate a plan",
    schema: z.object({
      score: z.number().min(0).max(100),
      reasoning: z.string(),
    }),
  }
);
```

## Creating Tools

```typescript
import { createTool } from "@convex-dev/agent";
import { z } from "zod/v3";

const myTool = createTool({
  description: "Fetches user data",
  args: z.object({
    userId: z.string(),
  }),
  handler: async (ctx, args): Promise<string> => {
    const user = await ctx.runQuery(api.users.get, { id: args.userId });
    return JSON.stringify(user);
  },
});
```

## Dynamic Agent Creation

```typescript
function createContextualAgent(ctx: ActionCtx, userId: Id<"users">) {
  return new Agent(components.agent, {
    name: "Contextual Agent",
    languageModel: openai.chat("gpt-4o-mini"),
    tools: {
      getUserData: getUserDataTool(ctx, userId),
      saveResult: saveResultTool(ctx, userId),
    },
    maxSteps: 10,
  });
}
```

## Configuration Options

```typescript
const agent = new Agent(components.agent, {
  languageModel: openai.chat("gpt-4o-mini"),
  textEmbeddingModel: openai.embedding("text-embedding-3-small"),
  instructions: "System prompt",
  tools: {},
  maxSteps: 5,
  callSettings: { maxRetries: 3, temperature: 1.0 },
  usageHandler: async (ctx, args) => {
    // Track token usage
  },
  contextHandler: async (ctx, args) => {
    // Filter/modify context messages
    return args.allMessages;
  },
  rawResponseHandler: async (ctx, args) => {
    // Log requests/responses
  },
});
```

## Use Cases in Our App

### 1. AI Fit Scoring
- Agent analyzes creator profile + application vs campaign
- Returns structured score with reasoning
- Uses tools to fetch additional context

### 2. AI Negotiation
- Agent manages negotiation conversation
- Uses message threads for context
- Tools to check constraints and save terms
- Continues until agreement reached

