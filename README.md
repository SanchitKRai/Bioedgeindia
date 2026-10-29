# 🧬 BioEdge India

> **A free, AI-powered computational biology platform for life science students and researchers across India.**

<p align="center">
  <img src="./public/logo.jpg" alt="BioEdge India Logo" width="140" style="border-radius: 50%; box-shadow: 0 4px 20px rgba(0, 232, 122, 0.25);" />
</p>

<p align="center">
  <a href="https://bioedgeindia.vercel.app">
    <img src="https://img.shields.io/badge/🌐_Live_Site-bioedgeindia.vercel.app-00e87a?style=for-the-badge&logoColor=040d0a" alt="Live Site" />
  </a>
  <a href="https://openrouter.ai/">
    <img src="https://img.shields.io/badge/Powered_by-OpenRouter_AI-6C5CE7?style=for-the-badge&logoColor=white" alt="Powered by OpenRouter" />
  </a>
  <a href="https://vercel.com">
    <img src="https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Deployed on Vercel" />
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-cyan?style=for-the-badge" alt="License" />
  </a>
</p>

---

## 🌟 The Mission

Biology education in India is full of promise, yet students face high paywalls, fragmented listings, and expensive bioinformatics training software. 

**BioEdge India** was built to break those barriers — providing **completely free**, interactive client-side simulators, molecular viewers, live opportunity aggregators, and AI-driven tutoring tools in one cohesive, high-performance web experience.

---

## 🚀 Key Features

### 🧪 1. Interactive Bioinformatics Sandbox (`/sandbox`)
A client-side laboratory dashboard featuring five computational biology utilities:
*   🧬 **DNA Toolkit**: Upper-case sanitization, live FASTA header parser, codon-triplet visualizer, chemical-coded amino acid translation matrix, Wallace melting temperature ($T_m$), and dynamic base composition charts.
*   🔬 **Alignment Lab**: Needleman-Wunsch global sequence aligner rendering dynamic scoring tables, backtrack highlights, and cell scoring formula hover tooltips.
*   🧬 **Primer Designer**: Organism-specific codon-biased reverse translator (*E. coli* vs. *H. sapiens*) with GC content projection, melting temperatures, and active primer dimer/Δ$T_m$ warning panels.
*   ⚡ **Virtual Agarose Gel Simulator**: Real-time 2D agarose gel physics simulation mapping DNA base pairs to vertical migration distance logarithmically. Interactive voltage pulse, Ethidium Bromide (EtBr) UV glow animations, and direct data-binding to custom designed primers.
*   💎 **3D Molecular Viewer & Pocket Analyzer**: 3D WebGL protein rendering (ribbon, stick, spacefill, lines) with preloaded structures (CDK2, HIV-1 Protease, GFP) and custom PDB fetching. Dynamically calculates Euclidean distances ($d = \sqrt{\Delta x^2 + \Delta y^2 + \Delta z^2}$), isolates binding pocket residues, overlays 3D labels, and ranks proximity contacts (H-Bonds/VdW).

### 📡 2. National Bio-Events & Hackathon Radar (`/radar`)
An active events dashboard that dynamically tracks biotechnology hackathons, symposiums, and workshops in India:
*   **Live Scraper Integration**: Queries `https://indiabioscience.org/events` via a Node.js serverless API to retrieve live listings, categorize them, and parse location details on the fly.
*   **Resilient API Fallback**: Automated static client-side fallback to `events.json` if serverless execution fails.
*   **Teammate Finder Pipeline**: Fosters student collaboration by linking listings to LinkedIn networks.

### 💼 3. National Lab Projects & Vacancy Tracker (`/#jobs`)
An active opportunities dashboard displaying JRF (Junior Research Fellow), project scientist, and dissertation vacancies across premium institutes (CSIR-CCMB, IISc, ICMR-NII, BIRAC, etc.).
*   **Dynamic JSON Backend**: Decoupled listings structure enabling instant weekly catalog updates without source recompilations.
*   **Intelligent Filters**: Badges highlighting mandatory eligibility criteria (NET/GATE Required vs. Optional).

