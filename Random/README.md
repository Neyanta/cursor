# SP Research Copilot

Internal tool for BDMs (Business Development Managers) to research businesses quickly.

## Features

- Single-page application with clean, simple UI
- Accepts business name, website URL, or Google Maps link as input
- Generates structured research summary with:
  1. Business Snapshot
  2. Quality & Reviews (AI generated)
  3. Distribution & Pricing Signals
  4. Outreach Pitch (email opener)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## TODO: Future Integrations

### API Integration
- [ ] Replace mock data with actual OpenAI API calls
- [ ] Add input validation for URLs and Google Maps links
- [ ] Implement web scraping for business websites
- [ ] Integrate Google Maps API for location data
- [ ] Add review aggregation from multiple sources (Yelp, Google Reviews, etc.)

### Features
- [ ] Add rate limiting to API routes
- [ ] Implement caching for repeated queries
- [ ] Add export functionality (PDF, CSV)
- [ ] Save research history
- [ ] Add user authentication

### Error Handling
- [ ] Improve error messages for API failures
- [ ] Add retry logic for failed API calls
- [ ] Add timeout handling

### Testing
- [ ] Add unit tests for API routes
- [ ] Add integration tests for UI components
- [ ] Add E2E tests for user flows

## Environment Variables

Create a `.env.local` file for production:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- React 18

