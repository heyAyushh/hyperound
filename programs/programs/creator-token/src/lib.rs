use anchor_lang::prelude::*;
#[allow(unused_imports)]
use anchor_spl::token::{self, MintTo, Burn, Transfer, InitializeMint, SetAuthority, InitializeAccount, Mint};
use serde::{Serialize, Deserialize};

#[program]
mod creator_token {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> ProgramResult {
        Ok(())
    }

    pub fn initialize_token_mint(_ctx: Context<InitializeTokenMint>, decimals:u8, authority: Pubkey, freeze_authority: Pubkey) -> ProgramResult {
        let cpi_accounts = InitializeMint {
            mint: _ctx.accounts.mint.clone(),
            rent: _ctx.accounts.rent.clone(),
        };
        let cpi_program = _ctx.accounts.token_program.clone();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        anchor_spl::token::initialize_mint(cpi_ctx, decimals, &authority, Some(&freeze_authority))
    }

    pub fn initialize_token_account(_ctx: Context<InitializeTokenAccount>) -> ProgramResult {
        anchor_spl::token::initialize_account(_ctx.accounts.into())
    }

    pub fn mint_tokens_to(_ctx: Context<MintCreatorTokenTo>, amount: u64) -> ProgramResult {
        anchor_spl::token::mint_to(_ctx.accounts.into(), amount)
    }

    pub fn transfer_tokens(_ctx: Context<TransferCreatorToken>, amount: u64) -> ProgramResult {
        anchor_spl::token::transfer(_ctx.accounts.into(), amount)
    }

    pub fn burn_tokens(_ctx: Context<BurnCreatorToken>, amount: u64) -> ProgramResult {
        anchor_spl::token::burn(_ctx.accounts.into(), amount)
    }

    pub fn set_authority(_ctx: Context<SetCreatorAuthority>, authority_type: AuthorityType, new_authority: Option<Pubkey>) -> ProgramResult {
        anchor_spl::token::set_authority(_ctx.accounts.into(), authority_type.into(), new_authority)
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct TokenState {
    pub n: u8
}

#[derive(Accounts)]
pub struct Initialize {}

pub struct TokenAccount(spl_token::state::Account);

#[derive(AnchorSerialize, AnchorDeserialize)]
pub enum AuthorityType {
    /// Authority to mint new tokens
    MintTokens,
    /// Authority to freeze any account associated with the Mint
    FreezeAccount,
    /// Owner of a given token account
    AccountOwner,
    /// Authority to close a token account
    CloseAccount,
}

#[derive(Accounts)]
pub struct InitializeTokenAccount<'info> {
    #[account(signer)]
    pub authority: AccountInfo<'info>,
    #[account(mut)]
    pub account: AccountInfo<'info>,
    #[account(mut)]
    pub mint: AccountInfo<'info>,
    #[account(mut)]
    pub freeze_authority: AccountInfo<'info>,
    pub rent: AccountInfo<'info>,
    pub token_program: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct InitializeTokenMint<'info> {
    pub mint: AccountInfo<'info>,
    pub rent: AccountInfo<'info>,
    pub token_program: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct MintCreatorToken<'info> {
    #[account(mut)]
    mint: CpiAccount<'info, Mint>,
    auth: AccountInfo<'info>,
    #[account(signer)]
    owner: AccountInfo<'info>,
    #[account(mut)]
    tokens: AccountInfo<'info>,
    token_program: AccountInfo<'info>,
    rent: Sysvar<'info, Rent>,
}
#[derive(Accounts)]
pub struct MintCreatorTokenTo<'info> {
    #[account(signer)]
    pub authority: AccountInfo<'info>,
    #[account(mut)]
    pub mint: AccountInfo<'info>,
    #[account(mut)]
    pub to: AccountInfo<'info>,
    pub token_program: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct BurnCreatorToken<'info> {
    #[account(signer)]
    pub authority: AccountInfo<'info>,
    #[account(mut)]
    pub mint: AccountInfo<'info>,
    #[account(mut)]
    pub to: AccountInfo<'info>,
    pub token_program: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct TransferCreatorToken<'info> {
    #[account(signer)]
    pub authority: AccountInfo<'info>,
    #[account(mut)]
    pub from: AccountInfo<'info>,
    #[account(mut)]
    pub to: AccountInfo<'info>,
    pub token_program: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct SetCreatorAuthority<'info> {
    #[account(signer)]
    pub current_authority: AccountInfo<'info>,
    #[account(mut)]
    pub account_or_mint: AccountInfo<'info>,
    pub token_program: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct InitializeCreatorTokenMint<'info> {
    pub mint: AccountInfo<'info>,
    pub rent: AccountInfo<'info>,
}

