# Vercel Environment Variables Guide

## 🚀 Required Environment Variables for Vercel

Add these environment variables in your Vercel project settings:

### How to Add:
1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Click **Add New** for each variable below
3. Add for **Production**, **Preview**, and **Development** environments

---

## ✅ Required Variables

| Variable Name | Value | Environment | Description |
|--------------|-------|-------------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://sameetshahid02-todoapp-phase02-backend.hf.space` | Production, Preview, Development | Hugging Face Backend API URL |

---

## 🔒 Optional Variables (if using Better Auth)

| Variable Name | Value | Environment | Description |
|--------------|-------|-------------|-------------|
| `BETTER_AUTH_SECRET` | Your secure 32+ character secret key | Production, Preview | JWT secret for authentication |
| `BETTER_AUTH_URL` | `https://phase02-todo-app.vercel.app` | Production | Your Vercel app URL |

---

## 📋 Step-by-Step Instructions:

1. **Navigate to Vercel Project:**
   - Go to: https://vercel.com/dashboard
   - Select your project: `phase02-todo-app`

2. **Go to Settings:**
   - Click on **Settings** tab
   - Scroll to **Environment Variables** section

3. **Add Each Variable:**
   - Click **Add New**
   - Enter the variable name and value
   - Select all environments (Production, Preview, Development)
   - Click **Save**

4. **Redeploy:**
   - After adding all variables, go to **Deployments** tab
   - Click on the latest deployment
   - Click **Redeploy** to apply the new environment variables

---

## ✅ Verification

After deployment, verify the connection:

1. Open your app: https://phase02-todo-app.vercel.app
2. Try to create a new task
3. Check browser console (F12) for any API errors
4. Tasks should be saved to the backend successfully

---

## 🐛 Troubleshooting

### If API calls fail:
- Check browser console for CORS errors
- Verify `NEXT_PUBLIC_API_URL` is correct
- Ensure backend is running: https://sameetshahid02-todoapp-phase02-backend.hf.space/health

### If authentication fails:
- Add `BETTER_AUTH_SECRET` (min 32 characters)
- Regenerate JWT tokens if needed

---

## 🔗 Useful Links

- Backend API Docs: https://sameetshahid02-todoapp-phase02-backend.hf.space/docs
- Backend Health Check: https://sameetshahid02-todoapp-phase02-backend.hf.space/health
- Vercel Environment Variables: https://vercel.com/docs/concepts/projects/environment-variables
