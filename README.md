# X Prophet Cup

World Cup-native prediction market on X Layer Mainnet.

X Prophet Cup is built for the X Cup Hackathon as a lightweight but real on-chain consumer product. It combines prediction markets, SocialFi tribe identity, streak progression, Hype mode, and Prophet NFTs into one serverless frontend experience designed to convert sports attention into on-chain participation.

The project is designed around a simple belief: sports attention should not stop at content consumption. It should be converted into on-chain participation, social identity, repeat interaction, and sustainable protocol activity.


## Live Status

- Live App: [https://x-prophet-cup-frontend.vercel.app](https://x-prophet-cup-frontend.vercel.app)
- Network: `X Layer Mainnet`
- Chain ID: `196`
- Mainnet Contract: `0xf9B84CE74CA2faAFF6752f3918beee992E9569CE`
- Contract Explorer: [OKX Explorer](https://www.okx.com/web3/explorer/xlayer/address/0xf9B84CE74CA2faAFF6752f3918beee992E9569CE)

## Why It Stands Out

X Prophet Cup is not a standard match betting page. It is designed around repeat identity, social amplification, and on-chain progression.

- `Prediction Market`: 3-way outcome market for World Cup matches
- `SocialFi`: every prediction is attached to one of 8 fixed tribes
- `NFT`: streak performance unlocks Prophet NFTs on-chain
- `Growth Loop`: predictions can be pushed to X as shareable social moments
- `Mainnet-Ready`: the contract is already deployed on X Layer Mainnet

## What Problem It Solves

Traditional prediction products are usually strong in short-term excitement but weak in identity, retention, and social propagation.

X Prophet Cup reframes prediction as an on-chain user journey:

- each prediction becomes a visible position
- each winning streak becomes status
- each tribe becomes a social affiliation
- each reward loop becomes a reason to return
- each result can be turned into a shareable moment on X

This makes the product more than a betting interface.  
It becomes a sports-native on-chain participation layer.

## Core Product Mechanics

### 1. Prophet Streak

Each correct prediction increases the user's streak. A higher streak increases the effective weight of the next prediction, capped at a defined multiplier, and creates status inside the product.

### 2. Fan Tribes as SocialFi Factions

The product includes 8 fixed tribes:

- Brazil
- Argentina
- France
- Germany
- Spain
- England
- Portugal
- USA

These tribes are not tied to the teams in a specific match. They act as long-term SocialFi factions that users can align with when placing predictions.

### 3. Shared Tribe Jackpot

Each standard prediction carries a base fee. Part of that fee is routed into the selected tribe's shared jackpot for that market. If users in the same tribe land the correct outcome, they split that pool by effective position size.

### 4. Hype Mode

Users can pay extra to enter Hype mode. This adds a stronger monetization and visibility layer while making predictions feel more aggressive and more socially shareable.

### 5. Prophet NFT

Users who hit the required streak threshold automatically unlock Prophet NFTs on-chain. These NFTs represent forecasting performance, rarity, and portable identity.

## Revenue Model

X Prophet Cup is designed as a real product rather than a pure demo.

### Base prediction fee

- Total: `6%`
- `3%` protocol revenue
- `2%` tribe jackpot
- `1%` growth incentives

### Hype surcharge

- Extra: `10%`
- `4%` Hype pool
- `4%` protocol revenue
- `2%` growth incentives

This creates a credible on-chain monetization path while preserving user-facing incentives and community competition.

## Mainnet Validation

The project has already completed live on-chain validation for the critical loop:

- contract deployment
- launch market seeding
- live prediction flow
- market resolution
- settlement
- streak updates
- Prophet NFT unlock path

Current seeded launch markets on mainnet:

- `marketId 0`
- `marketId 1`
- `marketId 2`

## Frontend Stack

- `Next.js 14`
- `TypeScript`
- `wagmi`
- `viem`
- `RainbowKit`
- `Tailwind CSS`
- `Vercel`

## Product Architecture

This repository contains the serverless frontend only.

- `/` is the public product experience
- `/admin` is the owner-operated management interface
- the app interacts directly with the X Layer Mainnet contract through wallet signatures

There is no traditional backend server in this deployment model.

## Local Development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Required environment variables:

```bash
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_X_PROPHET_CUP_ADDRESS=0xYourXLayerMainnetContract
```

## Deploy

This frontend is designed for Vercel deployment.

1. Push the repository to GitHub
2. Import the repository into Vercel
3. Set the two `NEXT_PUBLIC_*` environment variables
4. Deploy

## Why It Fits X Cup

X Prophet Cup maps directly to the core judging themes of X Cup:

- strong X Layer relevance through frequent low-friction on-chain interaction
- product differentiation through tribes, streaks, and Hype mode
- NFT progression tied to actual performance
- credible monetization rather than pure speculation
- lightweight scope with real launch feasibility

The goal is not just to present a hackathon prototype, but to show a realistic direction for a sports-native on-chain consumer product.
