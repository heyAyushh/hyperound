use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
  program_error::ProgramError,
  program_pack::{IsInitialized, Pack, Sealed},
  pubkey::Pubkey,
};

pub const MAX_NAME_LENGTH: usize = 32;

pub const MAX_SYMBOL_LENGTH: usize = 10;

pub const MAX_URI_LENGTH: usize = 200;

pub const MAX_METADATA_LEN: usize = 1 + 32 + 32 + MAX_DATA_SIZE + 1 + 1 + 9 + 172;

pub const MAX_DATA_SIZE: usize = 4
    + MAX_NAME_LENGTH
    + 4
    + MAX_SYMBOL_LENGTH
    + 4
    + MAX_URI_LENGTH
    + 2
    + 1
    + 4
    + MAX_CREATOR_LIMIT * MAX_CREATOR_LEN;

pub const MAX_CREATOR_LIMIT: usize = 5;

pub const MAX_CREATOR_LEN: usize = 32 + 1 + 1;

use arrayref::{array_mut_ref, array_ref, array_refs, mut_array_refs};

pub struct Hyperound {
  pub is_initialized: bool,
  // pub initializer_pubkey: Pubkey,
  // pub temp_token_account_pubkey: Pubkey,
  // pub initializer_token_to_receive_account_pubkey: Pubkey,
  // pub expected_amount: u64,
}

#[derive(BorshSerialize, BorshDeserialize, PartialEq, Debug, Clone)]
pub struct Creator {
  pub address: Pubkey,
  pub verified: bool,
  // In percentages, NOT basis points ;) Watch out!
  pub share: u8,
}

impl Sealed for Hyperound {}

impl IsInitialized for Hyperound {
  fn is_initialized(&self) -> bool {
    self.is_initialized
  }
}

#[repr(C)]
#[derive(Clone, BorshSerialize, BorshDeserialize, Debug)]
pub struct Metadata {
    pub key: Key,
    pub update_authority: Pubkey,
    pub mint: Pubkey,
    pub data: Data,
    // Immutable, once flipped, all sales of this metadata are considered secondary.
    pub primary_sale_happened: bool,
    // Whether or not the data struct is mutable, default is not
    pub is_mutable: bool,
    /// nonce for easy calculation of editions, if present
    pub edition_nonce: Option<u8>,
}

impl Metadata {
    pub fn from_account_info(a: &AccountInfo) -> Result<Metadata, ProgramError> {
        let md: Metadata =
            try_from_slice_checked(&a.data.borrow_mut(), Key::MetadataV1, MAX_METADATA_LEN)?;

        Ok(md)
    }
}

impl Pack for Hyperound {
  const LEN: usize = 105;
  fn unpack_from_slice(src: &[u8]) -> Result<Self, ProgramError> {
    let src = array_ref![src, 0, Hyperound::LEN];
    let (
      is_initialized,
      initializer_pubkey,
      temp_token_account_pubkey,
      initializer_token_to_receive_account_pubkey,
      expected_amount,
    ) = array_refs![src, 1, 32, 32, 32, 8];
    let is_initialized = match is_initialized {
      [0] => false,
      [1] => true,
      _ => return Err(ProgramError::InvalidAccountData),
    };

    Ok(Hyperound {
      is_initialized,
      // initializer_pubkey: Pubkey::new_from_array(*initializer_pubkey),
      // temp_token_account_pubkey: Pubkey::new_from_array(*temp_token_account_pubkey),
      // initializer_token_to_receive_account_pubkey: Pubkey::new_from_array(
      //   *initializer_token_to_receive_account_pubkey,
      // ),
      // expected_amount: u64::from_le_bytes(*expected_amount),
    })
  }

  fn pack_into_slice(&self, dst: &mut [u8]) {
    let dst = array_mut_ref![dst, 0, Escrow::LEN];
    let (
      is_initialized_dst,
      initializer_pubkey_dst,
      temp_token_account_pubkey_dst,
      initializer_token_to_receive_account_pubkey_dst,
      expected_amount_dst,
    ) = mut_array_refs![dst, 1, 32, 32, 32, 8];

    let Escrow {
      is_initialized,
      initializer_pubkey,
      temp_token_account_pubkey,
      initializer_token_to_receive_account_pubkey,
      expected_amount,
    } = self;

    is_initialized_dst[0] = *is_initialized as u8;
    initializer_pubkey_dst.copy_from_slice(initializer_pubkey.as_ref());
    temp_token_account_pubkey_dst.copy_from_slice(temp_token_account_pubkey.as_ref());
    initializer_token_to_receive_account_pubkey_dst
      .copy_from_slice(initializer_token_to_receive_account_pubkey.as_ref());
    *expected_amount_dst = expected_amount.to_le_bytes();
  }
}
