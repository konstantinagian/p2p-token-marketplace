use anchor_lang::prelude::*;
use anchor_spl::token::Token;

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

#[account]
pub struct Marketplace {
    admin: Pubkey,
    fee: u16, // if we want to charge a fee in each sale
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
