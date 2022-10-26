import type { ReactNode } from 'react';

export interface SupportedConnectorExtensions {
  brave?: string;
  chrome?: string;
  edge?: string;
  firefox?: string;
}

export interface SupportedConnectorUrls {
  android?: string;
  ios?: string;
  download?: string;
  website?: string;
  safari?: string;
  firefox?: string;
}

export interface SupportedConnectorLogos {
  default: ReactNode;
  transparent?: ReactNode;
  connectorButton?: ReactNode;
  qrCode?: ReactNode;
  appIcon?: ReactNode;
  mobile?: ReactNode;
}

export interface SupportedConnector {
  id: string;
  name?: string;
  shortName?: string;
  logos: SupportedConnectorLogos;
  logoBackground?: string;
  scannable?: boolean;
  extensions?: SupportedConnectorExtensions;
  appUrls?: SupportedConnectorUrls;
  extensionIsInstalled?: () => unknown;
  defaultConnect?: () => unknown;
}
