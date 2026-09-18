# CivicEye: AI-Powered Community Civic Intelligence Platform

> **"AI sees what cameras see. Citizens report what cameras can't. AI connects the dots."**  
> *See. Report. Connect. Solve.*

---

## 📖 Overview

**CivicEye** is a smart city community civic intelligence platform developed for **Tejas Hackathon 2k26**. Rather than treating municipal governance as an overwhelming backlog of thousands of disjointed complaint tickets and separate CCTV feeds, CivicEye combines **AI Computer Vision from cameras**, **Multi-modal Citizen Reporting**, and **Cross-Signal Correlation** to diagnose and solve the true root causes of urban problems.

---

## 🌟 Key Pillars & Features

1. **🏛️ Municipal Operations Command Center**
   - **Emerging Civic Clusters**: Aggregates hundreds of complaints and CCTV alerts into ranked problem clusters with confidence scores.
   - **Interactive GIS Map**: Light theme CartoDB GIS cartography with real-time hotspot radius circles and CCTV camera nodes.
   - **AI Root Cause Synthesis**: Moves from isolated detection to systemic root-cause diagnosis.
   - **1-Click Work Order Dispatch**: Direct routing to municipal departments (Drainage Board, Water Board, Pollution Control).

2. **📱 Citizen Service Portal & CivicScore Engagement**
   - **1-Minute Issue Reporter**: Natural language description with real-time AI category & priority preview.
   - **🏅 CivicScore Gamification**: Citizens earn points for submitting valid reports (+25 pts) and verifying camera detections (+10 pts).
   - **🛡️ Community Trust Ranking**: High CivicScore increases the initial confidence weighting of that citizen's reports in the AI clustering engine.
   - **👁️ Help AI Verify (Human-in-the-Loop)**: Nearby citizens validate low-confidence CCTV detections to train and refine AI models.

3. **🧠 AI Correlation & Root Cause Studio**
   - **Multi-Source Ingest**: Public CCTV Computer Vision + Citizen Multi-lingual NLP.
   - **NLP Semantic & Spatio-Temporal Clustering**: Groups varied complaint phrasings into cohesive problem themes.
   - **Cross-Domain Correlation Graph**: Connects seemingly disparate signals (e.g. *Camera Waterlogging* + *Citizen Choked Drain Reports* + *Camera Garbage Dump* ➔ *"Drainage intake blocked by solid waste"*).
   - **Interactive Simulation Sandbox**: Test and simulate real-world municipal scenarios.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite 6, Tailwind CSS v4
- **Database & Realtime**: Supabase (PostgreSQL + PostGIS + Realtime WebSockets + Storage Bucket)
- **Local Fallback**: Browser IndexedDB & LocalStorage Data Lake
- **AI Models**: Google Gemini Multimodal Vision, Edge YOLOv12 Optical Feature Extraction
- **Icons & UI**: Lucide React, Canvas Confetti
- **Mapping & GIS**: Leaflet & CartoDB Positron
- **Theme**: Institutional White & Royal Blue Government Portal Aesthetic

---

## 🗄️ Supabase Cloud Database Setup (1-Click)

1. Create a free project at [supabase.com](https://supabase.com/).
2. Go to **SQL Editor** in your Supabase Dashboard.
3. Paste and run [`supabase/schema.sql`](file:///Users/shivamkumar/Desktop/projects/tejas26-civix/supabase/schema.sql). This will automatically create:
   - All 8 database tables (`clusters`, `citizen_reports`, `verification_queue`, `cameras`, `mcd_vehicles`, `audit_logs`, `user_profile`, `departments`).
   - Row Level Security (RLS) public read/write access policies.
   - Realtime WebSocket publication subscriptions.
   - `civiceye-media` public storage bucket for photos and videos.
   - Initial seed municipal datasets.
4. Copy your **Project URL** and **Anon Key** into `.env` (or configure directly in the UI via the **System API Settings** modal):
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Run
```bash
# 1. Clone the repository
git clone git@github.com:24f2002727/CivicEye.git
cd CivicEye

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) in your browser.

---

## 📜 License
Developed for Tejas Hackathon 2k26.
