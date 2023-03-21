import { Wallet } from '@ethersproject/wallet'
import { JsonRpcProvider } from '@ethersproject/providers'

const mnemonic = 'inmate snack that position deliver hybrid gasp open that wrestle siege goddess'
export const wallet = Wallet.fromMnemonic(mnemonic)

export const jsonRPCEndpoint = 'http://localhost:8545'
export const restEndpoint = 'http://localhost:1317'
export const provider = new JsonRpcProvider(jsonRPCEndpoint)

export const chainId = 9000

export const denom = 'aevmos'

export const chainInfo = {
  chainId,
  cosmosChainId: 'evmos_9000-1',
}
