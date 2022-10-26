import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy';

import './index.css';
import App from './App';

import { WagmiConfig, createClient, chain, configureChains } from 'wagmi';
import { ConnectKitProvider, getDefaultClient } from 'connectkitx';
import { MagicConnectConnector } from './MagicConnectConnector';

const { chains, provider } = configureChains(
  [chain.goerli],
  [alchemyProvider({ apiKey: 'FfoyYmrqZL7L44xBs_In_83snc1bT1Ue' })]
);

const client = createClient({
  autoConnect: true,
  provider,
  connectors: [
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({ chains, options: {} }),
  ],
});

const clientx = createClient(
  getDefaultClient({
    appName: 'ConnectKit CRA demo',
    //infuraId: process.env.REACT_APP_INFURA_ID,
    //alchemyId:  process.env.REACT_APP_ALCHEMY_ID,
    chains: [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
  })
);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <WagmiConfig client={client}>
      <ConnectKitProvider theme="auto">
        <App />
      </ConnectKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
