# Saans AI Coach — shared API key setup

The app can run the AI coach for **all logged-in users** using **one Anthropic API key** stored securely on Firebase (not in the website code).

Until you complete this setup, logged-in users can still use the coach if they add their own key in **Settings → AI Coach**.

---

## What you need

1. A Firebase project (already set up: `saans-3206a`)
2. **Blaze (pay-as-you-go) plan** on Firebase — required for Cloud Functions
3. An **Anthropic API key** from [console.anthropic.com](https://console.anthropic.com/)

---

## Step 1 — Install tools (one time, on your computer)

1. Install [Node.js 20 LTS](https://nodejs.org/)
2. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
3. Log in:
   ```bash
   firebase login
   ```

---

## Step 2 — Link this project

In a terminal, open the `Saans2` folder and run:

```bash
firebase use saans-3206a
```

If asked, choose the existing **saans-3206a** project.

---

## Step 3 — Store your Anthropic key as a secret

Replace `YOUR_ANTHROPIC_KEY` with your real key:

```bash
firebase functions:secrets:set ANTHROPIC_API_KEY
```

Paste the key when prompted (it will not show on screen).

---

## Step 4 — Deploy the coach function

```bash
cd functions
npm install
cd ..
firebase deploy --only functions:coachChat
```

When it finishes, you should see a URL like `coachChat(us-central1)`.

---

## Step 5 — Test on the live site

1. Upload the latest `Saans2` files to GitHub (if you changed any)
2. Open the site and **log in**
3. Go to **Coach** and send a message — it should work **without** adding a key in Settings

---

## How it works in the app

In `js/config.js`:

- `COACH_MODE: 'auto'` — tries the cloud coach first (logged-in users), then falls back to a personal key in Settings
- `COACH_MODE: 'cloud'` — cloud only (login required)
- `COACH_MODE: 'local'` — personal key in Settings only

After deploy, keep **`auto`** so everyone gets the shared coach when logged in.

---

## Troubleshooting

| Problem | Fix |
|--------|-----|
| “Login required” on Coach | Sign in on the **Login** page first |
| Coach still asks for API key | Redeploy `coachChat`; hard refresh the site (Ctrl+Shift+R) |
| Function deploy fails | Enable Blaze billing in Firebase Console |
| “Permission denied” | Run `firebase login` again |

---

## Cost note

Anthropic charges per message. Firebase Blaze has a free tier for functions; monitor usage in Firebase and Anthropic dashboards.
