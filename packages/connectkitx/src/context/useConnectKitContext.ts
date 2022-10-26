import { useContext } from 'react';
import { Context } from './Context';

export const useConnectKitContext = () => {
  const context = useContext(Context);
  if (!context) throw Error('ConnectKit Hook must be inside a Provider.');
  return context;
};
