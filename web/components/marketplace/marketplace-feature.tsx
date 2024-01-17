'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from '../solana/solana-provider';
import { AppHero } from '../ui/ui-layout';
import { ListingModal } from './marketplace-ui';
// import { useMarketplaceProgram } from './marketplace-data-access';

export default function MarketplaceFeature() {
  const { publicKey } = useWallet();
//   const { programId } = useMarketplaceProgram();
    const [showModal, setShowModal] = useState(false);

  return publicKey ? (
    <div className='text-center'>
      <AppHero
        title="Marketplace"
        subtitle={
          'List your SPL tokens for other users to buy'
        }
      >
        </AppHero>
        <button
          className="btn btn-xs lg:btn-md btn-primary"
          onClick={() => setShowModal(true)}
        >
          + List Token
        </button>
        <ListingModal
          show={showModal}
          hideModal={() => setShowModal(false)}
          address={publicKey}
        />
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
