# Getting Started

![Build status](https://github.com/channainfo/trackr/actions/workflows/test_and_build.yml/badge.svg?branch= "Build status")

## Introduction

**Trailer** is an open-source, intelligent trading and analytics platform for cryptocurrency enthusiasts and developers. Designed to empower users with professional-grade tools and insights, **Trailer** offers two main components:

### Crypto Academy

- A comprehensive learning platform for understanding the crypto space, including market analysis, risk management, and trading strategies.
- Hands-on tutorials and exercises to help users learn and apply concepts in real-time with quizzes and learn to earn models.
- A resource center for definitions, explanations, and answers to common questions. Comprehensive crypto glossary with simple explanations of terms like DeFi, NFTs, liquidity, staking, and more. Frequently Asked Questions (FAQ) addressing common beginner concerns and misconceptions.
- Integration of educational content, including articles, videos, and webinars, to provide users with the latest insights and knowledge. Weekly summaries with digestible insights, educational snippets, and highlights tailored for newcomers.
- Community and Support: A platform for users to connect, share knowledge, and support one another. A forum for discussions, Q&A sessions, and peer-to-peer learning.
- Personalized Learning Pathways: Tailored learning experiences based on users' goals, interests, and learning styles. Adaptive learning paths that adjust based on user progress and feedback.
- Crypto Playground: A sandbox environment for experimenting with different trading strategies and tools.
- Integration with Core Trading Platform: Seamless integration with core trading features, including risk management, portfolio tracking, and order execution.

### Core Trading Platform

- 🛠️ **Smart Portfolio Tracker**: Optimize investments with tools that calculate risk-adjusted metrics and diversification strategies.
- ⏳ **Real-Time Insights**: Fetch live price feeds, on-chain data, and social sentiment for comprehensive market analysis.
- ⏳ **Predictive Analytics**: Use advanced machine learning models like LSTM and Transformers to predict trends and prices.
- ⏳ **Customizable Trading Bots**: Modular bots automate trades with strategies like arbitrage, trend-following, and risk management.
- ⏳ **Blockchain Integration**: Seamlessly track on-chain activity like staking, whale movements, and token transfers.
- ⏳ **Community-Driven Sentiment Analysis**: Leverage social trends and engagement to make informed decisions.

## License
The project is licensed under the **MIT License**, allowing everyone to freely use, modify, and share it as long as proper credit is given. Think of it like lending your Trailer full of tools to friends—they can build on it or take it to their next adventure!



## Development

### Fix npm package

Module '"drizzle-kit"' has no exported member 'defineConfig'.

```sh
npm list drizzle-kit
npm uninstall drizzle-kit

npm install drizzle-kit@latest

```

### Database

#### Applying change

You can directly apply changes to your database using the `drizzle-kit push` command. This is a convenient method for quickly testing new schema designs or modifications in a local development environment, allowing for rapid iterations without the need to manage migration files.

```sh
npx drizzle-kit push
```

### Run test

Prepare the test database

```sh
npm run db:push:test
```

and run the test

```sh
npm test
```
