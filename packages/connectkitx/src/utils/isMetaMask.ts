export const isMetaMask = () => {
  if (typeof window === 'undefined') return false;

  const { ethereum } = window;
  if (!ethereum) return false;

  const isMetaMask = Boolean(ethereum.isMetaMask);
  if (!isMetaMask) return false;

  const isBrave = Boolean(
    ethereum.isBraveWallet //&& !ethereum._events && !ethereum._state
  );
  if (isBrave) return false;

  const isTokenary = Boolean(ethereum.isTokenary);
  if (isTokenary) return false;

  return true;
};
