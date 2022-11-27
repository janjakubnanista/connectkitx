import Logos from '../../../assets/logos';
import { SupportedConnector } from "../types";

export const magicConnector: SupportedConnector = {
  id: 'magic',
  name: 'Email & socials',
  logos: {
    default: <Logos.MagicLink />,
    mobile: (
      <div
        style={{
          padding: 5,
          background: 'var(--ck-body-background-secondary)',
          borderRadius: '21%',
          boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.02)',
        }}
      >
        <Logos.MagicLink />
      </div>
    ),
    transparent: <Logos.MagicLink background={false} />,
    connectorButton: <Logos.MagicLink />,
  },
  logoBackground: 'var(--ck-brand-magicLink)',
  scannable: false,
  extensionIsInstalled: () => true
}