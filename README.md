# Larimide AI Skincare Assistant 🧪✨

> A next-generation, interactive clinical beauty concierge tailored for **Larimide** (https://larimide.com/).

This project transforms a static "Clinical Minimalist" design landing page into an interactive, AI-powered assistant demo. The AI acts as a professional cosmetic dermatologist, recommending official **Larimide** skincare treatments based on the user's specific skin concerns (e.g., oily skin, wrinkles, hydration, dark spots).

Built with **Astro v7**, **Tailwind CSS v4**, and **OpenAI SDK**, fully optimized and ready to deploy on **Vercel** as a Serverless API and static frontend.

---

## Key Features 🚀

- **AI-Powered Diagnostics:** Interactive chatbot in the Hero section that analyzes skin concerns and recommends custom routines.
- **Exclusive Knowledge Base:** The AI is strictly trained (via System Prompt) to recommend *only* official Larimide products (Tinellin, Retibak, Maxinadin, Oxystem, etc.).
- **Strict Brand Design:** Adheres pixel-to-pixel to the "Clinical Minimalist" guidelines: flat stacks, 1px high-contrast borders, custom color scheme (`#bc0100` secondary accent), and Manrope / IBM Plex Sans typography.
- **Secure Architecture:** OpenAI API calls are executed on the server side (`src/pages/api/chat.ts`) to prevent exposing API keys in the browser.
- **Vercel Adapter Integration:** Automatic compilation of API routes into Serverless Functions.
- **E2E Testing:** Robust, responsive, and offline-mocked end-to-end tests built using **Playwright**.

---

## Tech Stack 🛠️

- **Framework:** [Astro v7](https://astro.build/)
- **Styles:** [Tailwind CSS v4](https://tailwindcss.com/) (using the new CSS-first configuration `@theme`)
- **AI Integration:** [OpenAI API](https://openai.com/) (`gpt-5.4-mini` / `gpt-4o-mini`)
- **Hosting:** [Vercel](https://vercel.com/) (Serverless Adapter)
- **Testing:** [Playwright](https://playwright.dev/)

---

## Local Setup & Installation 💻

1. **Clone the repository:**
   ```bash
   git clone https://github.com/moisesvalero/larimide-ai-assistant.git
   cd larimide-ai-assistant
   ```

2. **Install dependencies:**
   Make sure you are using **pnpm**:
   ```bash
   pnpm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory (you can copy `.env.example`):
   ```bash
   cp .env.example .env
   ```
   Open `.env` and enter your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_actual_openai_api_key
   OPENAI_MODEL=gpt-4o-mini # Or your custom/provided model string
   ```

4. **Run in Development Mode:**
   ```bash
   pnpm run dev
   ```
   Open your browser at [http://localhost:4321](http://localhost:4321).

---

## Running Tests 🧪

We use Playwright to validate responsiveness, accessibility (a11y), and AI interactions. To run the test suite:

```bash
pnpm exec playwright test
```

All E2E tests are configured to use stable network mocks, meaning they are fast, cost-efficient, and don't consume OpenAI tokens during testing.

---

## Deploy to Vercel ☁️

1. Install the Vercel CLI if you haven't already:
   ```bash
   npm i -g vercel
   ```
2. Deploy the project (Vercel will auto-detect Astro):
   ```bash
   vercel
   ```
3. Set the Environment Variables (`OPENAI_API_KEY` and `OPENAI_MODEL`) in the Vercel Dashboard.
4. Deploy to production:
   ```bash
   vercel --prod
   ```

---

## Project Structure 📁

```text
├── src/
│   ├── assets/        # Media assets
│   ├── pages/
│   │   ├── api/
│   │   │   └── chat.ts  # OpenAI Chat Serverless API Route
│   │   └── index.astro  # Main Landing Page Layout & Chat UI
│   └── styles/
│       └── global.css   # Tailwind v4 styles & theme configuration
├── public/
│   └── logo.png       # Extracted and optimized logo
├── tests/
│   └── chat.spec.ts   # Playwright E2E tests (Desktop & Mobile)
├── astro.config.mjs   # Astro configuration (Vercel Serverless enabled)
├── playwright.config.ts # Playwright responsive test configuration
└── pnpm-workspace.yaml # Pnpm build & release age configurations
```

---

## License 📄

This project is open-source and available under the [MIT License](LICENSE).
For demonstration purposes for Larimide.
