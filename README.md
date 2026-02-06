# PodifyAI - Turn PDFs into Podcasts

Transform any PDF into an engaging podcast in 60 seconds using AI.

## Features

- 📄 **PDF Upload** - Drag & drop or select any PDF document
- 🎙️ **AI-Powered Conversion** - GPT-4 generates natural podcast scripts
- 🔊 **Professional Voice** - ElevenLabs text-to-speech with multiple voices
- 🎨 **Multiple Styles** - Quick Take (2 min), Summary (5 min), Deep Dive (15 min)
- 💾 **Download & Stream** - Listen online or download MP3
- 📊 **Conversion History** - Track all your past conversions
- 🔐 **Authentication** - Email and Google OAuth via Supabase

## Tech Stack

- **Framework:** Next.js 16 (App Router) with TypeScript
- **Styling:** Tailwind CSS + Radix UI components
- **Database:** Supabase (PostgreSQL + Auth + Storage)
- **AI:** OpenAI GPT-4 for script generation
- **TTS:** ElevenLabs API for voice synthesis
- **PDF Processing:** pdf-parse
- **Deploy:** Vercel

## Setup Instructions

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/jspector2018/podifyai.git
cd podifyai
\`\`\`

### 2. Install Dependencies

\`\`\`bash
pnpm install
\`\`\`

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and keys
3. Run the following SQL in the SQL Editor:

\`\`\`sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create conversions table
create table conversions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  pdf_url text,
  audio_url text,
  script text,
  style text not null check (style in ('quick', 'summary', 'deep')),
  voice text not null,
  duration_seconds int,
  status text default 'pending' check (status in ('pending', 'processing', 'complete', 'failed')),
  created_at timestamptz default now()
);

-- Create usage tracking table
create table usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  month text not null,
  count int default 0,
  created_at timestamptz default now(),
  unique(user_id, month)
);

-- Create storage buckets
insert into storage.buckets (id, name, public) values ('pdfs', 'pdfs', true);
insert into storage.buckets (id, name, public) values ('audio', 'audio', true);

-- Set up RLS policies
alter table conversions enable row level security;
alter table usage enable row level security;

-- Conversions policies
create policy "Users can view their own conversions"
  on conversions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own conversions"
  on conversions for insert
  with check (auth.uid() = user_id);

-- Usage policies
create policy "Users can view their own usage"
  on usage for select
  using (auth.uid() = user_id);

-- Storage policies
create policy "Users can upload their own PDFs"
  on storage.objects for insert
  with check (bucket_id = 'pdfs' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can view their own PDFs"
  on storage.objects for select
  using (bucket_id = 'pdfs');

create policy "Users can upload their own audio"
  on storage.objects for insert
  with check (bucket_id = 'audio' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can view their own audio"
  on storage.objects for select
  using (bucket_id = 'audio');
\`\`\`

4. Configure Google OAuth (optional):
   - Go to Authentication > Providers > Google
   - Enable Google provider
   - Add your OAuth credentials from Google Cloud Console

### 4. Set Up Environment Variables

Copy \`.env.local.example\` to \`.env.local\`:

\`\`\`bash
cp .env.local.example .env.local
\`\`\`

Fill in your credentials:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=sk-...
ELEVENLABS_API_KEY=...
\`\`\`

**API Keys Required:**
- **Supabase:** Free tier available at [supabase.com](https://supabase.com)
- **OpenAI:** Get API key at [platform.openai.com](https://platform.openai.com)
- **ElevenLabs:** Free tier (10k chars/month) at [elevenlabs.io](https://elevenlabs.io)

### 5. Run Development Server

\`\`\`bash
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

### 6. Deploy to Vercel

\`\`\`bash
vercel
\`\`\`

Or connect your GitHub repo to Vercel and deploy automatically.

## Usage Limits

- **Free Tier:** 3 conversions per month
- **Pro Tier:** Unlimited conversions (coming soon)

## Project Structure

\`\`\`
podifyai/
├── app/
│   ├── api/
│   │   ├── convert/          # PDF to podcast conversion
│   │   └── conversions/      # List user conversions
│   ├── auth/
│   │   ├── signin/           # Sign in page
│   │   └── signup/           # Sign up page
│   ├── dashboard/            # Main app interface
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Landing page
├── components/
│   └── ui/                   # Reusable UI components
├── lib/
│   ├── supabase.ts           # Supabase client
│   └── utils.ts              # Utility functions
└── public/                   # Static assets
\`\`\`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| \`NEXT_PUBLIC_SUPABASE_URL\` | Supabase project URL | Yes |
| \`NEXT_PUBLIC_SUPABASE_ANON_KEY\` | Supabase anonymous key | Yes |
| \`SUPABASE_SERVICE_ROLE_KEY\` | Supabase service role key | Yes |
| \`OPENAI_API_KEY\` | OpenAI API key | Yes |
| \`ELEVENLABS_API_KEY\` | ElevenLabs API key | Yes |

## Contributing

This is an MVP. Contributions welcome after initial validation!

## License

MIT

## Support

For issues or questions, please open a GitHub issue.
