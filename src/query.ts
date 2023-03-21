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

export const fetchSenderInfo = async () => {
  const address = ethToEvmos(wallet.address)

  const queryEndpoint = `${restEndpoint}${generateEndpointAccount(address)}`
  const rawResult = await fetch(queryEndpoint, restOptions)

  const result = (await rawResult.json()) as AccountResponse

  console.log(result)

  return result
}
