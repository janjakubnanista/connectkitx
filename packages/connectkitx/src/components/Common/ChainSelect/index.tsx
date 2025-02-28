import React, { useEffect, useState } from 'react';

import { useNetwork } from 'wagmi';
import supportedChains from '../../../constants/supportedChains';

import { isMobile } from '../../../utils';

import defaultTheme from '../../../constants/defaultTheme';

import styled, { css } from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';

import Tooltip from '../Tooltip';
import ChainSelectDropdown from '../ChainSelectDropdown';

import Logos from '../../../assets/chains';
import { useConnectKitContext } from '../../../context/useConnectKitContext';
import { routes } from '../../constants';

const Container = styled(motion.div)``;

const SwitchChainButton = styled(motion.button)`
  --color: var(
    --ck-dropdown-button-color,
    var(--ck-button-primary-color, var(--ck-body-color))
  );
  --background: var(
    --ck-dropdown-button-background,
    var(--ck-secondary-button-background, var(--ck-body-background-secondary))
  );
  --box-shadow: var(
    --ck-dropdown-button-box-shadow,
    var(
      --ck-secondary-button-box-shadow,
      var(--ck-button-primary-box-shadow),
      none
    )
  );

  --hover-color: var(--ck-dropdown-button-hover-color, var(--color));
  --hover-background: var(
    --ck-dropdown-button-hover-background,
    var(--background)
  );
  --hover-box-shadow: var(
    --ck-dropdown-button-hover-box-shadow,
    var(--box-shadow)
  );

  --active-color: var(--ck-dropdown-button-active-color, var(--hover-color));
  --active-background: var(
    --ck-dropdown-button-active-background,
    var(--hover-background)
  );
  --active-box-shadow: var(
    --ck-dropdown-button-active-box-shadow,
    var(--hover-box-shadow)
  );

  appearance: none;
  user-select: none;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 15px;
  width: 52px;
  height: 30px;
  padding: 2px 6px 2px 3px;
  font-size: 16px;
  line-height: 19px;
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
  transform: translateZ(0px);

  transition: 100ms ease;
  transition-property: transform, background-color, box-shadow, color;

  color: var(--color);
  background: var(--background);
  box-shadow: var(--box-shadow);

  svg {
    position: relative;
    display: block;
  }

  ${(props) =>
    props.disabled
      ? css`
          width: auto;
          padding: 3px;
          position: relative;
          left: -22px;
        `
      : css`
          cursor: pointer;

          @media only screen and (min-width: ${defaultTheme.mobileWidth +
            1}px) {
            &:hover,
            &:focus {
              color: var(--hover-color);
              background: var(--hover-background);
              box-shadow: var(--hover-box-shadow);
            }
            &:active {
              color: var(--active-color);
              background: var(--active-background);
              box-shadow: var(--active-box-shadow);
            }
          }
        `}
`;
const ChainIcon = styled(motion.div)<{ $empty?: boolean }>`
  display: block;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  width: 24px;
  height: 24px;
  min-width: 24px;
  min-height: 24px;
  background: var(--ck-body-background);
  color: var(--ck-body-color-muted);
  svg {
    width: 100%;
    height: auto;
  }
  ${(props) =>
    props.$empty &&
    css`
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--ck-body-background-secondary);
      &:before {
        content: '?';
        font-weight: bold;
        font-family: var(--ck-font-family);
      }
    `}
`;

const ChevronDown = ({ ...props }) => (
  <svg
    aria-hidden="true"
    width="11"
    height="6"
    viewBox="0 0 11 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M1.5 1L5.5 5L9.5 1"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChainSelector: React.FC = () => {
  const context = useConnectKitContext();
  const [isOpen, setIsOpen] = useState(false);
  const { chain, chains } = useNetwork();

  const mobile = isMobile() || window?.innerWidth < defaultTheme.mobileWidth;

  useEffect(() => {
    if (!context.open) setIsOpen(false);
  }, [context.open]);

  const disabled = chains.length <= 1;
  const ChainSelectorButton = (
    <ChainIcon $empty={!chains.find((x) => x.id === chain?.id)}>
      <AnimatePresence initial={false}>
        {chains
          .filter((x) => x.id === chain?.id)
          .map((x, i) => {
            const c = supportedChains.find((c) => c.id === x.id);
            return (
              <motion.div
                key={`${chain?.id}-${chain?.name}`}
                style={{
                  position: 'absolute',
                  inset: 0,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {c?.logo || <Logos.UnknownChain />}
              </motion.div>
            );
          })}
      </AnimatePresence>
    </ChainIcon>
  );

  return (
    <>
      <Container>
        <ChainSelectDropdown
          offsetX={-12}
          open={!mobile && isOpen}
          onClose={() => setIsOpen(false)}
        >
          <SwitchChainButton
            aria-label="Change Network"
            disabled={disabled}
            onClick={() => {
              if (mobile) {
                context.setRoute(routes.SWITCHNETWORKS);
              } else {
                setIsOpen(!isOpen);
              }
            }}
          >
            {disabled ? (
              <Tooltip
                message={`${chain?.name} Network`}
                xOffset={-6}
                delay={0.01}
              >
                {ChainSelectorButton}
              </Tooltip>
            ) : (
              ChainSelectorButton
            )}
            {!disabled && <ChevronDown style={{ top: 1, left: -3 }} />}
          </SwitchChainButton>
        </ChainSelectDropdown>
      </Container>
    </>
  );
};

export default ChainSelector;
