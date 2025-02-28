import { Chain, Connector, chain, configureChains } from 'wagmi';

import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';

import { alchemyProvider } from 'wagmi/providers/alchemy';
import { infuraProvider } from 'wagmi/providers/infura';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';

let globalAppName: string;
export const getAppName = () => globalAppName;

type Provider = any;

const defaultChains = [
  chain.mainnet,
  chain.polygon,
  chain.optimism,
  chain.arbitrum,
];

type DefaultConnectorsProps = {
  chains?: Chain[];
  appName: string;
};
type DefaultClientProps = {
  appName: string;
  autoConnect?: boolean;
  alchemyId?: string;
  infuraId?: string;
  chains?: Chain[];
  connectors?: any;
  provider?: any;
};
type ConnectKitClientProps = {
  autoConnect?: boolean;
  connectors?: Connector[];
  provider: Provider;
  webSocketProvider?: any;
};
const getDefaultConnectors = ({ chains, appName }: DefaultConnectorsProps) => {
  return [
    new MetaMaskConnector({
      chains,
      options: {
        shimDisconnect: true,
        shimChainChangedDisconnect: false,
        UNSTABLE_shimOnConnectSelectAccount: true,
      },
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName,
        headlessMode: true,
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: false,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        shimDisconnect: true,
        name: (detectedName) =>
          `Injected (${
            typeof detectedName === 'string'
              ? detectedName
              : detectedName.join(', ')
          })`,
      },
    }),
  ];
};
const defaultClient = ({
  autoConnect = true,
  appName = 'ConnectKit',
  chains = defaultChains,
  alchemyId,
  infuraId,
  connectors,
  provider,
}: DefaultClientProps) => {
  globalAppName = appName;
  const providers = [];

  //if (!infuraId && !alchemyId) alchemyId = 'ourDefaultAlchemyId';

  if (alchemyId) providers.push(alchemyProvider({ apiKey: alchemyId }));
  if (infuraId) providers.push(infuraProvider({ apiKey: infuraId }));
  providers.push(
    jsonRpcProvider({
      rpc: (c) => {
        if (c.id !== chain.mainnet.id) return null;
        return { http: c.rpcUrls.default };
      },
    })
  );
  providers.push(publicProvider());

  const {
    provider: configuredProvider,
    chains: configuredChains,
    webSocketProvider,
  } = configureChains(chains, providers);

  const connectKitClient: ConnectKitClientProps = {
    autoConnect,
    connectors:
      connectors ?? getDefaultConnectors({ chains: configuredChains, appName }),
    provider: provider ?? configuredProvider,
    //webSocketProvider,
  };

  return { ...connectKitClient };
};

export default defaultClient;
