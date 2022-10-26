import { injectedConnector } from './supportedConnectors/connectors/injectedConnector';
import { metaMaskConnector } from './supportedConnectors/connectors/metaMaskConnector';
import { walletConnectConnector } from './supportedConnectors/connectors/walletConnectConnector';
import { coinbaseWalletConnector } from './supportedConnectors/connectors/coinbaseWalletConnector';
import { SupportedConnector } from './supportedConnectors/types';

export const supportedConnectors: SupportedConnector[] = [
  injectedConnector,
  walletConnectConnector,
  metaMaskConnector,
  coinbaseWalletConnector,
];
