import React, { useState, useEffect } from 'react';

let getAssetErc20ByChainAndSymbol;
let getAssetPriceInfo;
try {
  const api = require('@funkit/api-base');
  // Uncomment and configure the next line if the library supports setting a base URL for proxy:
  // api.configure({ baseURL: '/api' });

  getAssetErc20ByChainAndSymbol = api.getAssetErc20ByChainAndSymbol;
  getAssetPriceInfo = api.getAssetPriceInfo;
} catch (e) {
  console.warn('Funkit API not found. Falling back to dummy functions.');
  getAssetErc20ByChainAndSymbol = async ({ chainId, symbol }) => ({
    data: {
      tokenAddress: `${symbol.toLowerCase()}-token-address-${chainId}`,
      symbol,
      chainId,
    },
  });
  getAssetPriceInfo = async ({ chainId, assetTokenAddress }) => {
    const pseudoPrice = (chainId.toString().split('').reduce((a, b) => a + Number(b), 0) + assetTokenAddress.length) / 10;
    return {
      data: {
        priceUSD: pseudoPrice,
      },
    };
  };
}

const API_KEY = process.env.REACT_APP_FUNKIT_API_KEY;

const TOKENS = [
  { symbol: 'USDC', chainId: '1' },
  { symbol: 'USDT', chainId: '137' },
  { symbol: 'ETH', chainId: '8453' },
  { symbol: 'WBTC', chainId: '1' },
];

function App() {
  const [baseToken, setBaseToken] = useState(TOKENS[0]);
  const [targetToken, setTargetToken] = useState(TOKENS[1]);
  const [usdAmount, setUsdAmount] = useState('');
  const [baseAmount, setBaseAmount] = useState(null);
  const [targetAmount, setTargetAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPrices() {
      if (!usdAmount || isNaN(Number(usdAmount))) {
        setBaseAmount(null);
        setTargetAmount(null);
        return;
      }
      setLoading(true);
      setError(null);
      try {
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

        const baseAddress = baseInfo?.address || baseInfo?.data?.tokenAddress || baseInfo?.tokenAddress;
        const targetAddress = targetInfo?.address || targetInfo?.data?.tokenAddress || targetInfo?.tokenAddress;

        if (!baseAddress || !targetAddress) {
          throw new Error('Token address not found in API response. Check the response structure.');
        }

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

        const basePriceUSD = basePriceResp?.data?.priceUSD || 0;
        const targetPriceUSD = targetPriceResp?.data?.priceUSD || 0;

        const usd = Number(usdAmount);
        const baseAmt = basePriceUSD ? usd / basePriceUSD : 0;
        const targetAmt = targetPriceUSD ? usd / targetPriceUSD : 0;
        setBaseAmount(baseAmt);
        setTargetAmount(targetAmt);
      } catch (e) {
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
            <option key={`${token.symbol}-${token.chainId}`} value={token.symbol}>
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
            <option key={`${token.symbol}-${token.chainId}`} value={token.symbol}>
              {token.symbol}
            </option>
          ))}
        </select>
      </div>
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
