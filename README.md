# ✨ CelebAI — GenAI Celebration & Event Planner

> **PromptWars Virtual — Challenge 5: Celebration & Event Planner**  
> *Transform chaotic event ideas into master plans with real-time budget charts, phased timelines, vendor checklists, and 5 bespoke themes powered by Google Gemini 2.5 Flash.*

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-8E75B2?logo=google&logoColor=white)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🌟 Overview

**CelebAI** is an AI celebration architect designed for weddings, milestone birthdays, and community festivals. It structures complex celebrations into clear, actionable, and visually stunning interactive dashboards with live calculation engines and generative assistance.

---

## ✨ Core Features

- 💰 **Dynamic Budget Visualizer:** Conic Donut chart, category breakdown, real-time allocation percentage, and buffer tracking.
- ⏱️ **Phased Execution Timeline:** Milestones organized from months prior down to day-of hourly rundowns with interactive completion status.
- 📋 **Vendor Partner Checklist:** Categorized bookings with priority badges, contact records, contract notes, and budget commitments.
- 💡 **Signature Experiential Ideas:** Bespoke touchpoints, interactive entertainment, and creative décor concepts with bookmarking.
- 🤖 **Conversational AI Copilot:** Instant iteration powered by **Gemini 2.5 Flash** with prompt suggestion chips and real-time dashboard state updates.
- 🎨 **5 Bespoke Design Themes (`ui-ux-pro-max`):**
  - **Champagne Royal:** Velvet black & molten amber gold for black-tie luxury weddings.
  - **Emerald Sanctuary:** Forest noir & mint sage for botanical garden ceremonies.
  - **Cyberpunk Neon:** Neon laser coral & cyan for electric milestone birthdays.
  - **Amethyst Sunset:** Violet plum & rose dawn for community arts galas.
  - **Pearl Aurora:** Opulent ivory & amethyst for high-contrast day mode.
- 📄 **One-Click PDF Dossier Export:** Clean, formatted PDF download for vendors, couples, and planning committees.

---

## 🛠️ Tech Stack

- **Framework:** React 19 + Vite
- **AI Model:** Google Gemini 2.5 Flash (`@google/generative-ai`)
- **Styling:** Vanilla CSS design tokens with glassmorphism and theme switches
- **Icons & Visuals:** `lucide-react`, `canvas-confetti`
- **Export Engine:** `jspdf` client-side document compiler

---

## 🚀 Quickstart

### Prerequisites
- Node.js (v18+)
- npm or pnpm

### 1. Clone & Install
```bash
git clone https://github.com/The-AlphaWolf/celebai.git
cd celebai
npm install
```

### 2. Configure Environment (Optional)
```bash
cp .env.example .env
```
Add your free Gemini API key from [Google AI Studio](https://aistudio.google.com/):
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```
*(Note: You can also supply the API key directly in the web app via the settings modal, or test all features in Instant Demo Mode without an API key!)*

### 3. Start Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

---

## 🌐 Deployment

### Deploy to GitHub Pages (Automated via GitHub Actions)
This repository includes a GitHub Actions workflow `.github/workflows/deploy.yml` that builds and deploys CelebAI on every push to `main`.

### Deploy to Vercel
1. Import repository on [Vercel](https://vercel.com/new).
2. Framework Preset: **Vite**
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. (Optional) Add `VITE_GEMINI_API_KEY` to Environment Variables.
6. Click **Deploy**!

---

## 🏆 PromptWars Challenge 5 Deliverable

Built for the **PromptWars Virtual Challenge 5: Celebration & Event Planner**. Includes complete promotional assets and composition generated via the `/brag` engine in [`brag-output/`](./brag-output).
