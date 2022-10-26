import { SupportedConnector } from "../types"
import Logos from '../../../assets/logos';
import { isMetaMask } from "../../../utils/isMetaMask";

export const metaMaskConnector: SupportedConnector = {
  id: 'metaMask',
  name: 'MetaMask',
  logos: {
    default: <Logos.MetaMask background />,
    mobile: <Logos.MetaMask background />,
    transparent: (
      <div
        style={{
          transform: 'scale(0.86)',
          position: 'relative',
          width: '100%',
        }}
      >
        <Logos.MetaMask />
      </div>
    ),
    connectorButton: (
      <div
        style={{
          transform: 'scale(1.1)',
        }}
      >
        <Logos.MetaMask />
      </div>
    ),
  },
  logoBackground:
    'linear-gradient(0deg, var(--ck-brand-metamask-12), var(--ck-brand-metamask-11))',
  scannable: false,
  // defaultConnect:  () => {},
  extensions: {
    chrome:
      'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
    firefox:
      'https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/',
    brave:
      'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
    edge:
      'https://microsoftedge.microsoft.com/addons/detail/metamask/ejbalbakoplchlghecdalmeeeajnimhm',
  },
  appUrls: {
    download: 'https://connect.family.co/v0/download/metamask',
    website: 'https://metamask.io/download/',
    android: 'https://play.google.com/store/apps/details?id=io.metamask',
    ios: 'https://apps.apple.com/app/metamask/id1438144202',
  },
  extensionIsInstalled: isMetaMask,
}