'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from '../solana/solana-provider';
import { AppHero } from '../ui/ui-layout';
// import { useMarketplaceProgram } from './marketplace-data-access';

export default function MarketplaceFeature() {
  const { publicKey } = useWallet();
//   const { programId } = useMarketplaceProgram();

  return publicKey ? (
    <div>
      <AppHero
        title="Marketplace"
        subtitle={
          'List your SPL tokens for other users to buy'
        }
      >
      </AppHero>
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton />
        </div>
      </div>
    </div>
  );
}
