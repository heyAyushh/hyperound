export const getProvider = (): any => {
    if ("solana" in window) {
      const provider = (window as any).solana;
      if (provider.isPhantom) {
        return provider;
      }
    }
};