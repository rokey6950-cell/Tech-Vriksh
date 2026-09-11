# Tech Vriksh — Real. Relevant. Rooted.

> **Tech Vriksh** is a student-driven technology community across India built to bridge the gap between classroom theory and real-world practical engineering exposure.

---

## 🌳 What is Tech Vriksh?

**Tech Vriksh** treats student builders like a sapling being rooted properly: providing useful guidance, hands-on exposure, and a supportive network that empowers members to grow into engineers who give shade to others later.

Operating 100% free and student-driven, Tech Vriksh runs workshops, virtual bootcamps, and in-person meetups in partnership with top technology hubs across Delhi NCR and India.

### Key Highlights
* **Unpaid & Student-Driven**: Built by students, for students — zero admission fees or hidden costs.
* **19+ Core Team Members**: Active student leads across development, community management, content, and events.
* **Prestigious Venue Partners**: Sessions and meetups hosted at **OpsTree Global**, **ThoughtWorks**, and **Microsoft**.
* **Flagship Initiatives**:
  * **Ethereum Build Camp** (8-day virtual bootcamp co-partnered with Aya Community)
  * **Road to Devcon 8** (Offline meetups uniting Web3 and Ethereum builders)
  * **Ctrl + Future** (Hands-on workshop series covering Agentic Observability & AI)

---

## ⚡ Core Philosophy — From Seed to Shade

```text
    [ Seed ]  ──────►  [ Sapling ]  ──────►  [ Vriksh ]
Classroom Basics     Hands-on Exposure    Empowered Engineer
```

1. **Real Exposure**: Moving past syntax exercises to real-world codebases, deployment pipelines, and agentic workflows.
2. **Relevant Guidance**: Practical workshops taught by active practitioners from industry-leading tech companies.
3. **Rooted Growth**: Fostering an inclusive environment where every student builder gains the confidence to ship projects and mentor incoming peers.

---

## 🛠️ Website Features & Tech Stack

This repository houses the official **Tech Vriksh Website** built with cutting-edge web technology:

### Key Features
* **Brand Loading Screen**: Premium 4-second intro experience with preloaded local WebP logo, smooth 0%-100% animated percentage counter, and CSS exit transition.
* **3D Scroll Journey**: WebGL-powered spatial corridor created with **Three.js** and `@react-three/fiber` that glides smoothly behind page content as the user scrolls.
* **Optimized Team Showcase**: 3-column responsive grid featuring 19 team members with natural portrait framing (`object-[center_20%]`) and glowing hover cards.
* **Join Portal & Role Applications**: Open roles for WhatsApp Community Management, Social Media, and Video Editing with trial period onboarding details.

### Tech Stack
* **Framework**: [Next.js 16](https://nextjs.org/) (App Router + Turbopack)
* **Language**: [TypeScript](https://www.typescriptlang.org/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **3D & Graphics**: [Three.js](https://threejs.org/) & [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber)
* **Smooth Scrolling**: [Lenis Scroll](https://lenis.darkroom.engineering/)

---

## 📂 Directory Structure

```text
Tech-Vriksh/
├── public/
│   ├── brand/               # Brand logos and assets
│   ├── sample/              # Event photos & hackathon banners
│   └── tech-vriksh-logo.webp # Preloaded 15KB WebP logo
├── src/
│   ├── app/
│   │   ├── about/           # About page & team showcase
│   │   ├── events/          # Past & upcoming community events
│   │   ├── hackathons/      # Hackathon details & track pages
│   │   ├── join/            # Onboarding & open role applications
│   │   └── layout.tsx       # Root layout & BrandLoader
│   ├── components/
│   │   ├── 3d/              # Three.js Canvas, Atmosphere, LightGates
│   │   ├── ui/              # BrandLoader, Footer, HeroVisual
│   │   └── site-header.tsx  # Responsive navigation bar
│   └── lib/
│       └── journey/         # 3D camera flight path & station configs
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher

### Installation & Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/rokey6950-cell/Tech-Vriksh.git
   cd Tech-Vriksh
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the site.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🌐 Community Links

* **Community Join Form**: [Google Form Application](https://forms.gle/CCyMWwfZBeB7QFw)
* **Instagram**: [@techvrikshofficial](https://www.instagram.com/techvrikshofficial/)
* **LinkedIn**: [Tech Vriksh Page](https://www.linkedin.com/company/techvriksh/)

---

<p align="center">
  <b>Built with ❤️ by the Tech Vriksh Community</b>
</p>