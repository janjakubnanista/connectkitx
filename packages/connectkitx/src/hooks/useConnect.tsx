import { useConnect as wagmiUseConnect, useNetwork } from 'wagmi';
import { useConnectKitContext } from '../context/useConnectKitContext';

type ConnectResult = ReturnType<typeof wagmiUseConnect>;

export type UseConnectReturnValue = Pick<ConnectResult, 'connectAsync' | 'connectors'>

export function useConnect(): UseConnectReturnValue {
  const context = useConnectKitContext();
  const { chains } = useNetwork();
  const { connectAsync, connectors } = wagmiUseConnect({
    onError(err) {
      if (err.message) {
        if (err.message !== 'User rejected request') {
          context.debug(err.message, err);
        }
      } else {
        context.debug(`Could not connect. See console for more details.`, err);
      }
    },
  });
  return {
    connectAsync: ({ ...props }) =>
      connectAsync({ ...props, chainId: chains[0]?.id }),
    connectors,
  };
}
