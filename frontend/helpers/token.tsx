
import * as web3 from '@solana/web3.js';
import * as splToken from '@solana/spl-token';

const getProvider = async () => {
  if ("solana" in window) {
    const provider = (window as any).solana;
    if (provider.isPhantom) {
      return provider;
    }
  } else {
    window.open("https://www.phantom.app/", "_blank");
  }
};

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function createToken() {
  const provider = await getProvider();

  // Connect to cluster
  const connection = new web3.Connection(
    web3.clusterApiUrl('devnet'),
    'confirmed',
  );

  const toWallet = provider.publicKey;
  const fromWallet = web3.Keypair.generate();

  const fromAirdropSignature = await connection.requestAirdrop(
    fromWallet.publicKey,
    web3.LAMPORTS_PER_SOL / 10,
  );

  const toAirdropSignature = await connection.requestAirdrop(
    fromWallet.publicKey,
    web3.LAMPORTS_PER_SOL / 10,
  );

  //wait for airdrop confirmation
  await connection.confirmTransaction(fromAirdropSignature);
  await connection.confirmTransaction(toAirdropSignature);

  // await delay(1000);

  //create new token mint
  const mint = await splToken.Token.createMint(
    connection,
    fromWallet,
    fromWallet.publicKey,
    null,
    1,
    splToken.TOKEN_PROGRAM_ID,
  );

  //get the token account of the fromWallet Solana address, if it does not exist, create it
  const fromTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
    fromWallet.publicKey,
  );

  //get the token account of the toWallet Solana address, if it does not exist, create it
  const toTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
    toWallet,
  );

  //minting 1 new token to the "fromTokenAccount" account we just returned/created
  await mint.mintTo(
    fromTokenAccount.address,
    fromWallet,
    [],
    1000000000,
  );

  // Add token transfer instructions to transaction
  const transaction = new web3.Transaction().add(
    splToken.Token.createTransferInstruction(
      splToken.TOKEN_PROGRAM_ID,
      fromTokenAccount.address,
      toTokenAccount.address,
      fromWallet.publicKey,
      [],
      1,
    ),
  );

  // Sign transaction, broadcast, and confirm
  const signature = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [fromWallet],
    { commitment: 'confirmed' },
  );

  return {
    signature,
    transaction,
    mint
  }
}