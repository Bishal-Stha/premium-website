# Production Deployment Instructions

Your application is completely built and functional locally. However, in order to deploy this Next.js + Supabase application to Vercel, there are two requirements:

1. **Production Database:** The Next.js frontend uses `http://127.0.0.1:54321` to fetch chapters right now. Vercel's Edge/Serverless functions cannot connect to your local computer. 
   - *Fix:* You will need to create a project on `supabase.com` and use its API URL and Anon Key.

2. **Project Naming:** Your project directory is `premiumWebsite`. Vercel automatically uses directory names for project creation, but it rejects capital letters. Auto-linking will fail.

**To deploy interactively, run the following in this prompt:**
```bash
! npx vercel
```
When it asks to set up the project, specify a lowercase name like `premium-website`. 

Once it is deployed, go to the Vercel Dashboard, navigate to the environment variables, and add your *Production* `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`, then redeploy!
