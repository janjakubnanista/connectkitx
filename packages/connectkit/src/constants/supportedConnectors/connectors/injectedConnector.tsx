import { SupportedConnector } from "../types"
import Logos from '../../../assets/logos';

export const injectedConnector: SupportedConnector = {
  id: 'injected',
  name: 'Browser Wallet',
  shortName: 'Browser',
  logos: {
    default: <Logos.Injected />,
    mobile: (
      <div
        style={{
          padding: 5,
          background: 'var(--ck-body-background-tertiary)',
          borderRadius: '27%',
          boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.02)',
        }}
      >
        <div
          style={{
            transform: 'scale(0.75)',
            position: 'relative',
            width: '100%',
          }}
        >
          <Logos.Injected />
        </div>
      </div>
    ),
    transparent: <Logos.Injected />,
  },
  scannable: false,
  extensionIsInstalled: () => {
    if (typeof window === 'undefined') return false;

    return Boolean(window.ethereum);
  },
}