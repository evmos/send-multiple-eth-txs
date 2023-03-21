import { wallet, provider, chainId } from './params.js'
import { parse } from '@ethersproject/transactions'

export const createSignedEthTx = async (nonce: number) => {
  let tx = {
    from: wallet.address,
    to: '0xbcf6368dF2C2999893064aDe8C4a4b1b6d3C077B',
    value: '0x01',
    data: '0x',
    nonce,
    accessList: [],
    type: 2,
    chainId,
  }

  const gasLimit = await provider.estimateGas(tx)
  tx['gasLimit'] = gasLimit.toHexString()

  const gasFee = await provider.getFeeData()
  tx['maxPriorityFeePerGas'] = gasFee.maxPriorityFeePerGas.toHexString()
  tx['maxFeePerGas'] = gasFee.maxFeePerGas.toHexString()

  const rlpSignedTx = await wallet.signTransaction(tx)

  console.log(rlpSignedTx)

  console.log(parse(rlpSignedTx))

  return parse(rlpSignedTx)
}
