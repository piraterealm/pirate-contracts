import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import {
  Metaplex,
  keypairIdentity,
  getMerkleProof,
} from '@metaplex-foundation/js';
import bs58 from 'bs58';
import { getAddress, getKey, getNetwork } from './getKey';
import dotenv from 'dotenv';

dotenv.config();

const secretKey = getKey();

const buyer = process.env.BUYER!;

const address = getAddress();

const endpoint = getNetwork();
const SOLANA_CONNECTION = new Connection(endpoint);

const WALLET = Keypair.fromSecretKey(bs58.decode(buyer));

const master = Keypair.fromSecretKey(bs58.decode(secretKey));

const collectionUpdateAuthority = master.publicKey;

const CANDY_MACHINE_ID = address.candyMachine;

const METAPLEX = Metaplex.make(SOLANA_CONNECTION).use(keypairIdentity(WALLET));

const allowList = []; // Replace with your whitelist
const leaf = ''; // Replace with your address

async function mintNft() {
  const candyMachine = await METAPLEX.candyMachines().findByAddress({
    address: new PublicKey(CANDY_MACHINE_ID),
  });

  await METAPLEX.candyMachines().callGuardRoute({
    candyMachine,
    guard: 'allowList',
    group: 'WHLIST',
    settings: {
      path: 'proof',
      merkleProof: getMerkleProof(allowList, leaf),
    },
  });

  let { nft, response } = await METAPLEX.candyMachines().mint(
    {
      candyMachine,
      collectionUpdateAuthority: new PublicKey(collectionUpdateAuthority),
      group: 'WHLIST',
      owner: new PublicKey(leaf),
      guards: {},
    },
    { commitment: 'finalized' }
  );

  console.log(`✅ - Minted NFT: ${nft.address.toString()}`);
  console.log(
    `     https://explorer.solana.com/address/${nft.address.toString()}?cluster=devnet`
  );
  console.log(
    `     https://explorer.solana.com/tx/${response.signature}?cluster=devnet`
  );
}

for (let i = 0; i < 1; i++) {
  mintNft();
}
