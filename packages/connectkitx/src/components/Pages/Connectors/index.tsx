import React, { useEffect } from 'react';
import supportedConnectors from '../../../constants/supportedConnectors';
import localizations from '../../../constants/localizations';

import { useConnect } from '../../../hooks/useConnect';

import {
  PageContent,
  ModalH1,
  ModalBody,
  ModalContent,
  ModalHeadingBlock,
  Disclaimer,
} from '../../Common/Modal/styles';
import WalletIcon from '../../../assets/wallet';

import {
  LearnMoreContainer,
  LearnMoreButton,
  ConnectorsContainer,
  ConnectorButton,
  ConnectorLabel,
  ConnectorIcon,
  MobileConnectorsContainer,
  MobileConnectorButton,
  MobileConnectorLabel,
  MobileConnectorIcon,
  InfoBox,
  InfoBoxButtons,
} from './styles';

import { isMobile, isAndroid } from '../../../utils';

import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';

import Button from '../../Common/Button';
import useDefaultWallets from '../../../wallets/useDefaultWallets';
import { routes } from '../../constants';
import { useConnectKitContext } from '../../../context/useConnectKitContext';
import { isMetaMask } from '../../../utils/isMetaMask';
import { isCoinbaseWallet } from '../../../utils/isCoinbaseWallet';

