import { injectedConnector } from './connectors/injectedConnector';
import { metaMaskConnector } from './connectors/metaMaskConnector';
import { walletConnectConnector } from './connectors/walletConnectConnector';
import { coinbaseWalletConnector } from './connectors/coinbaseWalletConnector';
import { SupportedConnector } from './types';
import { magicConnector } from './connectors/magicConnector';

const supportedConnectors: SupportedConnector[] = [
  injectedConnector,
  walletConnectConnector,
  metaMaskConnector,
  coinbaseWalletConnector,
  magicConnector,
];

export default supportedConnectors;
