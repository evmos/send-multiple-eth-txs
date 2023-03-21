import { createSignedEthTx } from './ethereum.js'
import { wrapEthTxsInCosmosTx } from './cosmosTx.js'
import { broadcastTx } from './provider.js'

const run = async () => {
  const tx = await createSignedEthTx(0)

  const cosmosTx = wrapEthTxsInCosmosTx([tx])

  const response = await broadcastTx(cosmosTx)
  console.log(response)
}

run()
