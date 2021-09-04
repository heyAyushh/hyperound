use {
  crate::error::HyperoundError::InvalidInstruction,
  borsh::{BorshDeserialize, BorshSerialize},
  solana_program::{
    instruction::{AccountMeta, Instruction},
    program_error::ProgramError,
    pubkey::Pubkey,
    system_program,
  },
  std::convert::TryInto,
};

pub enum HyperoundInstruction {
  /// Allows a creator to create coin with his own metadata
  ///
  ///
  /// Accounts expected:
  ///
  /// first account is the program account
  /// second account is the creator account
  CreateCreatorCoin {
    /// reserve balance, total collected solana for this token /// defaults to 0
    // balance: u64,
    /// username of creator
    username: Vec<u8>,
    //// current price of single creator token in solana
    //// defaults to 0.01 price = balance/supply
    // price: u64,
  },

  /// Buy a creator coin
  ///
  /// Accounts expected:
  ///
  /// 0. `[signer]` The account of the person taking the trade
  /// 1. `[writable]` The taker's token account for the token they send
  /// 2. `[writable]` The taker's token account for the token they will receive should the trade go through
  /// 3. `[writable]` The PDA's temp token account to get tokens from and eventually close
  /// 4. `[writable]` The initializer's main account to send their rent fees to
  /// 5. `[writable]` The initializer's token account that will receive tokens
  /// 6. `[writable]` The escrow account holding the escrow info
  /// 7. `[]` The token program
  /// 8. `[]` The PDA account
  BuyCreatorCoin {
    /// the amount the taker expects to be paid in the other token, as a u64 because that's the max possible supply of a token
    username: Vec<u8>,
  },

  SellCreatorCoin {
    username: Vec<u8>,
  },
}

impl HyperoundInstruction {
  /// Unpacks a byte buffer into a [EscrowInstruction](enum.EscrowInstruction.html).
  pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
    let (tag, rest) = input.split_first().ok_or(InvalidInstruction)?;

    Ok(match tag {
      0 => Self::CreateCreatorCoin {
        username: Self::unpack_amount(rest)?,
      },
      1 => Self::BuyCreatorCoin {
        username: Self::unpack_amount(rest)?,
      },
      2 => Self::SellCreatorCoin {
        username: Self::unpack_amount(rest)?,
      },
      _ => return Err(InvalidInstruction.into()),
    })
  }

  fn unpack_amount(input: &[u8]) -> Result<u64, ProgramError> {
    let amount = input
      .get(..8)
      .and_then(|slice| slice.try_into().ok())
      .map(u64::from_le_bytes)
      .ok_or(InvalidInstruction)?;
    Ok(amount)
  }
}
