# Environment Setup

## Required Environment Variables

Create a `.env.local` file in the project root with the following:

```bash
# Convex
VITE_CONVEX_URL=your_convex_url_here

# OpenAI API Key for AI features
OPENAI_API_KEY=your_openai_api_key_here
```

## Getting API Keys

### OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Add it to your `.env.local` file
4. Also add it to your Convex deployment environment variables:
   ```bash
   npx convex env set OPENAI_API_KEY your_key_here
   ```

### Convex URL
- Run `npx convex dev` to get your Convex URL
- It will be automatically added to `.env.local`

## Development

After setting up environment variables:

```bash
# Install dependencies
pnpm install

# Start Convex backend
npx convex dev

# Start frontend (in another terminal)
pnpm run dev
```

