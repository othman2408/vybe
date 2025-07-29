# Vybe

This project was created for learnign and to see how AI agents work!

Just describe what you want to build in plain English, and watch as AI creates a full web app for you. This was built as a learning project to explore how AI can help with coding and development.

## What it does

Tell Vybe what you want to build (like "a todo app" or "a landing page for my coffee shop"), and it will:

- Generate the complete code using AI
- Show you a live preview in a sandbox
- Let you browse and download all the source code
- Keep track of your conversation history

## Features

- 🤖 **AI that actually codes** - Just tell it what you want
- 📱 **Live previews** - See your app running instantly
- 📝 **Code browser** - Peek at all the generated files with syntax highlighting
- 🗂️ **File explorer** - Navigate through the project like a real IDE
- 👥 **User accounts** - Sign in and keep track of your projects
- ⚡ **Real-time chat** - Watch the AI work its magic step by step

## Tech Stack

### Frontend

- ![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js) **Next.js 15** - React framework with App Router
- ![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=flat&logo=typescript&logoColor=white) **TypeScript** - Type-safe development
- ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) **Tailwind CSS** - Utility-first styling
- ![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=flat&logo=shadcnui&logoColor=white) **shadcn/ui** - Modern component library
- ![React Query](https://img.shields.io/badge/React%20Query-FF4154?style=flat&logo=react-query&logoColor=white) **React Query** - Server state management
- ![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=flat&logo=clerk&logoColor=white) **Clerk** - Authentication and user management

### Backend

- ![tRPC](https://img.shields.io/badge/tRPC-2596BE?style=flat&logo=trpc&logoColor=white) **tRPC** - End-to-end typesafe APIs
- ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white) **Prisma** - Database ORM with migrations
- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat&logo=postgresql&logoColor=white) **PostgreSQL** - Primary database
- ![Inngest](https://img.shields.io/badge/Inngest-000000?style=flat) **Inngest** - Background job processing
- ![E2B](https://img.shields.io/badge/E2B-FF6B35?style=flat) **E2B Code Interpreter** - Isolated code execution sandboxes

### AI & Processing

- **DeepSeek AI** - Code generation model
- **Inngest Agent Kit** - AI agent orchestration

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (home)/            # Home page and auth routes
│   ├── projects/          # Individual project views
│   └── api/               # API endpoints
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── code-view/        # Code syntax highlighting
│   └── file-explorer.tsx # File tree navigation
├── modules/              # Feature-specific components
│   ├── home/             # Project creation and listing
│   ├── projects/         # Project management
│   └── messages/         # Chat interface
├── inngest/              # Background job functions
├── lib/                  # Utility functions and config
└── trpc/                 # API router definitions
```

## Want to run it yourself?

### You'll need

- Node.js 18+ (or Bun better)
- A PostgreSQL database (Neon, Supabase, or any provider works)
- API keys for the services below

### Quick setup

1. **Clone it**

   ```bash
   git clone https://github.com/othman2408/vybe
   cd vybe
   bun install  # or npm install
   ```

2. **Get your API keys**
   You'll need accounts with:

   - [Clerk](https://clerk.dev) - for user authentication
   - [DeepSeek](https://platform.deepseek.com/) - for the AI model (or any OpenAI-compatible provider)
   - [E2B](https://e2b.dev) - for code sandboxes
   - [Inngest](https://inngest.com) - for background jobs

   **💡 AI Provider Options:**

   - **Free**: [Google AI Studio](https://aistudio.google.com/) - completely free to start
   - **Cheap**: DeepSeek - $2 in credits is more than enough for testing
   - **Any OpenAI-compatible API** works - just update the base URL in the code
   - **Check inngest supported providers there are more supported providers**

3. **Set up your `.env`**

   ```bash
   # Database - check neon db or supabase or any other provider
   DATABASE_URL="postgresql://..."

   # Authentication (Clerk)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="..."
   CLERK_SECRET_KEY="..."

   # AI Model
   DEEPSEEK_API_KEY="..."

   # Code Execution
   E2B_API_KEY="..."

   # Background Jobs (Inngest)
   INNGEST_EVENT_KEY="..."
   INNGEST_SIGNING_KEY="..."
   ```

4. **Set up the database and run**

   ```bash
   bun run db:migrate
   bun dev
   ```

   In a separate terminal, start Inngest:

   ```bash
   npx inngest-cli@latest dev
   ```

   Then open [localhost:3000](http://localhost:3000) and start building!

## How to use it

### Start by

1. Sign in
2. Type what you want to build - be as detailed or vague as you like
3. Hit submit (or `Cmd/Ctrl + Enter` if you're in a hurry)
4. Grab some coffee and watch the AI do its thing ☕

### Checking out your creation

- **Preview tab** - Your app running live in a sandbox
- **Code tab** - All the source code with pretty syntax highlighting
- Click around the file tree to explore what got generated

### Usage limits (Just testing Clerk Billing)

- Free accounts: 2 projects per month
- Pro accounts: 100 projects per month

## Useful commands

```bash
# Development
bun dev                    # Start the development server
bun build                  # Build for production

# Database stuff
bun run db:migrate         # Update database structure
bun run db:studio          # Visual database browser
bun run db:reset           # Reset everything (be careful!)
```

## Want to contribute?

This is a learning project, so feel free to:

- Fork it and play around
- Open issues if you find bugs
- Submit PRs if you want to add cool features
- Use it as inspiration for your own AI experiments
