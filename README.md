# Multiple Ethereum Tx's

Broadcast multiple Ethereum transactions in a single Cosmos transaction.

## Overview

All files are in `/src/`.

- `demo.ts` coordinates the code execution
- `ethereum.ts` generates or queries Ethereum Tx's
- `cosmosTx.ts` wraps Ethereum Tx's in a Cosmos Tx
- `convert.ts` is a helper for `cosmosTx.ts`
- `provider.ts` broadcasts Cosmos Tx's to the node
- `query.ts` queries account information from the node
- `params.ts` stores replaceable information
- `common.ts` contains utility methods

## Run Locally

Start an Evmos local node by running:

```bash
git clone https://github.com/evmos/evmos
cd evmos
./local_node.sh
```

Indicate `y` if prompted.

Populate the balance for the demo account:

```bash
evmosd tx bank send dev0 evmos16famsnv0hqks7z9h60cn052y4t46jhsk20792m 1000000000000000000aevmos --fees 5000000000000000aevmos --home ~/.tmp-evmosd
```

If the request fails, wait for a few seconds, then retry.

Build and run the test script:

```bash
git clone https://github.com/evmos/send-multiple-eth-txs
npm install
npm run start
```
