import { SupportedConnector } from "../types"
import Logos from '../../../assets/logos';

export const walletConnectConnector: SupportedConnector = {
  id: 'walletConnect',
  name: 'Other Wallets',
  shortName: 'Other',
  logos: {
    default: <Logos.WalletConnect />,
    mobile: (
      <div
        style={{
          padding: 5,
          background: 'var(--ck-body-background-secondary)',
          borderRadius: '21%',
          boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.02)',
        }}
      >
        <Logos.OtherWallets />
      </div>
    ),
    transparent: <Logos.WalletConnect background={false} />,
    connectorButton: <Logos.OtherWallets />,
  },
  logoBackground: 'var(--ck-brand-walletConnect)',
  scannable: true,
  defaultConnect: () => {},
  extensionIsInstalled: () => true,
}