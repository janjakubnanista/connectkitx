import { SupportedConnector } from "../types"
import Logos from '../../../assets/logos';
import { isCoinbaseWallet } from "../../../utils/isCoinbaseWallet";

export const coinbaseWalletConnector: SupportedConnector = {
  id: 'coinbaseWallet',
  name: 'Coinbase Wallet',
  shortName: 'Coinbase',
  logos: {
    default: <Logos.Coinbase />,
    mobile: <Logos.Coinbase background />,
    transparent: <Logos.Coinbase background={false} />,
    appIcon: <Logos.Coinbase background={false} />,
    connectorButton: <Logos.Coinbase background={true} />,
    //connectorButton: <Logos.CoinbaseImage />,
    qrCode: <Logos.Coinbase background={true} />,
  },
  logoBackground: 'var(--ck-brand-coinbaseWallet)',
  scannable: true,
  //defaultConnect: () => {},
  extensions: {
    chrome:
      'https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad',
  },
  appUrls: {
    download: 'https://connect.family.co/v0/download/coinbasewallet',
    website: 'https://www.coinbase.com/wallet/getting-started-extension',
    android: 'https://play.google.com/store/apps/details?id=org.toshi',
    ios:
      'https://apps.apple.com/app/coinbase-wallet-store-crypto/id1278383455',
  },
  extensionIsInstalled: isCoinbaseWallet,
}