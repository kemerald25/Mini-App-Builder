# Usage Guide

## Web Interface

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

3. Fill out the form:
   - Mini App Name
   - Description
   - Category (social, gaming, defi, utility)
   - Home URL
   - Features (add multiple)
   - Enable transaction support if needed
   - Enable agent integration if needed
   - Provide agent address if using agent integration

4. Click "Generate Mini App"

5. Download the JSON file containing all generated files

6. Extract files to a new Next.js project directory

## CLI Usage

1. Run the CLI:
   ```bash
   npm run generate
   ```

2. Follow the interactive prompts:
   - Enter Mini App name
   - Enter description
   - Select category
   - Enter home URL
   - Add features (one at a time, empty line to finish)
   - Answer yes/no for transaction support
   - Answer yes/no for agent integration
   - Provide agent address if needed

3. The CLI will generate all files in a new directory named after your Mini App

4. Navigate to the generated directory and follow the setup instructions

## Example: Simple Poll App

**Via Web:**
- Name: "Quick Poll"
- Description: "Create and share polls with friends"
- Category: Social
- Home URL: https://quickpoll.example.com
- Features: ["Create polls", "Share results", "Real-time voting"]
- Transaction: No
- Agent: No

**Via CLI:**
```bash
npm run generate
# Follow prompts with similar values
```

## Example: Transaction-Based NFT Marketplace

**Via Web:**
- Name: "Base NFT Market"
- Description: "Buy and sell NFTs on Base"
- Category: DeFi
- Home URL: https://basenft.example.com
- Features: ["Browse collection", "Purchase NFTs", "List for sale"]
- Transaction: Yes
- Agent: No

## Example: Agent-Integrated Game

**Via Web:**
- Name: "Trivia Master"
- Description: "Play trivia with your chat agent"
- Category: Gaming
- Home URL: https://trivia.example.com
- Features: ["Daily questions", "Leaderboard", "Agent hints"]
- Transaction: No
- Agent: Yes
- Agent Address: 0x5993B8F560E17E438310c76BCac1Af3E6DA2A58A

## After Generation

1. **Set up environment:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add your NEXT_PUBLIC_ONCHAINKIT_API_KEY
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run locally:**
   ```bash
   npm run dev
   ```

4. **Update manifest:**
   - Edit `public/.well-known/farcaster.json`
   - Update URLs to your production URLs
   - Add icons and images
   - Verify at [base.dev/preview](https://base.dev/preview)

5. **Deploy:**
   - Deploy to Vercel, Netlify, or any Next.js hosting
   - Set environment variables in your hosting platform
   - Update manifest URLs after deployment

