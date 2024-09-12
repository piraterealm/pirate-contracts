import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import {
  Metaplex,
  keypairIdentity,
  toBigNumber,
  CreateCandyMachineInput,
  DefaultCandyGuardSettings,
} from '@metaplex-foundation/js';
import bs58 from 'bs58';

import {
  getAddress,
  getCreator,
  getKey,
  getNetwork,
  getUpdaterKey,
} from './getKey';
import path from 'path';
import fs from 'fs';

const secretKey = getKey();

const address = getAddress();

const creator = getCreator(); //Address receiver

const endpoint = getNetwork();
const SOLANA_CONNECTION = new Connection(endpoint);

const WALLET = Keypair.fromSecretKey(bs58.decode(secretKey));

const updaterKey = getUpdaterKey();

const UPDATER_WALLET = Keypair.fromSecretKey(bs58.decode(updaterKey));

const COLLECTION_NFT_MINT = address.collection;

const METAPLEX = Metaplex.make(SOLANA_CONNECTION).use(keypairIdentity(WALLET));

const revealData: number[] = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0,
];

async function generateCandyMachine() {
  const candyMachineSettings: CreateCandyMachineInput<DefaultCandyGuardSettings> =
    {
      itemsAvailable: toBigNumber(1000000000), // Collection Size: 3
      sellerFeeBasisPoints: 500, // 5% Royalties on Collection
      symbol: 'PRSA',
      maxEditionSupply: toBigNumber(0), // 0 reproductions of each NFT allowed
      isMutable: true,
      creators: [{ address: new PublicKey(creator), share: 100 }],
      itemSettings: {
        type: 'hidden',
        name: 'Treasure Chest #$ID+1$',
        uri: 'https://backend.piraterealm.io/static/chest.png',
        hash: revealData,
      },
      collection: {
        address: new PublicKey(COLLECTION_NFT_MINT), // Can replace with your own NFT or upload a new one
        updateAuthority: UPDATER_WALLET,
      },
    };
  const { candyMachine } = await METAPLEX.candyMachines().create(
    candyMachineSettings
  );
  console.log(`✅ - Created Candy Machine: ${candyMachine.address.toString()}`);
  console.log(
    `     https://explorer.solana.com/address/${candyMachine.address.toString()}?cluster=devnet`
  );
  address.candyMachine = candyMachine.address.toString();
  const paths = path.join(
    __dirname,
    '.',
    'metadata',
    `${process.env.ENV_NODE}.address.json`
  );
  fs.writeFile(paths, JSON.stringify(address), function (err) {
    console.log(err);
  });
}

generateCandyMachine();
