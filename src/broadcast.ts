import { fetchSenderNonce } from './query.js'
import { createSignedEthTx } from './ethereum.js'
import { wrapEthTxsInCosmosTx } from './cosmosTx.js'
import { broadcastTx } from './provider.js'

const run = async () => {
  const sequence = await fetchSenderNonce()

  const tx = await createSignedEthTx(sequence)

  const cosmosTx = wrapEthTxsInCosmosTx([tx])

  const response = await broadcastTx(cosmosTx)

  console.log('\nBroadcast Response:')
  console.log(response)
}

run()
