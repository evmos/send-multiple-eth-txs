import { Proto, createAnyMessage, bytesToDynamicFeeTx, createTransactionWithMultipleMessages, createTxRaw } from '@evmos/proto'
import { JsonRpcProvider } from '@ethersproject/providers'
import { BigNumber } from '@ethersproject/bignumber'
import { parse, Transaction } from '@ethersproject/transactions'
import { parseEther } from '@ethersproject/units'
import { wallet, denom, chainInfo, chainId, jsonRPCEndpoint, restEndpoint } from './params.js'
import { signDirect, getPubKey } from './signer.js'
import { broadcastTx } from './provider.js'

const provider = new JsonRpcProvider(jsonRPCEndpoint)

const createSignedEthTx = async (nonce: number) => {
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

const convertEthTxToProtoAny = (tx: Transaction) => {
  const nonce = BigInt(tx.nonce)
  const gasTipCap = tx.maxPriorityFeePerGas.toString()
  const gasFeeCap = tx.maxFeePerGas.toString()
  const gas = BigInt(BigNumber.from(tx.gasLimit).toString())
  const v = tx.v === 0 ? hexToBytes('0x00') : hexToBytes('0x01')

  const payload = new Proto.Ethermint.EVM.Tx.DynamicFeeTx({
    chainId: tx.chainId.toString(),
    nonce,
    gasTipCap,
    gasFeeCap,
    gas,
    to: tx.to,
    value: tx.value.toHexString(),
    data: hexToBytes(tx.data),
    v,
    r: hexToBytes(tx.r),
    s: hexToBytes(tx.s),
  })

  console.log(payload)

  return createAnyMessage({
    message: payload,
    path: Proto.Ethermint.EVM.Tx.DynamicFeeTx.typeName
  })
}

const hexToBytes = (hex: string) => {
  return Buffer.from(hex.replace('0x', ''), 'hex')
}

const createMsgEthereumTx = (protoAny: any, hash: string) => {
  const msg = new Proto.Ethermint.EVM.Tx.MsgEthereumTx({
    data: protoAny,
    hash,
  })

  console.log(msg)

  return {
    message: msg,
    path: Proto.Ethermint.EVM.Tx.MsgEthereumTx.typeName
  }
}

const createCosmosTx = (ethTx: Transaction, msgs: any[]) => {
  const cost = ethTx.maxFeePerGas.mul(ethTx.gasLimit).toString()
  const pubkey = getPubKey()
  const payload = createTransactionWithMultipleMessages(
    msgs,
    '',
    cost,
    denom,
    parseInt(ethTx.gasLimit.toString(), 10),
    '',
    '',
    0,
    1,
    chainInfo.cosmosChainId,
  )

  const extension = createAnyMessage({
    message: new Proto.Ethermint.EVM.Tx.ExtensionOptionsEthereumTx(),
    path: Proto.Ethermint.EVM.Tx.ExtensionOptionsEthereumTx.typeName 
  })
  payload.signDirect.body.extensionOptions.push(extension)

  payload.signDirect.authInfo.signerInfos = []

  const tx = createTxRaw(
    payload.signDirect.body.toBinary(),
    payload.signDirect.authInfo.toBinary(),
    []
  );

  return tx
}

const sendSignedEthTx = async (ethTx: string) => {
  await provider.sendTransaction(ethTx)
}

const test = async () => {
  const tx = await createSignedEthTx(0)
//  const result = await sendSignedEthTx(tx)
//  console.log(result)

  const anyObj = convertEthTxToProtoAny(tx)
  const msgEthereumTx = createMsgEthereumTx(anyObj, tx.hash)
//  console.log(msgEthereumTx)
  const cosmosTx = createCosmosTx(tx, [msgEthereumTx])

  const response = await broadcastTx(cosmosTx)
  console.log(response)
}

test()

// const createMsgEthereumTx = () => {
// 
//   return new Proto.Ethermint.EVM.Tx.MsgEthereumTx({
//     
//   })
// }
