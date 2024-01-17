'use client';

import { PublicKey } from '@solana/web3.js';
import { useState, useMemo } from 'react';
import { AppModal } from '../ui/ui-layout';
import { useGetTokenAccounts } from '../account/account-data-access';
import { AccountTokenBalance } from '../account/account-ui';

export function ListingModal({
    hideModal,
    show,
    address
  }: {
    hideModal: () => void;
    show: boolean;
    address: PublicKey;
  }) {

    const query = useGetTokenAccounts({ address });
    const items = useMemo(() => {
      return query.data;
    }, [query.data]);

    // const [tokenAccount, setTokenAccount] = useState('');
    // const [tokenMint, setTokenMint] = useState('');
    const [itemIndex, setItemIndex] = useState(0);

    return (
      <AppModal
        title={'List Token'}
        hide={hideModal}
        show={show}
        submit={() => {
        //   listToken();
          hideModal();
        }}
        submitLabel="List"
      >
        <select
          className="select select-bordered w-full"
          // value={tokenAccount ?? 0}
          onChange={e => {
            setItemIndex(e.target.selectedIndex)
            // setTokenAccount(e.target.value)
            // setTokenMint(e.target.querySelectorAll('option')[e.target.selectedIndex].getAttribute('data-mint') ?? '')
          }}
        >
          <option value={undefined}>Select a token</option>
          {items?.map(({ account, pubkey }, index) =>
            <option value={pubkey.toString()} key={index} data-mint={account.data.parsed.info.mint.toString()}>{account.data.parsed.info.mint.toString()}</option>)}

        </select>

        {items && itemIndex > 0 && (
          <div className='text-left'>
            <h2 className='font-bold'>Mint:</h2>
            <div className=''>{items[itemIndex - 1].account.data.parsed.info.mint.toString()}</div>
            <h2 className='font-bold'>Token Account:</h2>
            <div className=''>{items[itemIndex - 1].pubkey.toString()}</div>
            <h2 className='font-bold'>Your Balance:</h2>
            <AccountTokenBalance address={items[itemIndex - 1].pubkey} />
          </div>
        )}
      </AppModal>
    );
  }