### 🤖 4. AI Biology Chat & Curated Directories (`/#chatbot`)
*   **AI Biology Chatbot**: Secure OpenRouter-powered chat window tailored to clarify complex molecular genetics, biochem, and bioinformatics concepts.
*   **AI Tools Directory**: A curated list of 30+ computational and AI tools for biology.

---

## 🏗️ Technical Stack & Architecture

```
Client / UI   →  Vanilla HTML5 + CSS3 (Glassmorphism, custom Keyframe Animations) + Vanilla JavaScript
Serverless    →  Node.js API Handlers (OpenRouter API proxy, IndiaBioscience HTML Scraper)
Database      →  Decoupled Client JSON Catalogs (events.json, notifications.json)
Hosting       →  Vercel (Static Assets + Serverless Engine)
SEO & Analytics →  Google Analytics + Sitemap XML + Robots TXT
```

### Repository Structure

```
Bioedgeindia/
├── public/                 # Static Assets & Frontend Pages
│   ├── index.html          # Homepage & Job Tracker UI
│   ├── sandbox.html        # Bioinformatics Sandbox & Simulators
│   ├── radar.html          # National Bio-Radar Dashboard
│   ├── robots.txt          # Crawler Instructions
│   ├── sitemap.xml         # Search Engine Optimization Index
│   ├── logo.jpg            # Branding Asset
│   ├── pdb/                # Preloaded Local Protein Coordinates
│   └── data/               
│       ├── events.json         # Curated Fallback Fests & Hackathons
│       └── notifications.json  # Curated JRF & National Lab Opportunities
├── api/                    # Vercel Serverless Functions (Backend)
│   ├── Chat.js             # OpenRouter API Secure Proxy
│   ├── events.js           # Live HTML Scraper for IndiaBioscience Feed
│   └── posts.js            # Mock announcements feed
└── vercel.json             # Deployment settings & API rewrites
```

---

## 🛠️ Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/sanchitk866-glitch/Bioedgeindia.git
   cd Bioedgeindia
   ```

2. **Configure Environment Variables**

   Create a `.env` file in the root directory:
   ```env
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   # Optional; defaults to meta-llama/llama-3.1-8b-instruct
   OPENROUTER_MODEL=meta-llama/llama-3.1-8b-instruct
   ```

3. **Install Vercel CLI and Run Dev Server**
   ```bash
   npm install -g vercel
   vercel dev
   ```

4. **Launch Application**
   Open `http://localhost:3000` in your web browser.

The model must be enabled for the OpenRouter account behind `OPENROUTER_API_KEY`. To inspect currently listed model IDs without exposing the key in source code, use OpenRouter's model catalog:

```bash
curl -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  https://openrouter.ai/api/v1/models
```

Set `OPENROUTER_MODEL` to an available model ID if the default is not listed or the account cannot access it. The API route returns a generic model-unavailable message for OpenRouter `404` responses and never returns provider error details or the API key.

### Vercel deployment

Add `OPENROUTER_API_KEY` to the Vercel **Production** environment (and Preview/Development if needed), optionally add `OPENROUTER_MODEL`, then redeploy. The key is read only by `api/Chat.js`; the browser calls `/api/Chat` and never receives the key.

---

## 🤝 Contributing

Contributions to grow free life science resources in India are welcome!

1. Fork this repository.
2. Create your feature branch (`git checkout -b feature/NewTool`).
3. Commit your changes (`git commit -m "feat: add phylogenetic tree tool"`).
4. Push to the branch (`git push origin feature/NewTool`).
5. Open a Pull Request.

---

## 📬 Connect

**Sanchit Kumar** — Founder, BioEdge India  
*B.Sc. Life Sciences, Sri Aurobindo College, University of Delhi*

<p align="left">
  <a href="https://www.linkedin.com/company/bioedge-india/">
    <img src="https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
  <a href="mailto:sanchitk866@gmail.com">
    <img src="https://img.shields.io/badge/Email-Reach_Out-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" />
  </a>
</p>

---

<p align="center">
  Built with 🧬, 💻, and ❤️ in India. Free & accessible for every biology student.
</p>
