import React, { useState, useEffect } from 'react';

// Attempt to import the Funkit API.  If the package isn't available
// (for example when running offline or without installing the dependency),
// these imports will throw.  Consumers of this repository should run
// `npm install` to install the package before using the app.
let getAssetErc20ByChainAndSymbol;
let getAssetPriceInfo;
try {
  // eslint-disable-next-line import/no-extraneous-dependencies
  // eslint-disable-next-line global-require
  const api = require('@funkit/api-base');
  getAssetErc20ByChainAndSymbol = api.getAssetErc20ByChainAndSymbol;
  getAssetPriceInfo = api.getAssetPriceInfo;
} catch (e) {
  // Fallback stubs that log a warning.  These functions return
  // dummy values so that the UI continues to function even when
  // the Funkit package is unavailable.  Replace these stubs by
  // installing the package with `npm install` and supplying a valid API key.
  console.warn('Funkit API not found. Falling back to dummy functions.');
  getAssetErc20ByChainAndSymbol = async ({ chainId, symbol }) => {
    // Return a dummy token address.  In a real application
    // this call returns metadata including decimals and token address.
    return {
      data: {
        tokenAddress: `${symbol.toLowerCase()}-token-address-${chainId}`,
        symbol,
        chainId,
      },
    };
  };
  getAssetPriceInfo = async ({ chainId, assetTokenAddress }) => {
    // Generate a pseudo-random price for demonstration purposes.
    // Do NOT rely on this for real-world calculations.
    const pseudoPrice = (chainId.toString().split('').reduce((a, b) => a + Number(b), 0) + assetTokenAddress.length) / 10;
    return {
      data: {
        priceUSD: pseudoPrice,
      },
    };
  };
}

// Development API key provided in the assignment.  In production
// you should store API keys in environment variables (e.g. .env file)
// and never commit them to source control.
const API_KEY = process.env.REACT_APP_FUNKIT_API_KEY ||'Z9SZaOwpmE40KX61mUKWm5hrpGh7WHVkaTvQJpQk'
// List of tokens supported by the sample app.  You can add more tokens
// here or fetch a token list dynamically.  Each entry must define
// a symbol and the chainId on which the token resides.
const TOKENS = [
  { symbol: 'USDC', chainId: '1' },
  { symbol: 'USDT', chainId: '137' },
  { symbol: 'ETH', chainId: '8453' },
  { symbol: 'WBTC', chainId: '1' },
];

/**
 * Main application component.  This component renders a simple interface for
 * entering a USD amount, selecting a source and target token, and displaying
 * approximate conversions into those tokens.  It demonstrates how to call
 * the Funkit API to retrieve token metadata and price information.
 */
function App() {
  const [baseToken, setBaseToken] = useState(TOKENS[0]);
  const [targetToken, setTargetToken] = useState(TOKENS[1]);
  const [usdAmount, setUsdAmount] = useState('');
  const [baseAmount, setBaseAmount] = useState(null);
  const [targetAmount, setTargetAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Whenever the selected tokens or USD amount change, fetch new price data.
  useEffect(() => {
    async function fetchPrices() {
      // Ignore empty amounts or non‑numeric input.
      if (!usdAmount || isNaN(Number(usdAmount))) {
        setBaseAmount(null);
        setTargetAmount(null);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        // Get metadata for the selected tokens.  The API returns
        // information including the token address required by
        // getAssetPriceInfo.  If the token resides on a non‑EVM chain
        // or is not supported, the call may throw an error.
        const baseInfo = await getAssetErc20ByChainAndSymbol({
          chainId: baseToken.chainId,
          symbol: baseToken.symbol,
          apiKey: API_KEY,
        });
        const targetInfo = await getAssetErc20ByChainAndSymbol({
          chainId: targetToken.chainId,
          symbol: targetToken.symbol,
          apiKey: API_KEY,
        });
        // Extract token addresses from the API response.  Adjust
        // the property names to match the actual API response.  Here we
        // assume the structure { data: { tokenAddress: string } }.
        const baseAddress = baseInfo.data.tokenAddress;
        const targetAddress = targetInfo.data.tokenAddress;

        // Fetch USD price for each token.  The API returns an object
        // containing at least a priceUSD field.  Adjust property names
        // if needed based on the real API response.
        const basePriceResp = await getAssetPriceInfo({
          chainId: baseToken.chainId,
          assetTokenAddress: baseAddress,
          apiKey: API_KEY,
        });
        const targetPriceResp = await getAssetPriceInfo({
          chainId: targetToken.chainId,
          assetTokenAddress: targetAddress,
          apiKey: API_KEY,
        });
        const basePriceUSD = basePriceResp.data.priceUSD;
        const targetPriceUSD = targetPriceResp.data.priceUSD;
        // Convert the USD amount to token amounts.  Guard against
        // division by zero in the unlikely event of a zero price.
        const usd = Number(usdAmount);
        const baseAmt = basePriceUSD ? usd / basePriceUSD : 0;
        const targetAmt = targetPriceUSD ? usd / targetPriceUSD : 0;
        setBaseAmount(baseAmt);
        setTargetAmount(targetAmt);
      } catch (e) {
        // In practice you may inspect the error object and display
        // specific messages.  Here we fall back to a generic message.
        console.error(e);
        setError('Failed to fetch token information. Please ensure the API key is valid and your network connection is available.');
        setBaseAmount(null);
        setTargetAmount(null);
      } finally {
        setLoading(false);
      }
    }
    fetchPrices();
  }, [baseToken, targetToken, usdAmount]);

  return (
    <div className="app">
      <h1 className="title">Token Swap Calculator</h1>
      <div className="row">
        <label htmlFor="usd-input">USD Amount</label>
        <input
          id="usd-input"
          type="number"
          value={usdAmount}
          onChange={(e) => setUsdAmount(e.target.value)}
          placeholder="Enter amount in USD"
        />
      </div>
      <div className="row">
        <label htmlFor="base-select">Source Token</label>
        <select
          id="base-select"
          value={baseToken.symbol}
          onChange={(e) => {
            const token = TOKENS.find((t) => t.symbol === e.target.value);
            setBaseToken(token);
          }}
        >
          {TOKENS.map((token) => (
            <option key={token.symbol} value={token.symbol}>
              {token.symbol}
            </option>
          ))}
        </select>
      </div>
      <div className="row">
        <label htmlFor="target-select">Target Token</label>
        <select
          id="target-select"
          value={targetToken.symbol}
          onChange={(e) => {
            const token = TOKENS.find((t) => t.symbol === e.target.value);
            setTargetToken(token);
          }}
        >
          {TOKENS.map((token) => (
            <option key={token.symbol} value={token.symbol}>
              {token.symbol}
            </option>
          ))}
        </select>
      </div>
      {/* Display loading, error, or results */}
      {loading && <p className="status">Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && baseAmount !== null && targetAmount !== null && (
        <div className="results">
          <p>
            {usdAmount} USD ≈ {baseAmount.toFixed(6)} {baseToken.symbol}
          </p>
          <p>
            {usdAmount} USD ≈ {targetAmount.toFixed(6)} {targetToken.symbol}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;