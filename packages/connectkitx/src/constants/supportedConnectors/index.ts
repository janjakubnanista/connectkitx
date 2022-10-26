import { injectedConnector } from './connectors/injectedConnector';
import { metaMaskConnector } from './connectors/metaMaskConnector';
import { walletConnectConnector } from './connectors/walletConnectConnector';
import { coinbaseWalletConnector } from './connectors/coinbaseWalletConnector';
import { SupportedConnector } from './types';

const supportedConnectors: SupportedConnector[] = [
  injectedConnector,
  walletConnectConnector,
  metaMaskConnector,
  coinbaseWalletConnector,
];

export default supportedConnectors;
