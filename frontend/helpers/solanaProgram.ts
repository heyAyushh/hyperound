import { createToken } from "./token";

export default async function createTokenButton(
  setCreatingToken,
  router,
  setToken,
  setToast
): Promise<boolean | null> {
  try {
    setCreatingToken(true);
    const data = await createToken();

    const action = {
      name: "Check on Explorer",
      handler: () =>
        router.push(
          `https://explorer.solana.com/address/${data.mint.publicKey.toBase58()}?cluster=devnet`
        ),
    };

    setToast({
      text: "Your Mint was suceessful!, Added to your wallet.",
      type: "success",
      actions: [action],
    });

    setCreatingToken(false);

    setToken({
      signature: data.signature,
      transaction: data.transaction,
      mint: data.mint,
      exists: false,
    });

    return true;
  } catch (err) {
    setToast({
      text: err.message,
      type: "error",
    });

    return null;
  }
}
