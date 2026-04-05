# Housekeeping Assignment Tool - Deployable Package

This is a lightweight Next.js app built for Vercel.

## What this MVP does
- Daily setup for attendants, departure cap, and max square footage
- Room input for departures and stayovers
- Assign departures first
- Assign stayovers after
- DND hold list
- Float board overflow
- Editable board names
- Print using the browser print button

## Local test
1. Install Node.js 18 or newer
2. Open a terminal in this folder
3. Run:

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## Deploy to Vercel
1. Create a GitHub repo
2. Upload all files from this folder to the repo
3. In Vercel, click **Add New > Project**
4. Import that GitHub repo
5. Leave defaults as-is and click **Deploy**

Vercel will detect this as a Next.js app automatically.

## Notes
- This is front-end only for now
- Data does not save yet after refresh
- Multi-user live sync is not added yet
- Best next upgrades: saved dates, drag-and-drop, auth, database
