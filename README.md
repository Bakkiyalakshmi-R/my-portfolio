# Bakkiyalakshmi R. — Cinematic Portfolio

React + Vite + TypeScript, GSAP/ScrollTrigger, Lenis, Framer Motion, React Three Fiber, EmailJS.

## Run

```bash
npm install
npm run dev       # local dev
npm run build     # type-check + production build
npm run preview   # serve the production build
```

## Resume download

The real PDF lives at `public/assets/Bakkiyalakshmi_Resume.pdf` and downloads as
`Bakkiyalakshmi_R_Resume.pdf`. To update it, replace that file (keep the name).

## Contact form (EmailJS) — setup required

The form does not send anything until these are configured; until then it shows an
honest "not configured" error rather than a fake success.

1. Create a free account at https://www.emailjs.com.
2. **Email Services** → add a service (Gmail) → copy the **Service ID**.
3. **Email Templates** → create a template using these variables:
   `{{from_name}}`, `{{reply_to}}`, `{{subject}}`, `{{message}}`
   Set **To Email** to your address and **Reply-To** to `{{reply_to}}`. Copy the **Template ID**.
4. **Account → General** → copy your **Public Key** (safe for browsers; never use the private key).
5. Copy `.env.example` to `.env.local` and fill in:
   ```
   VITE_EMAILJS_SERVICE_ID=...
   VITE_EMAILJS_TEMPLATE_ID=...
   VITE_EMAILJS_PUBLIC_KEY=...
   ```
6. Restart `npm run dev` and send a test message.

## Environment variables

| Name | Where to find it | Secret? |
| --- | --- | --- |
| `VITE_EMAILJS_SERVICE_ID` | EmailJS → Email Services | No (ships in the browser bundle) |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS → Email Templates | No |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS → Account → General | No (public by design) |

Never add an EmailJS *private* key to this project. `.env.local` is git-ignored; only
`.env.example` (empty values) is committed. Vite bakes these values in at build time, so
**redeploy after changing them**.

In the EmailJS dashboard, under Account → Security, you can restrict the public key to your
deployed domain and enable rate limiting to limit abuse.

## Deploy to Vercel

1. Push the project to a GitHub repository (`.env.local` is ignored, so no keys are committed).
2. Go to https://vercel.com/new, import the repository, and keep the detected settings
   (Framework: Vite, Build: `npm run build`, Output: `dist`; they are also set in `vercel.json`).
3. Before the first deploy, open **Environment Variables** and add the three `VITE_EMAILJS_*`
   values for Production (and Preview if wanted).
4. Click **Deploy**.
5. On the live URL, check: the resume downloads as `Bakkiyalakshmi_R_Resume.pdf`, the navigation
   works, the GitHub/LinkedIn links open, and a real test message from the contact form arrives
   in your inbox.

Alternative (CLI): `npx vercel` for a preview, `npx vercel --prod` for production.
