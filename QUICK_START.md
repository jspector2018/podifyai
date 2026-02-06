# 🚀 Quick Start - Deploy in 15 Minutes

Get PodifyAI live in 15 minutes. Follow these steps exactly.

## ⚡ Step 1: Supabase Setup (5 min)

1. Go to [supabase.com](https://supabase.com) → Sign up/Sign in
2. Click "New Project"
3. Name: `podifyai` | Password: (save it!) | Region: closest to you
4. Wait ~2 minutes for project creation
5. Go to **Database** → **SQL Editor** → New query
6. Copy ALL content from `supabase-schema.sql` and paste → Run
7. Go to **Settings** → **API**
8. Copy these 3 values (you'll need them soon):
   - Project URL
   - anon public key
   - service_role key

## 🔑 Step 2: Get API Keys (5 min)

### OpenAI
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up → Add payment method (required)
3. Click your profile → "View API keys"
4. "Create new secret key" → Copy it (starts with `sk-proj-`)

### ElevenLabs
1. Go to [elevenlabs.io](https://elevenlabs.io)
2. Sign up (free tier is fine)
3. Click profile icon → "Profile + API key"
4. Copy your API key

## 🚀 Step 3: Deploy to Vercel (5 min)

### Option A: Via Dashboard (Easier)
1. Go to [vercel.com](https://vercel.com) → Sign in with GitHub
2. "Add New" → "Project"
3. Import `jspector2018/podifyai` (or your fork)
4. Open "Environment Variables" dropdown
5. Add these 5 variables:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL = <your supabase project url>
NEXT_PUBLIC_SUPABASE_ANON_KEY = <your supabase anon key>
SUPABASE_SERVICE_ROLE_KEY = <your supabase service role key>
OPENAI_API_KEY = <your openai key>
ELEVENLABS_API_KEY = <your elevenlabs key>
\`\`\`

6. Click "Deploy"
7. Wait 2-3 minutes
8. Click "Visit" to see your live site!

### Option B: Via CLI (Faster)
\`\`\`bash
npm i -g vercel
vercel login
cd podifyai
vercel
\`\`\`

Then add environment variables in the Vercel dashboard.

## ✅ Step 4: Test It (2 min)

1. Go to your live URL
2. Click "Get Started"
3. Sign up with email
4. Upload a small PDF (1-2 pages)
5. Select "Quick Take" + any voice
6. Click "Generate Podcast"
7. Wait ~30-60 seconds
8. Listen to your podcast! 🎉

## 🐛 Troubleshooting

**"Failed to upload PDF"**
- Check you ran the Supabase schema SQL
- Verify storage buckets exist in Supabase Storage tab

**"Failed to generate audio"**
- Check ElevenLabs API key is correct
- Make sure you haven't hit free tier limit (10k chars)

**"Unauthorized"**
- Double-check all 5 environment variables in Vercel
- Redeploy after adding variables

**Can't sign up**
- Check Supabase auth is enabled (Settings → Authentication)
- Confirm email is enabled in auth providers

## 💰 Costs

**First 10 conversions:**
- Supabase: Free ✅
- Vercel: Free ✅
- OpenAI: ~$0.10-1.00 total
- ElevenLabs: Free tier (10k chars) ✅

**After validation:**
- ~$0.01-0.40 per conversion depending on PDF length

## 📊 Monitor Usage

- **Vercel**: Dashboard → Your Project → Deployments/Logs
- **Supabase**: Dashboard → Database → Table editor
- **OpenAI**: platform.openai.com → Usage
- **ElevenLabs**: elevenlabs.io → Profile → Usage

## 🎯 Next Actions

After your first successful conversion:
1. Share with 5 friends for feedback
2. Post on Twitter/LinkedIn with demo
3. Track which PDFs convert best
4. Decide if you want to add Stripe
5. Consider custom domain

## 🆘 Need Help?

1. Check [BUILD_REPORT.md](./BUILD_REPORT.md) for detailed info
2. See [DEPLOYMENT.md](./DEPLOYMENT.md) for troubleshooting
3. Open GitHub issue if stuck

---

**You're 15 minutes away from a live SaaS app. Let's go! 🚀**
