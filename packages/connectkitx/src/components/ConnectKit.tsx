import React, {
  createElement,
  useEffect,
  useState,
} from 'react';
import { Buffer } from 'buffer';
import type { ConnectKitOptions, ConnectKitProviderProps, CustomTheme, Languages, Mode, Theme, Error } from '../types';

import defaultTheme from '../styles/defaultTheme';

import ConnectKitModal from './ConnectModal';
import { ThemeProvider } from 'styled-components';
import { useThemeFont } from '../hooks/useGoogleFont';
import { useAccount } from 'wagmi';
import { routes } from './constants';
import { useConnectKitContext } from '../context/useConnectKitContext';
import { Context } from '../context/Context';

export const ConnectKitProvider: React.FC<ConnectKitProviderProps> = ({
  children,
  theme = 'auto',
  mode = 'auto',
  customTheme,
  options,
}) => {
  // Default config options
  const defaultOptions: ConnectKitOptions = {
    language: 'en',
    hideTooltips: false,
    hideQuestionMarkCTA: false,
    hideNoWalletCTA: false,
    avoidLayoutShift: true,
    embedGoogleFonts: false,
    truncateLongENSAddress: true,
    walletConnectName: 'Other Wallets',
    reducedMotion: false,
    disclaimer: null,
    bufferPolyfill: true,
  };

  const opts: ConnectKitOptions = Object.assign({}, defaultOptions, options);

  if (typeof window !== 'undefined') {
    // Buffer Polyfill, needed for bundlers that don't provide Node polyfills (e.g CRA, Vite, etc.)
    if (opts.bufferPolyfill) window.Buffer = window.Buffer ?? Buffer;

    // Some bundlers may need `global` and `process.env` polyfills as well
    // Not implemented here to avoid unexpected behaviors, but leaving example here for future reference
    /*
     * window.global = window.global ?? window;
     * window.process = window.process ?? { env: {} };
     */
  }

  const [ckTheme, setTheme] = useState<Theme>(theme);
  const [ckMode, setMode] = useState<Mode>(mode);
  const [ckCustomTheme, setCustomTheme] = useState<CustomTheme | undefined>(
    customTheme ?? {}
  );
  const [ckLang, setLang] = useState<Languages>('en');
  const [open, setOpen] = useState<boolean>(false);
  const [connector, setConnector] = useState<string>('');
  const [route, setRoute] = useState<string>(routes.CONNECTORS);
  const [errorMessage, setErrorMessage] = useState<Error>('');

  // Include Google Font that is needed for a themes
  if (opts.embedGoogleFonts) useThemeFont(theme);

  // Other Configuration
  useEffect(() => setTheme(theme), [theme]);
  useEffect(() => setLang(opts.language || 'en'), [opts.language]);
  useEffect(() => setErrorMessage(null), [route, open]);

  const value = {
    theme: ckTheme,
    setTheme,
    mode: ckMode,
    setMode,
    customTheme,
    setCustomTheme,
    lang: ckLang,
    setLang,
    open,
    setOpen,
    route,
    setRoute,
    connector,
    setConnector,

    // Other configuration
    options: opts,
    errorMessage,
    debug: (message: string | React.ReactNode | null, code?: any) => {
      setErrorMessage(message);

      console.log('---------CONNECTKIT DEBUG---------');
      console.log(message);
      if (code) console.table(code);
      console.log('---------/CONNECTKIT DEBUG---------');
    },
  };

  return createElement(
    Context.Provider,
    { value },
    <>
      <ThemeProvider theme={defaultTheme}>
        {children}
        <ConnectKitModal
          lang={ckLang}
          theme={ckTheme}
          mode={mode}
          customTheme={ckCustomTheme}
        />
      </ThemeProvider>
    </>
  );
};

// Experimenal—can change later so only surface in API reference
export const useModal = () => {
  const context = useConnectKitContext();
  const { isConnected } = useAccount();
  return {
    open: context.open,
    setOpen: (show: boolean) => {
      if (show) {
        context.setRoute(isConnected ? routes.PROFILE : routes.CONNECTORS);
      }
      context.setOpen(show);
    },
  };
};