impl<'a, 'b, 'c, 'info> From<&mut InitializeTokenAccount<'info>>
    for CpiContext<'a, 'b, 'c, 'info, InitializeAccount<'info>>
{
    fn from(accounts: &mut InitializeTokenAccount<'info>) -> CpiContext<'a, 'b, 'c, 'info, InitializeAccount<'info>> {
        let cpi_accounts = InitializeAccount {
            authority: accounts.authority.clone(),
            account: accounts.account.clone(),
            mint: accounts.mint.clone(),
            rent: accounts.rent.clone(),
        };
        let cpi_program = accounts.token_program.clone();
        CpiContext::new(cpi_program, cpi_accounts)
    }
}

impl<'a, 'b, 'c, 'info> From<&mut MintCreatorTokenTo<'info>>
    for CpiContext<'a, 'b, 'c, 'info, MintTo<'info>>
{
    fn from(accounts: &mut MintCreatorTokenTo<'info>) -> CpiContext<'a, 'b, 'c, 'info, MintTo<'info>> {
        let cpi_accounts = MintTo {
            mint: accounts.mint.clone(),
            to: accounts.to.clone(),
            authority: accounts.authority.clone(),
        };
        let cpi_program = accounts.token_program.clone();
        CpiContext::new(cpi_program, cpi_accounts)
    }
}

impl<'a, 'b, 'c, 'info> From<&mut BurnCreatorToken<'info>> for CpiContext<'a, 'b, 'c, 'info, Burn<'info>> {
    fn from(accounts: &mut BurnCreatorToken<'info>) -> CpiContext<'a, 'b, 'c, 'info, Burn<'info>> {
        let cpi_accounts = Burn {
            mint: accounts.mint.clone(),
            to: accounts.to.clone(),
            authority: accounts.authority.clone(),
        };
        let cpi_program = accounts.token_program.clone();
        CpiContext::new(cpi_program, cpi_accounts)
    }
}

impl<'a, 'b, 'c, 'info> From<&mut TransferCreatorToken<'info>>
    for CpiContext<'a, 'b, 'c, 'info, Transfer<'info>>
{
    fn from(accounts: &mut TransferCreatorToken<'info>) -> CpiContext<'a, 'b, 'c, 'info, Transfer<'info>> {
        let cpi_accounts = Transfer {
            from: accounts.from.clone(),
            to: accounts.to.clone(),
            authority: accounts.authority.clone(),
        };
        let cpi_program = accounts.token_program.clone();
        CpiContext::new(cpi_program, cpi_accounts)
    }
}

impl<'a, 'b, 'c, 'info> From<&mut SetCreatorAuthority<'info>>
    for CpiContext<'a, 'b, 'c, 'info, SetAuthority<'info>>
{
    fn from(
        accounts: &mut SetCreatorAuthority<'info>,
    ) -> CpiContext<'a, 'b, 'c, 'info, SetAuthority<'info>> {
        let cpi_accounts = SetAuthority {
            account_or_mint: accounts.account_or_mint.clone(),
            current_authority: accounts.current_authority.clone(),
        };
        let cpi_program = accounts.token_program.clone();
        CpiContext::new(cpi_program, cpi_accounts)
    }
}

impl<'a, 'b, 'c, 'info> From<&mut InitializeTokenMint<'info>> for CpiContext<'a, 'b, 'c, 'info, InitializeMint<'info>> {
    fn from(accounts: &mut InitializeTokenMint<'info>) -> CpiContext<'a, 'b, 'c, 'info, InitializeMint<'info>> {
        let cpi_accounts = InitializeMint {
            mint: accounts.mint.clone(),
            rent: accounts.rent.clone(),
        };
        let cpi_program = accounts.token_program.clone();
        CpiContext::new(cpi_program, cpi_accounts)
    }
}

impl From<AuthorityType> for spl_token::instruction::AuthorityType {
    fn from(authority_ty: AuthorityType) -> spl_token::instruction::AuthorityType {
        match authority_ty {
            AuthorityType::MintTokens => spl_token::instruction::AuthorityType::MintTokens,
            AuthorityType::FreezeAccount => spl_token::instruction::AuthorityType::FreezeAccount,
            AuthorityType::AccountOwner => spl_token::instruction::AuthorityType::AccountOwner,
            AuthorityType::CloseAccount => spl_token::instruction::AuthorityType::CloseAccount,
        }
    }
}