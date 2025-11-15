# Connect - Creator-Brand Collaboration Platform

A modern, AI-powered platform that connects brands with content creators for partnership opportunities. Built with React, TypeScript, TanStack Router, and Convex.

## 🎯 Overview

Connect is a full-stack application that facilitates collaboration between companies and content creators. Companies can create campaigns seeking creator partnerships, while creators can browse opportunities, apply with video submissions, and get AI-powered fit scores. The platform includes role-based access control, automated application scoring, and partnership management.

## ✨ Features

### For Companies
- **Campaign Management**: Create and manage creator partnership campaigns with detailed requirements, budgets, and deadlines
- **Applicant Review**: View and review creator applications with AI-powered fit scores and rankings
- **Partnership Tracking**: Manage partnerships from selection through completion
- **AI-Powered Insights**: Get AI-powered insights on campaign effectiveness

### For Creators
- **Profile Creation**: Build comprehensive creator profiles with bio, social media links, and portfolio information
- **Campaign Discovery**: Browse active campaigns and filter by criteria
- **Application System**: Submit video applications directly to campaigns
- **AI Fit Scoring**: Receive instant feedback on how well your profile matches campaign requirements
- **Partnership Management**: Track application status and manage active partnerships

### AI Features
- **Application Fit Scoring**: Automatically scores creator applications against campaign requirements using GPT-4o-mini
- **Profile Builder Assistant**: AI helps creators build compelling profiles (coming soon)
- **Campaign Optimization**: AI suggestions for better campaign descriptions (coming soon)
- **Partnership Negotiation**: AI-powered negotiation assistance (coming soon)

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **TanStack Router** - File-based routing with type safety
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Component library
- **Vite** - Build tool and dev server
- **Lucide React** - Icon library

### Backend
- **Convex** - Backend-as-a-Service (database, auth, real-time)
- **Convex Auth** - Authentication system
- **Convex Agent** - AI agent framework
- **OpenAI** - AI capabilities (GPT-4o-mini)

### Development Tools
- **Biome** - Linting and formatting
- **Vitest** - Testing framework
- **TanStack Devtools** - Development tools

## 📋 Prerequisites

