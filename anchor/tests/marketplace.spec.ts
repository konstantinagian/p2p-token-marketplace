import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair, LAMPORTS_PER_SOL, SystemProgram } from '@solana/web3.js';
import { Marketplace } from '../target/types/marketplace';
import { TOKEN_PROGRAM_ID } from '@coral-xyz/anchor/dist/cjs/utils/token';

describe('marketplace', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.Marketplace as Program<Marketplace>;

  const signer = Keypair.generate();

  const confirm = async (signature: string): Promise<string> => {
    const block = await anchor.getProvider().connection.getLatestBlockhash();
    await anchor.getProvider().connection.confirmTransaction({
      signature,
      ...block
    })
    return signature
  }

  const log = async(signature: string): Promise<string> => {
    console.log(`Your transaction signature: https://explorer.solana.com/transaction/${signature}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`);
    return signature;
  }

  const [marketplace] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("marketplace"),
      Buffer.from("Encode bootcamp marketplace"),
    ],
    program.programId
  );

//   const [treasury] = anchor.web3.PublicKey.findProgramAddressSync(
//     [
//       Buffer.from("treasury"),
//       marketplace.toBuffer(),
//     ],
//     program.programId
//   );

  it("Airdrop",async () => {
    await anchor.getProvider().connection.requestAirdrop(signer.publicKey, 10 * LAMPORTS_PER_SOL)
      .then(confirm)
      .then(log);
  })

  it('Initialize Marketplace', async () => {
    await program.methods
      .initialize("Encode bootcamp marketplace")
      .accounts({
        admin: signer.publicKey,
        marketplace,
        // treasury,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID
      })
      .signers([signer])
      .rpc()
      .then(confirm)
      .then(log);

    // const currentCount = await program.account.counter.fetch(
    //   signer.publicKey
    // );

    // expect(currentCount.count).toEqual(0);
  });

//   it('Increment Counter', async () => {
//     await program.methods
//       .increment()
//       .accounts({ counter: signer.publicKey })
//       .rpc();

//     const currentCount = await program.account.counter.fetch(
//       signer.publicKey
//     );

//     expect(currentCount.count).toEqual(1);
//   });
});
