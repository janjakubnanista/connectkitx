import React from 'react';
import localizations from '../../../constants/localizations';

import {
  PageContent,
  ModalContent,
  ModalHeading,
  ModalHeadingBlock,
} from '../../Common/Modal/styles';
import ChainSelectList from '../../Common/ChainSelectList';
import { useConnectKitContext } from '../../../context/useConnectKitContext';

const SwitchNetworks: React.FC = () => {
  const context = useConnectKitContext();
  const copy = localizations[context.lang].switchNetworkScreen;

  return (
    <PageContent>
      {/* <ModalHeading>{copy.heading}</ModalHeading> */}
      <ModalHeadingBlock />
      <ModalContent>
        <ChainSelectList />
      </ModalContent>
    </PageContent>
  );
};

export default SwitchNetworks;
