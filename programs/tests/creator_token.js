const anchor = require("@project-serum/anchor");
const Token = require("@solana/spl-token").Token;
const assert = require("assert");

describe("Initialization", () => {
  const provider = anchor.Provider.local();
  anchor.setProvider(provider);
  const connection = provider.connection;
  const wallet = provider.wallet;

  mint = null;
  account = null
  const program = anchor.workspace.CreatorToken;

  it("Initializes workspace", async () => {
    await program.rpc.initialize();
  });
  
  it("creates a token account", async () => {
    account = await createTokenAccount(program.provider, mint, wallet.publicKey);
  });

  it("creates a token", async () => {
    await program.rpc.createToken();
  });

  it("mint tokens", async () => {
    mint = await createMint(provider);
  });

  it("mint tokens to account", async () => {
    await program.rpc.mintTokensTo(new anchor.BN(1000), {
      accounts: {
        authority: provider.wallet.publicKey,
        mint,
        to: account,
        tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
      },
    });

    const fromAccount = await getTokenAccount(provider, account);

    assert.ok(fromAccount.amount.eq(new anchor.BN(1000)));
  });

  it("transfer tokens to associated account", async () => {
    await program.rpc.transferTokens();
  });

  it("burns tokens", async () => {
    await program.rpc.burnTokens();
  });
});

// -------------------------------------------
const serumCmn = require("@project-serum/common");
const { TokenInstructions } =  require("@project-serum/serum");

// TODO: remove this constant once @project-serum/serum uses the same version
// TODO: of @solana/web3.js as anchor (or switch packages).
const TOKEN_PROGRAM_ID = new anchor.web3.PublicKey(
  TokenInstructions.TOKEN_PROGRAM_ID.toString()
);

async function getTokenAccount(provider, addr) {
  return await serumCmn.getTokenAccount(provider, addr);
}

async function getMintInfo(provider, mintAddr) {
  return await serumCmn.getMintInfo(provider, mintAddr);
}

async function createMint(provider, authority) {
  if (authority === undefined) {
    authority = provider.wallet.publicKey;
  }
  const mint = anchor.web3.Keypair.generate();
  const instructions = await createMintInstructions(
    provider,
    authority,
    mint.publicKey
  );

  const tx = new anchor.web3.Transaction();
  tx.add(...instructions);

  await provider.send(tx, [mint]);

  return mint.publicKey;
}

async function createMintInstructions(provider, authority, mint) {
  let instructions = [
    anchor.web3.SystemProgram.createAccount({
      fromPubkey: provider.wallet.publicKey,
      newAccountPubkey: mint,
      space: 82,
      lamports: await provider.connection.getMinimumBalanceForRentExemption(82),
      programId: TOKEN_PROGRAM_ID,
    }),
    TokenInstructions.initializeMint({
      mint,
      decimals: 6,
      mintAuthority: authority,
    }),
  ];
  return instructions;
}

async function createTokenAccount(provider, mint, owner) {
  const vault = anchor.web3.Keypair.generate();
  const tx = new anchor.web3.Transaction();
  tx.add(
    ...(await createTokenAccountInstrs(provider, vault.publicKey, mint, owner))
  );
  await provider.send(tx, [vault]);
  return vault.publicKey;
}

async function createTokenAccountInstrs(
  provider,
  newAccountPubkey,
  mint,
  owner,
  lamports
) {
  if (lamports === undefined) {
    lamports = await provider.connection.getMinimumBalanceForRentExemption(165);
  }
  return [
    anchor.web3.SystemProgram.createAccount({
      fromPubkey: provider.wallet.publicKey,
      newAccountPubkey,
      space: 165,
      lamports,
      programId: TOKEN_PROGRAM_ID,
    }),
    TokenInstructions.initializeAccount({
      account: newAccountPubkey,
      mint,
      owner,
    }),
  ];
}

async function mintToAccount(
  provider,
  mint,
  destination,
  amount,
  mintAuthority
) {
  // mint authority is the provider
  const tx = new anchor.web3.Transaction();
  tx.add(
    ...(await createMintToAccountInstrs(
      mint,
      destination,
      amount,
      mintAuthority
    ))
  );
  await provider.send(tx, []);
  return;
}

async function createMintToAccountInstrs(
  mint,
  destination,
  amount,
  mintAuthority
) {
  return [
    TokenInstructions.mintTo({
      mint,
      destination: destination,
      amount: amount,
      mintAuthority: mintAuthority,
    }),
  ];
}