/* eslint-disable camelcase */
import {
  generateEndpointAccount,
  AccountResponse,
} from '@evmos/provider'
import { ethToEvmos } from '@evmos/address-converter'
import fetch from 'node-fetch'
import { wallet, restEndpoint } from './params.js'

const restOptions = {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
}

const fetchSenderInfo = async (address: string) => {
  const queryEndpoint = `${restEndpoint}${generateEndpointAccount(address)}`
  const rawResult = await fetch(queryEndpoint, restOptions)

  const result = (await rawResult.json()) as AccountResponse

  return result
}

export const fetchSenderNonce = async () => {
  const address = ethToEvmos(wallet.address)
  const result = await fetchSenderInfo(address)

  const sequence = result.account.base_account.sequence

  return parseInt(sequence, 10)
}
