pub mod error;
pub mod instruction;
pub mod processor;
pub mod state;

#[cfg(not(feature = "no-entrypoint"))]
pub mod entrypoint;

pub use solana_program;
use solana_program::{
  entrypoint::ProgramResult, 
  program_error::ProgramError, 
  pubkey::Pubkey,
  msg,
  account_info::AccountInfo
};
use crate::error::HyperoundError;

/// Convert the UI representation of a token amount (using the decimals field defined in its mint)
/// to the raw amount
pub fn ui_amount_to_amount(ui_amount: f64, decimals: u8) -> u64 {
    (ui_amount * 10_usize.pow(decimals as u32) as f64) as u64
}

/// Convert a raw amount to its UI representation (using the decimals field defined in its mint)
pub fn amount_to_ui_amount(amount: u64, decimals: u8) -> f64 {
    amount as f64 / 10_usize.pow(decimals as u32) as f64
}

solana_program::declare_id!("Hyperound1111111111111111111111111111111111");

/// Checks that the supplied program ID is the correct one for SPL-token
pub fn check_program_account(hyperound_program_id: &Pubkey) -> ProgramResult {
    if hyperound_program_id != &id() {
        return Err(ProgramError::IncorrectProgramId);
    }
    Ok(())
}

pub fn check_authority(authority_info: &AccountInfo, expected_authority: &Pubkey) -> ProgramResult {
  if expected_authority != authority_info.key {
      msg!("Incorrect record authority provided");
      return Err(HyperoundError::IncorrectAuthority.into());
  }
  if !authority_info.is_signer {
      msg!("Record authority signature missing");
      return Err(ProgramError::MissingRequiredSignature);
  }
  Ok(())
}