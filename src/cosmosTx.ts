import {
  Proto,
  createAnyMessage,
  createTransactionWithMultipleMessages,
  createTxRaw,
} from '@evmos/proto'
import { BigNumber } from '@ethersproject/bignumber'
import { Transaction } from '@ethersproject/transactions'
import { wallet, denom, chainInfo } from './params.js'
import { hexToBytes } from './common.js'
import { ethToMsgEthereumTx } from './convert.js'

const { TxBody, AuthInfo } = Proto.Cosmos.Transactions.Tx
const { ExtensionOptionsEthereumTx } = Proto.Ethermint.EVM.Tx

export const wrapEthTxsInCosmosTx = (txs: Transaction[]) => {
  const msgs = txs.map(ethTx => ethToMsgEthereumTx(ethTx))
  const [fees, gas] = computeFeesAndGas(txs)

  const payload = createTx(msgs, fees, gas)

  const { signDirect } = payload

  formatTxFields(signDirect.body, signDirect.authInfo)

  return createTxRaw(
    signDirect.body.toBinary(),
    signDirect.authInfo.toBinary(),
    [],
  )
}

const computeFeesAndGas = (txs: Transaction[]) => {
  let totalFee = BigNumber.from(0)
  let totalGas = BigNumber.from(0)

  txs.forEach(ethTx => {
    const fee = ethTx.maxFeePerGas.mul(ethTx.gasLimit)
    totalFee = totalFee.add(fee)
    totalGas = totalGas.add(ethTx.gasLimit)
  })

  return [totalFee.toString(), totalGas.toString()]
}

const createTx = (msgs: any[], fees: string, gas: string) => {
  return createTransactionWithMultipleMessages(
    msgs,
    '', // Memo is not needed
    fees,
    denom,
    parseInt(gas, 10),
    '', // Algo can be blank
    '', // PubKey can be blank
    0, // Sequence is not needed
    0, // Account number is not needed
    chainInfo.cosmosChainId,
  )
}

const formatTxFields = (
  body: InstanceType<typeof TxBody>,
  authInfo: InstanceType<typeof AuthInfo>,
) => {
  const extension = createAnyMessage({
    message: new ExtensionOptionsEthereumTx(),
    path: ExtensionOptionsEthereumTx.typeName,
  })

  body.extensionOptions.push(extension)
  authInfo.signerInfos = []
}
