import React from 'react';
import {
  Graphic,
  LogoGroup,
  Logo,
  FloatWrapper,
  LogoPosition,
  LogoInner,
  LogoGraphic,
  GraphicBackground,
  RotateWrapper,
} from './styles';

import localizations, { localize } from '../../../constants/localizations';

import {
  PageContent,
  ModalBody,
  ModalContent,
  ModalH1,
  ModalHeading,
  ModalHeadingBlock,
} from '../../Common/Modal/styles';
import Logos from '../../../assets/logos';
import wave from '../../../assets/wave';

import Button from '../../Common/Button';
import { useConnectKitContext } from '../../../context/useConnectKitContext';

const Introduction: React.FC = () => {
  const localizeText = (text: string) => {
    return localize(text, {
      //CONNECTORNAME: connector.name,
    });
  };
  const context = useConnectKitContext();
  const copy = localizations[context.lang].onboardingScreen;
  return (
    <PageContent>
      {/* <ModalHeading>{localizeText(copy.heading)}</ModalHeading> */}
      <ModalHeadingBlock />
      <Graphic>
        <LogoGroup>
          <Logo>
            <LogoPosition>
              <LogoInner>
                <FloatWrapper>
                  <RotateWrapper>
                    <LogoGraphic>
                      <Logos.Coinbase background />
                    </LogoGraphic>
                  </RotateWrapper>
                </FloatWrapper>
              </LogoInner>
            </LogoPosition>
          </Logo>
          <Logo>
            <LogoPosition>
              <LogoInner>
                <FloatWrapper>
                  <RotateWrapper>
                    <LogoGraphic>
                      <Logos.MetaMask background />
                    </LogoGraphic>
                  </RotateWrapper>
                </FloatWrapper>
              </LogoInner>
            </LogoPosition>
          </Logo>
          <Logo>
            <LogoPosition>
              <LogoInner>
                <FloatWrapper>
                  <RotateWrapper>
                    <LogoGraphic>
                      <Logos.Trust />
                    </LogoGraphic>
                  </RotateWrapper>
                </FloatWrapper>
              </LogoInner>
            </LogoPosition>
          </Logo>
          <Logo>
            <LogoPosition>
              <LogoInner>
                <FloatWrapper>
                  <RotateWrapper>
                    <LogoGraphic>
                      <Logos.Argent />
                    </LogoGraphic>
                  </RotateWrapper>
                </FloatWrapper>
              </LogoInner>
            </LogoPosition>
          </Logo>
          <Logo>
            <LogoPosition>
              <LogoInner>
                <FloatWrapper>
                  <RotateWrapper>
                    <LogoGraphic>
                      <Logos.ImToken />
                    </LogoGraphic>
                  </RotateWrapper>
                </FloatWrapper>
              </LogoInner>
            </LogoPosition>
          </Logo>
        </LogoGroup>
        <GraphicBackground>{wave}</GraphicBackground>
      </Graphic>
      <ModalContent style={{ paddingBottom: 18 }}>
        <ModalH1 $small>{localizeText(copy.h1)}</ModalH1>
        <ModalBody>{localizeText(copy.p)}</ModalBody>
      </ModalContent>
      <Button href={copy.ctaUrl} arrow>
        {localizeText(copy.ctaText)}
      </Button>
    </PageContent>
  );
};

export default Introduction;