const Wallets: React.FC = () => {
  const context = useConnectKitContext();
  const copy = localizations[context.lang].connectorsScreen;
  const mobile = isMobile();

  const { connectAsync, connectors } = useConnect();

  const openDefaultConnect = async (id: string) => {
    const c = connectors.find((c) => c.id === id);
    let connector = null;
    switch (c.id) {
      case 'walletConnect':
        context.setRoute(routes.MOBILECONNECTORS);
        break;
      case 'metaMask':
        connector = new WalletConnectConnector({
          chains: c.chains,
          options: { ...c.options, qrcode: false },
        });
        break;
      default:
        connector = c;
        break;
    }

    if (!connector) return;

    // TODO: Make this neater
    if (c.id == 'metaMask' && isMobile) {
      let connnector = connector as WalletConnectConnector;
      connector.on('message', async ({ type }) => {
        if (type === 'connecting') {
          const { uri } = (await connnector.getProvider()).connector;
          const uriString = isAndroid()
            ? uri
            : `https://metamask.app.link/wc?uri=${encodeURIComponent(uri)}`;
          window.location.href = uriString;
        }
      });
    }

    try {
      await connectAsync({ connector: connector });
    } catch (err) {
      context.debug('Async connect error. See console for more details.', err);
    }
  };
  useEffect(() => {}, [mobile]);

  /**
   * Some injected connectors pretend to be metamask, this helps avoid that issue.
   */

  const shouldShowInjectedConnector = () => {
    // Only display if an injected connector is detected
    const { ethereum } = window;

    const needsInjectedWalletFallback =
      typeof window !== 'undefined' &&
      ethereum &&
      !isMetaMask() &&
      !isCoinbaseWallet();
    //!ethereum?.isBraveWallet; // TODO: Add this line when Brave is supported

    return needsInjectedWalletFallback;
  };

  const wallets = useDefaultWallets();

  const findInjectedConnectorInfo = (name: string) => {
    let walletList = name.split(/[(),]+/);
    walletList.shift(); // remove "Injected" from array
    walletList = walletList.map((x) => x.trim());

    const hasWalletLogo = walletList.filter((x) => {
      const a = wallets.map((wallet: any) => wallet.name).includes(x);
      if (a) return x;
      return null;
    });
    if (hasWalletLogo.length === 0) return null;

    const foundInjector = wallets.filter(
      (wallet: any) => wallet.installed && wallet.name === hasWalletLogo[0]
    )[0];

    return foundInjector;
  };

  return (
    <PageContent style={{ width: 312 }}>
      <ModalHeadingBlock />
      {mobile ? (
        <>
          <MobileConnectorsContainer>
            {connectors.map((connector) => {
              const info = supportedConnectors.filter(
                (c) => c.id === connector.id
              )[0];
              if (!info) return null;

              let logos = info.logos;
              let name = info.shortName ?? info.name ?? connector.name;

              if (info.id === 'injected') {
                if (!shouldShowInjectedConnector()) return null;

                const foundInjector = findInjectedConnectorInfo(connector.name);
                if (foundInjector) {
                  logos = foundInjector.logos;
                  name = foundInjector.name.replace(' Wallet', '');
                }
              }

              if (
                context.options?.walletConnectName &&
                info.id === 'walletConnect'
              ) {
                name = context.options.walletConnectName;
              }

              return (
                <MobileConnectorButton
                  key={`m-${connector.id}`}
                  //disabled={!connector.ready}
                  onClick={() => {
                    if (
                      info.id === 'injected' ||
                      (info.id === 'metaMask' && isMetaMask())
                    ) {
                      context.setRoute(routes.CONNECT);
                      context.setConnector(connector.id);
                    } else {
                      openDefaultConnect(connector.id);
                    }
                  }}
                >
                  <MobileConnectorIcon>
                    {logos.mobile ??
                      logos.appIcon ??
                      logos.connectorButton ??
                      logos.default}
                  </MobileConnectorIcon>
                  <MobileConnectorLabel>{name}</MobileConnectorLabel>
                </MobileConnectorButton>
              );
            })}
          </MobileConnectorsContainer>
          <InfoBox>
            <ModalContent style={{ padding: 0, textAlign: 'left' }}>
              <ModalH1 $small>{copy.h1}</ModalH1>
              <ModalBody>{copy.p}</ModalBody>
            </ModalContent>
            <InfoBoxButtons>
              {!context.options?.hideQuestionMarkCTA && (
                <Button
                  variant={'tertiary'}
                  onClick={() => context.setRoute(routes.ABOUT)}
                >
                  Learn More
                </Button>
              )}
              {!context.options?.hideNoWalletCTA && (
                <Button
                  variant={'tertiary'}
                  onClick={() => context.setRoute(routes.ONBOARDING)}
                >
                  Get a Wallet
                </Button>
              )}
            </InfoBoxButtons>
          </InfoBox>
          {context.options?.disclaimer && (
            <Disclaimer style={{ visibility: 'hidden', pointerEvents: 'none' }}>
              <div>{context.options?.disclaimer}</div>
            </Disclaimer>
          )}
        </>
      ) : (
        <>
          <ConnectorsContainer>
            {connectors.map((connector) => {
              const info = supportedConnectors.filter(
                (c) => c.id === connector.id
              )[0];
              if (!info) return null;

              let logos = info.logos;

              let name = info.name ?? connector.name;
              if (
                context.options?.walletConnectName &&
                info.id === 'walletConnect'
              ) {
                name = context.options.walletConnectName;
              }

              if (info.id === 'injected') {
                if (!shouldShowInjectedConnector()) return null;

                const foundInjector = findInjectedConnectorInfo(connector.name);
                if (foundInjector) {
                  logos = foundInjector.logos;
                  name = foundInjector.name;
                }
              }

              let logo = logos.connectorButton ?? logos.default;
              if (info.extensionIsInstalled && logos.appIcon) {
                if (info.extensionIsInstalled()) {
                  logo = logos.appIcon;
                }
              }
              return (
                <ConnectorButton
                  key={connector.id}
                  disabled={context.route !== routes.CONNECTORS}
                  onClick={() => {
                    context.setRoute(routes.CONNECT);
                    context.setConnector(connector.id);
                  }}
                >
                  <ConnectorIcon>{logo}</ConnectorIcon>
                  <ConnectorLabel>{name}</ConnectorLabel>
                </ConnectorButton>
              );
            })}
          </ConnectorsContainer>

          {!context.options?.hideNoWalletCTA && (
            <LearnMoreContainer>
              <LearnMoreButton
                onClick={() => context.setRoute(routes.ONBOARDING)}
              >
                <WalletIcon /> {copy.newcomer}
              </LearnMoreButton>
            </LearnMoreContainer>
          )}
          {context.options?.disclaimer && (
            <Disclaimer style={{ visibility: 'hidden', pointerEvents: 'none' }}>
              <div>{context.options?.disclaimer}</div>
            </Disclaimer>
          )}
        </>
      )}
    </PageContent>
  );
};

export default Wallets;