- **Node.js** 18+ and **pnpm** 10.20.0+
- **Convex account** - Sign up at [convex.dev](https://www.convex.dev)
- **OpenAI API key** - For AI features (optional but recommended)

## 🚀 Getting Started

### 1. Clone and Install

```bash
git clone <repository-url>
cd connect
pnpm install
```

### 2. Set Up Convex

```bash
# Initialize Convex (if not already done)
npx convex init

# Start Convex development server
pnpm convex dev
```

This will:
- Create a `.env.local` file with `VITE_CONVEX_URL` and `CONVEX_DEPLOYMENT`
- Start the Convex development server
- Set up your Convex deployment

### 3. Configure Environment Variables

Create or update `.env.local`:

```bash
VITE_CONVEX_URL=https://your-deployment.convex.cloud
CONVEX_DEPLOYMENT=your-deployment-name
```

### 4. Set Up OpenAI (Optional)

For AI features to work, set your OpenAI API key in Convex:

```bash
npx convex env set OPENAI_API_KEY your_openai_api_key_here
```

### 5. Start Development Server

```bash
# In a separate terminal
pnpm dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
connect/
├── convex/                 # Backend (Convex functions)
│   ├── _generated/        # Auto-generated Convex types
│   ├── ai/                # AI features
│   │   ├── fitScoringAgent.ts
│   │   ├── scoreApplication.ts
│   │   └── scoringSchema.ts
│   ├── applications.ts    # Application queries/mutations
│   ├── auth.ts            # Auth configuration
│   ├── campaigns.ts       # Campaign queries/mutations
│   ├── creatorProfiles.ts # Creator profile functions
│   ├── partnerships.ts    # Partnership management
│   ├── schema.ts         # Database schema
│   └── users.ts          # User management
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── ApplicationForm.tsx
│   │   ├── CampaignBrowser.tsx
│   │   ├── CampaignForm.tsx
│   │   ├── CreatorProfileForm.tsx
│   │   └── ...
│   ├── routes/           # TanStack Router routes
│   │   ├── __root.tsx    # Root layout
│   │   ├── index.tsx     # Landing page
│   │   ├── signin.tsx    # Authentication
│   │   ├── campaigns/    # Campaign routes
│   │   ├── profile/      # Profile routes
│   │   └── ...
│   ├── lib/              # Utility functions
│   ├── integrations/     # Third-party integrations
│   └── main.tsx         # Entry point
├── public/               # Static assets
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 🔐 Authentication

The application uses **Convex Auth** with password-based authentication. Users can sign up as either:
- **Company** - Can create campaigns and review applicants
- **Creator** - Can browse campaigns and submit applications

### Authentication Flow

1. Users visit `/signin` to sign up or sign in
2. On signup, users select their role (company or creator)
3. Authenticated users are redirected based on their role:
   - Companies → `/campaigns`
   - Creators → `/profile/creator` (if profile incomplete) or `/browse` (if complete)

See [AUTH_SETUP.md](./AUTH_SETUP.md) for detailed authentication documentation.

## 🗄️ Database Schema

### Core Tables

- **users** - User accounts with role (company/creator)
- **campaigns** - Brand partnership campaigns
- **creatorProfiles** - Creator profile information
- **applications** - Creator applications to campaigns
- **partnerships** - Active partnerships between companies and creators

See `convex/schema.ts` for the complete schema definition.

## 🛣️ Routing

The application uses **TanStack Router** with file-based routing:

- `/` - Landing page (public)
- `/signin` - Sign in/sign up (public)
- `/campaigns` - Campaign list (company only)
- `/campaigns/new` - Create campaign (company only)
- `/campaigns/:campaignId` - Campaign details
- `/campaigns/:campaignId/applicants` - View applicants (company only)
- `/campaigns/:campaignId/apply` - Apply to campaign (creator only)
- `/browse` - Browse campaigns (creator only)
- `/profile/creator` - Creator profile management
- `/my-applications` - View own applications (creator only)
- `/dashboard` - User dashboard

Routes are protected using the `Authenticated` component from Convex and role-based guards.

## 🤖 AI Features

### Application Fit Scoring

When a creator submits an application, an AI agent automatically:
1. Analyzes the creator's profile (bio, social media)
2. Reviews the application content
3. Compares against campaign requirements
4. Generates a fit score (0-100) with detailed reasoning

The score includes:
- Overall fit score
- Strengths (1-5 points)
- Concerns (0-5 points)
- Recommendation tier

See `convex/ai/README.md` for detailed AI documentation.

## 🎨 UI Components

The project uses **shadcn/ui** components. To add new components:

```bash
pnpx shadcn@latest add component-name
```

Available components include:
- Button, Card, Input, Label, Textarea
- Alert, Badge, Separator, Sheet
- Skeleton (loading states)

## 🧪 Development

### Available Scripts

```bash
# Development
pnpm dev              # Start Vite dev server (port 3000)
pnpm convex dev       # Start Convex dev server

# Building
pnpm build            # Build for production
pnpm serve            # Preview production build

# Code Quality
pnpm lint             # Run Biome linter
pnpm format           # Format code with Biome
pnpm check            # Run all Biome checks

# Testing
pnpm test             # Run Vitest tests
```

### Code Style

The project uses **Biome** for linting and formatting. Configuration is in `biome.json`.

### Type Safety

- **TypeScript** for type checking
- **Convex** generates types from schema (`convex/_generated/dataModel.d.ts`)
- **TanStack Router** provides type-safe routing

## 🚢 Deployment

### Convex Deployment

Convex automatically deploys when you push to your repository (if configured) or you can deploy manually:

```bash
npx convex deploy
```

### Frontend Deployment

The project is configured for **Vercel** deployment (see `vercel.json`). To deploy:

1. Connect your repository to Vercel
2. Set environment variables:
   - `VITE_CONVEX_URL`
   - `CONVEX_DEPLOYMENT`
3. Deploy

The build process:
1. Runs `pnpm build` (Vite build + TypeScript check)
2. Serves the `dist/` directory

## 📚 Key Concepts

### Convex

- **Queries**: Read data reactively with `useQuery(api.module.function)`
- **Mutations**: Write data with `useMutation(api.module.function)`
- **Actions**: Async operations (e.g., AI scoring)
- **Real-time**: Data updates automatically in the UI

### TanStack Router

- **File-based routing**: Routes defined by file structure
- **Type-safe**: Route params and search params are typed
- **Layouts**: Shared layouts via `__root.tsx` and nested routes
- **Loaders**: Pre-fetch data before route renders

### Role-Based Access

- Use `useUserRole()` hook to check user role
- Use `<RoleGuard>` components for conditional rendering
- Protect routes with `beforeLoad` hooks

## 🔧 Troubleshooting

### Convex Connection Issues

```bash
# Check Convex status
npx convex status

# Re-authenticate
npx convex login

# Check environment variables
cat .env.local
```

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Check TypeScript errors
pnpm build
```

### AI Features Not Working

1. Verify OpenAI API key is set: `npx convex env get OPENAI_API_KEY`
2. Check Convex logs: `npx convex logs`
3. Ensure you have OpenAI credits

## 📖 Documentation

- [Convex Documentation](https://docs.convex.dev)
- [TanStack Router Docs](https://tanstack.com/router/v1)
- [Convex Auth Guide](https://labs.convex.dev/auth)
- [shadcn/ui Components](https://ui.shadcn.com)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run `pnpm check` to ensure code quality
4. Submit a pull request

## 📝 License

[Add your license here]

## 🙏 Acknowledgments

- Built with [Convex](https://www.convex.dev)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Routing by [TanStack Router](https://tanstack.com/router)
