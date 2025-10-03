# Inquisitor – Tracing Footprints in the Web of Data  

A **multi-platform search and results dashboard** built with Next.js, React, and TailwindCSS.  
Inquisitor lets you explore, analyze, and summarize data across platforms like **GitHub, Twitter, LinkedIn, Instagram, and Google Scholar**, with search history management and modular APIs for extensibility.  

---

## Project Structure  

```
Inquisitor/
├── app/                        # Next.js App Router structure
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Global styles (Tailwind)
│   ├── loading.tsx             # App-level loading screen
│   └── api/                    # Serverless API routes
│       ├── search/             # Search endpoints
│       │   ├── route.ts        # Main search handler
│       │   ├── history/        # Search history API
│       │   └── summarize/      # Summarization API
│       ├── history/            # History-specific API
│       └── results/            # Results fetching API
├── components/                 # Reusable React components
│   ├── search-form.tsx         # Search input + UI
│   ├── result-card.tsx         # Results display card
│   ├── search-history-card.tsx # Past search listing
│   ├── platform-badge.tsx      # Platform identification UI
│   └── ui/                     # Shadcn + Radix UI components
├── lib/                        # Core logic and helpers
│   ├── search-storage.ts       # History persistence
│   ├── search/*.ts             # Platform-specific search handlers
│   │   ├── github.ts
│   │   ├── twitter.ts
│   │   ├── linkedin.ts
│   │   ├── google-scholar.ts
│   │   └── instagram.ts
├── types/                      # TypeScript type definitions
│   └── search.ts
├── package.json                # Dependencies and scripts
└── tailwind.config.js          # TailwindCSS configuration
```

---

## Running the Project  

### 1. Install Dependencies  
Make sure you have **Node.js 20 LTS or newer** installed.  
```bash
npm install --legacy-peer-deps
```

### 2. Development Mode  
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.  

### 3. Production Build  
```bash
npm run build
npm start
```

---

## Features  

- 🔍 **Multi-platform search integration** (GitHub, Twitter, LinkedIn, Instagram, Google Scholar, etc.)  
- 📜 **Search history management** with persistent storage  
- ✨ **Summarization API** for condensed insights  
- 🎨 **Responsive UI** powered by TailwindCSS + Radix UI + shadcn/ui  
- ⚡ **Serverless API routes** using Next.js App Router  
- 🛠 **Modular TypeScript architecture** for easy extensibility  

---

## Testing  

You can extend or test the app by:  
- Adding new search connectors in `lib/search/`  
- Using mock APIs in `app/api/`  
- Inspecting stored history with `search-storage.ts`  

Run linting:  
```bash
npm run lint
```

---

## Future Enhancements  

- 🤖 AI-powered summarization improvements  
- 📊 Enhanced data visualization with **Recharts**  
- 🔐 Authentication and personalization support  
- 📂 Exporting search results to CSV/PDF  

---

⚡ *Inquisitor is designed to help trace footprints in the vast web of data — providing a unified, customizable search experience with clean UI and modular back-end APIs.*  
