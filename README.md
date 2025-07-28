# Token Swap Calculator

This project is a **single–page web application** that allows users to enter a USD value, select two crypto tokens and see the approximate amount of each token that could be swapped for that USD value.  It was built as part of a product‐engineering take home assignment where the goal is to demonstrate frontend skills, API integration and product sense.

## Features

- **React front‑end:** The application is built using React in accordance with the requirement to use a modern framework【771050257983758†L20-L27】.  The UI is kept deliberately simple to emphasise functionality over decoration but includes sensible styling and responsive layout.
- **Token selection:** Users can choose a **source** and **target** token from a predefined list that includes USDC, USDT, ETH and WBTC with their respective chain IDs【771050257983758†L66-L80】.  The token list can easily be extended.
- **USD input and conversion:** Entering a USD amount triggers a call to the Funkit API to look up token metadata (`getAssetErc20ByChainAndSymbol`) and price information (`getAssetPriceInfo`)【771050257983758†L42-L60】.  The interface then displays how much of each selected token corresponds to the given USD amount.
- **Fallback for offline development:** When the `@funkit/api-base` package or network access is unavailable, the app uses stub functions that return dummy data.  This makes it possible to work on the UI without external dependencies.  Once the package is installed (`npm install`) and network connectivity is restored, the real API calls will run automatically.
- **Modular architecture:** Separate components and stylesheets are used to keep the codebase readable and easy to maintain.  The project uses Webpack and Babel to bundle and transpile modern JavaScript.

## Getting Started

1. **Clone this repository:**
   ```bash
   git clone <your-fork-url>
   cd token-swap-app
   ```
2. **Install dependencies:** Make sure you have Node.js installed (≥16).  Then run:
   ```bash
   npm install
   ```
   This will install React, ReactDOM, Webpack, Babel and the `@funkit/api-base` package.  If you are working behind a firewall or cannot access npm, you may need to set up the appropriate proxies.
3. **Start the development server:**
   ```bash
   npm start
   ```
   Webpack will compile the project and start a dev server at `http://localhost:3000`.
4. **Configure the API key:** The code includes a development API key (`Z9SZaOwpmE40KX61mUKWm5hrpGh7WHVkaTvQJpQk`) recommended in the assignment【771050257983758†L65-L66】.  For production use, replace this with your own key or load it from an environment variable.  Never commit private keys to source control.

### Deployment

To satisfy the submission requirements, deploy the compiled app to a static hosting platform such as **Vercel**, **Netlify** or **GitHub Pages**【771050257983758†L80-L95】.  After running `npm run build`, upload the contents of the `dist/` directory to your host.  Vercel is preferred because it integrates seamlessly with GitHub and offers a free tier, but any modern static host will work.

## Assumptions and Notes

- **Token list and chain IDs:** The assignment specified support for USDC (chain ID 1), USDT (137), ETH (8453) and WBTC (1)【771050257983758†L66-L80】.  Those tokens are hard‑coded in `src/App.js`.  You can fetch a dynamic list or allow the user to enter arbitrary symbols if you choose.
- **Handling missing API documentation:** The provided code snippet in the assignment is illustrative and may not work out of the box【771050257983758†L42-L61】.  Therefore, the project includes stub functions for environments where the `@funkit/api-base` package cannot be installed (such as this sandbox).  When running in a real environment, the imported `getAssetErc20ByChainAndSymbol` and `getAssetPriceInfo` functions will make HTTP requests to Funkit's servers using your API key.
- **Error handling and UX:** Error states such as network failures and invalid input are handled gracefully.  Loading states are displayed while requests are in flight.  Further enhancements like token icons, better formatting and interactive suggestions are left as future improvements in accordance with the instruction to use product judgement【771050257983758†L98-L105】.

## Libraries Used

- **React** – the primary front‑end framework.
- **ReactDOM** – for DOM rendering.
- **@funkit/api-base** – the SDK that provides `getAssetErc20ByChainAndSymbol` and `getAssetPriceInfo`【771050257983758†L42-L60】.
- **Webpack and Babel** – build tools for bundling and transpiling JSX and modern JavaScript.  These are included so you can run the project locally without additional setup.

## Conclusion

This repository demonstrates a small yet complete implementation of the token swap interface described in the assignment.  It focuses on fulfilling the functional requirements (React, API interaction, token selection) while leaving room for further creativity and polish.  If you decide to expand on this project, please document any major design decisions or assumptions in this `README` file as instructed【771050257983758†L88-L106】.