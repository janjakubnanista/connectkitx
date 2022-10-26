export const isCoinbaseWallet = () => {
  if (typeof window === 'undefined') return false;
  const { ethereum } = window;

  return !!(
    ethereum?.isCoinbaseWallet ||
    (ethereum?.providers &&
      ethereum?.providers.find((provider) => provider.isCoinbaseWallet))
  );
};
