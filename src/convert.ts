import { Proto, createAnyMessage } from '@evmos/proto'
import { Transaction } from '@ethersproject/transactions'
import { BigNumber } from '@ethersproject/bignumber'
import { hexToBytes } from './common.js'

const { DynamicFeeTx, MsgEthereumTx } = Proto.Ethermint.EVM.Tx

export const ethToMsgEthereumTx = (ethTx: Transaction) => {
  const dynamicFeeTx = ethToDynamicFeeTx(ethTx)
  const txAsProtoAny = dynamicFeeToProtoAny(dynamicFeeTx)
  return createMsgEthereumTx(txAsProtoAny, ethTx.hash)
}

const ethToDynamicFeeTx = (tx: Transaction) => {
  const nonce = BigInt(tx.nonce)
  const gasTipCap = tx.maxPriorityFeePerGas.toString()
  const gasFeeCap = tx.maxFeePerGas.toString()
  const gas = BigInt(BigNumber.from(tx.gasLimit).toString())
  const v = tx.v === 0 ? hexToBytes('0x00') : hexToBytes('0x01')

  return new DynamicFeeTx({
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
}

const dynamicFeeToProtoAny = (
  payload: InstanceType<typeof DynamicFeeTx>,
) => {
  return createAnyMessage({
    message: payload,
    path: DynamicFeeTx.typeName
  })
}

const createMsgEthereumTx = (protoAny: any, txHash: string) => {
  const msg = new MsgEthereumTx({
    data: protoAny,
    hash: txHash,
  })

  return {
    message: msg,
    path: MsgEthereumTx.typeName
  }
}

