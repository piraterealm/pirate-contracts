import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { Metaplex, keypairIdentity, sol } from '@metaplex-foundation/js';
import bs58 from 'bs58';
import { getMerkleRoot } from '@metaplex-foundation/mpl-candy-machine';
import { getAddress, getCreator, getKey, getNetwork } from './getKey';

const secretKey = getKey();

const destination = getCreator();
const address = getAddress();

const endpoint = getNetwork();
const SOLANA_CONNECTION = new Connection(endpoint);

const WALLET = Keypair.fromSecretKey(bs58.decode(secretKey));

const CANDY_MACHINE_ID = address.candyMachine;

const METAPLEX = Metaplex.make(SOLANA_CONNECTION).use(keypairIdentity(WALLET));

async function updateCandyMachine() {
  const allowList = [];

  const minterList = [WALLET.publicKey.toString()];

  const candyMachine = await METAPLEX.candyMachines().findByAddress({
    address: new PublicKey(CANDY_MACHINE_ID),
  });

  const { response } = await METAPLEX.candyMachines().update({
    candyMachine,
    groups: [
      {
        label: 'NORM',
        guards: {
          solPayment: {
            amount: sol(0.55),
            destination: new PublicKey(destination),
          },
          redeemedAmount: { maximum: 5000 },
        },
      },
      {
        label: 'WHLIST',
        guards: {
          allowList: {
            merkleRoot: getMerkleRoot(allowList),
          },
          mintLimit: { id: 1, limit: 1 },
        },
      },
      {
        label: 'COIN',
        guards: {
          allowList: {
            merkleRoot: getMerkleRoot(minterList),
          },
        },
      },
    ],
  });

  console.log(`✅ - Updated Candy Machine: ${CANDY_MACHINE_ID}`);
  console.log(
    `     https://explorer.solana.com/tx/${response.signature}?cluster=devnet`
  );
}

updateCandyMachine();
