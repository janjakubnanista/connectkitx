import { SupportedConnector } from "../types"
import Logos from '../../../assets/logos';

export const magicConnectConnector: SupportedConnector = {
  id: 'magicConnect',
  name: 'Magic Connect',
  shortName: 'Magic',
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
    qrCode: <Logos.WalletConnect background={true} />,
  },
  logoBackground: 'var(--ck-brand-magicConnect)',
  scannable: false,
  extensionIsInstalled: () => true
}