## Attention

### Summary

This repository belongs to Piraterealm team.
Main content is about creating Pirate collection and minting Ships (as NFT) via Metaplex SDK, serving Piraterealm game.
The ticket for `Blowfish Review Team Associate` is `3034`

### About

- The link of the Game: `https://piraterealm.io`
- The link of the Dapp Game: `https://app.piraterealm.io` (We cannot get - content directly from Browser, since it's only serving via Telegram Miniapp)
- The link of Telegram Miniapp: `https://t.me/pirate_realm_bot`

### Setup

Put environments config in `.env`

### First step:

Create NFT collection

```
ts-node ./src/app.ts
```

### Second step:

Create CandyMachine with current collection

```
ts-node ./src/create.ts
```

### Third step:

Update CandyManchine metadata/guards

```
ts-node ./src/update.ts
```
