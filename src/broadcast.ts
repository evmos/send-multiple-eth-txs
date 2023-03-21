import { fetchSenderNonce } from './query.js'
import { createSignedEthTx, queryEthHash } from './ethereum.js'
import { wrapEthTxsInCosmosTx } from './cosmosTx.js'
import { broadcastTx } from './provider.js'

const run = async () => {
  const nonce = await fetchSenderNonce()

  const txs = [
    await createSignedEthTx(nonce),
    await createSignedEthTx(nonce + 1),
    await createSignedEthTx(nonce + 2),
  ]

  const cosmosTx = wrapEthTxsInCosmosTx(txs)

  const response = await broadcastTx(cosmosTx)

  console.log('\nBroadcast Response:')
  console.log(response)

  // Wait for Eth transactions to resolve before querying
  await new Promise(resolve => setTimeout(resolve, 5000))

  txs.forEach(async tx => {
    const result = await queryEthHash(tx.hash)
    console.log('\nEthereum Tx Results (Expect status === 1)')
    console.log(result)
  })
}

run()
