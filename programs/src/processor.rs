use crate::{
  check_program_account, error::HyperoundError, instruction::HyperoundInstruction, state::Creator,
};

use solana_program::{
  account_info::{next_account_info, AccountInfo},
  entrypoint::ProgramResult,
  msg,
  program::{invoke, invoke_signed},
  program_error::ProgramError,
  program_pack::{IsInitialized, Pack},
  pubkey::Pubkey,
  system_instruction, system_program,
  sysvar::{rent::Rent, Sysvar},
};

use spl_token_metadata::instruction::create_metadata_accounts;

use spl_token::{
  instruction::initialize_mint, instruction::mint_to_checked, state::Account as TokenAccount,
};

use solana_sdk::{
  commitment_config::CommitmentConfig,
  instruction::Instruction,
  message::Message,
  native_token::*,
  program_option::COption,
  signature::{Keypair, Signer},
  transaction::Transaction,
};

pub struct Processor;
impl Processor {
  pub fn process(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
  ) -> ProgramResult {
    let instruction = HyperoundInstruction::unpack(instruction_data)?;

    match instruction {
      // EscrowInstruction::InitEscrow { amount } => {
      //     msg!("Instruction: InitEscrow");
      //     Self::process_init_escrow(accounts, amount, program_id)
      // }
      // EscrowInstruction::Exchange { amount } => {
      //     msg!("Instruction: Exchange");
      //     Self::process_exchange(accounts, amount, program_id)
      // }
      HyperoundInstruction::CreateCreatorCoin { username } => {
        msg!("Instruction: Create creator coin");
        Self::process_create_creator_coin(accounts, username, program_id)
      }
      HyperoundInstruction::BuyCreatorCoin { username } => {
        msg!("Instruction: Buy creator coin");
        Self::process_buy_creator_coin(accounts, username, program_id)
      }
      HyperoundInstruction::SellCreatorCoin { username } => {
        msg!("Instruction: Sell creator coin");
        Self::process_sell_creator_coin(accounts, username, program_id)
      }
    }
  }

  fn process_create_creator_coin(
    accounts: &[AccountInfo],
    username: Vec<u8>,
    program_id: &Pubkey,
  ) -> ProgramResult {
    // first account is the program account
    // second account is the creator account
    let account_info_iter = &mut accounts.iter();
    let program_account = next_account_info(account_info_iter)?;

    // The account must be owned by the program in order to modify its data
    check_program_account(program_id)?;
    if program_account.owner != program_id {
      msg!("Program account does not have the correct program id");
      return Err(ProgramError::IncorrectProgramId);
    }

    let creator = next_account_info(account_info_iter)?;

    // Withdraw 1 SOL from the source and add it to Program account
    **creator.try_borrow_mut_lamports()? -= 1 * LAMPORTS_PER_SOL;
    **program_account.try_borrow_mut_lamports()? += 1 * LAMPORTS_PER_SOL;

    // new mint address for token
    // Pubkey::new(&[0; 32])
    let mint_pubkey = Pubkey::new_unique();

    let DECIMALS = 0;
    let mint = initialize_mint(
      &spl_token::id(),
      &mint_pubkey,
      &program_id,
      Some(&program_id),
      DECIMALS,
    )?;

    // new account for metadata
    let metadata_account = Pubkey::new_unique();

    let metadata_creator = spl_token_metadata::state::Creator {
      address: *creator.key,
      share: 15,
      verified: true,
    };

    create_metadata_accounts(
      *program_id,
      metadata_account,
      mint_pubkey,
      *program_id,
      *program_id,
      *program_id,
      // name: String,
      std::str::from_utf8_unchecked(&username).to_string(),
      "symbol: String".to_string(),
      "uri: String".to_string(),
      Some(vec![metadata_creator]),
      // Some(vec![creator.key]),
      // Royalty basis points that goes to creators in secondary sales (0-10000)
      // 15% for creator
      1500,
      true,
      true,
    );

    let AMOUNT = 1;

    mint_to_checked(
      &spl_token::id(),
      &mint_pubkey,
      &metadata_account,
      &program_id,
      &[&program_id],
      AMOUNT,
      DECIMALS,
    )?;

    Ok(())
  }

  fn process_buy_creator_coin(
    accounts: &[AccountInfo],
    username: Vec<u8>,
    program_id: &Pubkey,
  ) -> ProgramResult {
    // first account is the program account
    // second account is the creator account
    let account_info_iter = &mut accounts.iter();
    let program_account = next_account_info(account_info_iter)?;

    // The account must be owned by the program in order to modify its data
    check_program_account(program_id)?;
    if program_account.owner != program_id {
      msg!("Program account does not have the correct program id");
      return Err(ProgramError::IncorrectProgramId);
    }

    let buyer = next_account_info(account_info_iter)?;

    // Withdraw 1 SOL from the buyer and add it to Program account
    **buyer.try_borrow_mut_lamports()? -= 1 * LAMPORTS_PER_SOL;
    **program_account.try_borrow_mut_lamports()? += 1 * LAMPORTS_PER_SOL;

    let buyer_mint_account = spl_token_metadata::utils::create_or_allocate_account_raw(
      *program_id,
      new_account_info: &AccountInfo<'a>,
      rent_sysvar_info: &AccountInfo<'a>,
      program_account,
      buyer,
      size: usize,
      signer_seeds: &[&[u8]],
    );

    // search mint_pubkey from metadata
    let DECIMALS = 0;
    let AMOUNT = 1;

    mint_to_checked(
      token_program_id: &Pubkey,
      mint_pubkey: &Pubkey,
      buyer_mint_account,
      owner_pubkey: &Pubkey,
      signer_pubkeys: &[&Pubkey],
      AMOUNT,
      DECIMALS,
    );

    Ok(())
  }

  fn process_sell_creator_coin(
    accounts: &[AccountInfo],
    username: Vec<u8>,
    program_id: &Pubkey,

    config: &Config,
    sol: f64,
    wallet_address: Pubkey,
    wrapped_sol_account: Option<Pubkey>,
  ) -> ProgramResult {
      let lamports = sol_to_lamports(sol);
      let instructions = if let Some(wrapped_sol_account) = wrapped_sol_account {
        println_display(
          config,
          format!("Wrapping {} SOL into {}", sol, wrapped_sol_account),
        );
        vec![
          system_instruction::create_account(
            &wallet_address,
            &wrapped_sol_account,
            lamports,
            Account::LEN as u64,
            &spl_token::id(),
          ),
          initialize_account(
            &spl_token::id(),
            &wrapped_sol_account,
            &native_mint::id(),
            &wallet_address,
          )?,
        ]
      } else {
        let account = get_associated_token_address(&wallet_address, &native_mint::id());

        if !config.sign_only {
          if let Some(account_data) = config
            .rpc_client
            .get_account_with_commitment(&account, config.rpc_client.commitment())?
            .value
          {
            if account_data.owner != system_program::id() {
              return Err(format!("Error: Account already exists: {}", account).into());
            }
          }
        }

        // println_display(config, format!("Wrapping {} SOL into {}", sol, account));
        vec![
          system_instruction::transfer(&wallet_address, &account, lamports),
          create_associated_token_account(&config.fee_payer, &wallet_address, &native_mint::id()),
        ]
      };
      if !config.sign_only {
        check_wallet_balance(config, &wallet_address, lamports)?;
      }
      Ok(Some((0, vec![instructions])))
  }
}
