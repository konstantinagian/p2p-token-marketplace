use anchor_lang::prelude::*;
use anchor_spl::{token::{Token, Mint, TokenAccount, Transfer, transfer}, associated_token::AssociatedToken};

declare_id!("2xnGNsckC4PcvmDUmUz7dM9hNHCAFmxfk8W3iT8TX4iQ");

#[program]
pub mod marketplace {

    use super::*;

    pub fn initialize(ctx: Context<Initialize>, name: String, fee: u16) -> Result<()> {
        ctx.accounts.marketplace.set_inner(Marketplace {
            admin: ctx.accounts.admin.key(),
            fee,
            name,
        });

        Ok(())
    }

    pub fn list(ctx: Context<List>, price: u64, amount: u64) -> Result<()> {
        ctx.accounts.listing.set_inner(Listing {
            maker: ctx.accounts.maker.key(),
            mint: ctx.accounts.mint.key(),
            price,
        });

        // Send the token into the listing vault
        let transfer_accounts = Transfer {
            from: ctx.accounts.maker_ata.to_account_info(),
            to: ctx.accounts.listing_vault.to_account_info(),
            authority: ctx.accounts.maker.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), transfer_accounts);

        transfer(cpi_ctx, amount)
    }
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct Initialize<'info> {
    #[account(mut)]
    admin: Signer<'info>,
    #[account(
        init,
        space = Marketplace::INIT_SPACE,
        payer = admin,
        seeds = [b"marketplace", name.as_str().as_bytes()],
        bump
    )]
    marketplace: Account<'info, Marketplace>,
    #[account(
        seeds = [b"treasury", marketplace.key().as_ref()],
        bump,
    )]
    treasury: SystemAccount<'info>, // for our fees to go into
    system_program: Program<'info, System>,
    token_program: Program<'info, Token>,
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct List<'info> {
    #[account(mut)]
    maker: Signer<'info>,
    mint: Account<'info, Mint>,
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = maker
    )]
    maker_ata: Account<'info, TokenAccount>,
    #[account(
        seeds = [b"marketplace", name.as_str().as_bytes()],
        bump
    )]
    marketplace: Account<'info, Marketplace>,
    #[account(
        init,
        payer = maker,
        space = Listing::INIT_SPACE,
        seeds = [b"listing", marketplace.key().as_ref()],
        bump
    )]
    listing: Account<'info, Listing>,
    #[account(
        init,
        payer = maker,
        associated_token::mint = mint,
        associated_token::authority = listing
    )]
    listing_vault: Account<'info, TokenAccount>,
    associated_token_program: Program<'info, AssociatedToken>,
    system_program: Program<'info, System>,
    token_program: Program<'info, Token>,
}

#[account]
pub struct Marketplace {
    admin: Pubkey,
    fee: u16, // if we want to charge a fee in each sale (percentage)
    name: String,
}

#[account]
pub struct Listing {
    maker: Pubkey,
    mint: Pubkey,
    price: u64,
}

impl Space for Marketplace {
    const INIT_SPACE: usize = 8 + 32 + 2 + (4 + 32); // max length of 32 for the name
}

impl Space for Listing {
    const INIT_SPACE: usize = 8 + 32 + 32 + 8;
}
