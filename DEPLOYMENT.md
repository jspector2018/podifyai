# Deployment Guide for PodifyAI

## Prerequisites

Before deploying, you need API keys from:

1. **Supabase** (free tier available)
   - Sign up at [supabase.com](https://supabase.com)
   - Create a new project
   - Get your project URL and keys from Settings > API

2. **OpenAI** (paid, ~$0.01-0.10 per conversion)
   - Sign up at [platform.openai.com](https://platform.openai.com)
   - Add payment method
   - Create API key

3. **ElevenLabs** (free tier: 10k chars/month)
   - Sign up at [elevenlabs.io](https://elevenlabs.io)
   - Free tier is enough for ~10-15 conversions/month
   - Get API key from profile settings

## Step-by-Step Deployment

### 1. Set Up Supabase

1. Create a new Supabase project
2. Copy the SQL from `supabase-schema.sql`
3. Paste and run it in the SQL Editor (Database > SQL Editor)
4. Enable Google OAuth (optional):
   - Go to Authentication > Providers
   - Enable Google
   - Add OAuth credentials from [Google Cloud Console](https://console.cloud.google.com)
5. Get your credentials:
   - Go to Settings > API
   - Copy the Project URL, anon public key, and service_role key

### 2. Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository: `jspector2018/podifyai`
4. Configure environment variables:
   - \`NEXT_PUBLIC_SUPABASE_URL\`
   - \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`
   - \`SUPABASE_SERVICE_ROLE_KEY\`
   - \`OPENAI_API_KEY\`
   - \`ELEVENLABS_API_KEY\`
5. Click "Deploy"

#### Option B: Deploy via CLI

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd podifyai
vercel

# Follow the prompts and add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add OPENAI_API_KEY
vercel env add ELEVENLABS_API_KEY

# Deploy to production
vercel --prod
\`\`\`

### 3. Configure Domain (Optional)

In Vercel dashboard:
1. Go to your project settings
2. Domains tab
3. Add your custom domain

### 4. Test the Deployment

1. Visit your deployed URL
2. Sign up for an account
3. Upload a small PDF (1-2 pages)
4. Generate a podcast
5. Verify the audio plays and downloads work

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| \`NEXT_PUBLIC_SUPABASE_URL\` | Your Supabase project URL | \`https://xxx.supabase.co\` |
| \`NEXT_PUBLIC_SUPABASE_ANON_KEY\` | Supabase anonymous/public key | \`eyJhbGc...\` |
| \`SUPABASE_SERVICE_ROLE_KEY\` | Supabase service role (secret!) | \`eyJhbGc...\` |
| \`OPENAI_API_KEY\` | OpenAI API key | \`sk-proj-...\` |
| \`ELEVENLABS_API_KEY\` | ElevenLabs API key | \`abc123...\` |

## Cost Estimates (per conversion)

- **Supabase:** Free (within generous limits)
- **OpenAI GPT-4:** ~$0.01-0.10 per conversion (depending on PDF length)
- **ElevenLabs:** Free tier (10k chars/month) or ~$0.15-0.30 per conversion
- **Vercel:** Free (hobby plan supports this traffic easily)

**Total per conversion:** ~$0.01-0.40 depending on usage and tiers

## Troubleshooting

### "Failed to upload PDF"
- Check Supabase storage policies are set correctly
- Verify the storage buckets were created
- Check browser console for specific errors

### "Failed to generate audio"
- Verify ElevenLabs API key is valid
- Check you haven't exceeded free tier limits
- Ensure voice IDs in code match your ElevenLabs account

### "Unauthorized" errors
- Check all environment variables are set in Vercel
- Ensure Supabase RLS policies are enabled
- Verify user is properly authenticated

### Google OAuth not working
- Add Vercel domain to Google Cloud Console authorized redirects
- Add callback URL in Supabase: \`https://your-domain.vercel.app/auth/callback\`

## Monitoring

- **Vercel:** Check deployment logs in dashboard
- **Supabase:** Monitor database and storage usage
- **OpenAI:** Track API usage in platform.openai.com
- **ElevenLabs:** Monitor character usage in dashboard

## Next Steps

Once deployed and validated:
- Set up analytics (Vercel Analytics, Google Analytics)
- Add Stripe integration for Pro tier
- Set up error monitoring (Sentry)
- Create landing page SEO content
- Add more voice options
- Implement webhook for async processing (for longer PDFs)

## Support

If you encounter issues:
1. Check the logs in Vercel dashboard
2. Review Supabase logs
3. Open an issue on GitHub
