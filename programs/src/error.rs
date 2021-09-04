use thiserror::Error;

use solana_program::program_error::ProgramError;

#[derive(Error, Debug, Copy, Clone)]
pub enum HyperoundError {
  /// Incorrect authority provided on update or delete
  #[error("Incorrect authority provided on update or delete")]
  IncorrectAuthority,
  /// Invalid instruction
  #[error("Invalid Instruction")]
  InvalidInstruction,
  /// Not Rent Exempt
  #[error("Not Rent Exempt")]
  NotRentExempt,
  /// Expected Amount Mismatch
  #[error("Expected Amount Mismatch")]
  ExpectedAmountMismatch,
  /// Amount Overflow
  #[error("Amount Overflow")]
  AmountOverflow,
}

impl From<HyperoundError> for ProgramError {
  fn from(e: HyperoundError) -> Self {
    ProgramError::Custom(e as u32)
  }
}
