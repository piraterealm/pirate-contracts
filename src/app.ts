import { Connection, Keypair } from '@solana/web3.js';
import { Metaplex, keypairIdentity } from '@metaplex-foundation/js';
import bs58 from 'bs58';
import dotenv from 'dotenv';
import { getAddress, getKey, getNetwork, getUpdaterKey } from './getKey';
import fs from 'fs';

import path from 'path';

dotenv.config();

const secretKey = getKey();
const address = getAddress();

const endpoint = getNetwork();
const SOLANA_CONNECTION = new Connection(endpoint);

const WALLET = Keypair.fromSecretKey(bs58.decode(secretKey));

const NFT_METADATA =
  'https://paksvmh74t3sbjsleg7zil7fskc2urih5qeoivhepsomizlfisra.arweave.net/eBUqsP_k9yCmSyG_lC_lkoWqRQfsCORU5HycxGVlRKI';

const METAPLEX = Metaplex.make(SOLANA_CONNECTION).use(keypairIdentity(WALLET));

const updaterKey = getUpdaterKey();

const UPDATER_WALLET = Keypair.fromSecretKey(bs58.decode(updaterKey));

async function createCollectionNft() {
  const { nft: collectionNft } = await METAPLEX.nfts().create({
    name: "Pirate Realm's Ship Armada",
    symbol: 'PRSA',
    uri: NFT_METADATA,
    sellerFeeBasisPoints: 0,
    isCollection: true,
    updateAuthority: UPDATER_WALLET,
  });

  console.log(
    `✅ - Minted Collection NFT: ${collectionNft.address.toString()}`
  );
  console.log(
    `     https://explorer.solana.com/address/${collectionNft.address.toString()}?cluster=devnet`
  );
  address.collection = collectionNft.address.toString();
  const paths = path.join(
    __dirname,
    '.',
    'metadata',
    `${process.env.ENV_NODE!}.address.json`
  );
  fs.writeFile(paths, JSON.stringify(address), function (err) {
    console.log(err);
  });
}

createCollectionNft();
