import { Contract, errors } from 'ethers'
import type { NextApiRequest, NextApiResponse } from 'next'
import { PoE__factory } from '../../types'
import { PoE } from '../../types/PoE'

export type Proof = {
  signer: string,
  cosigner: string,
  transaction: string,
  timestamp: string,
  blocknumber: string
  eventType: 'witnessed' | 'attested',
  signedBlocknumber?: string
}
export type ProofsDataResponse = {
  responses?: Proof[]
  status?: string
  err?: string
}

const { COVALENT_API_KEY } = process.env

export default async function handler(req: NextApiRequest, res: NextApiResponse<ProofsDataResponse | string>) {
  const {
    method,
    query: { contractAddress, initialBlock, chainId }
  } = req
  if (method != 'GET') return res.status(405).json({ err: 'Only GET method allowed' })
  if (!COVALENT_API_KEY) return res.status(501).json({ err: 'No Covalent API key loaded' })
  if (!contractAddress) return res.status(501).json({ err: 'No contract address provided' })
  if (!chainId) return res.status(501).json({ err: 'No chainId provided' })
  //@TODO Fail if no contract nor initial block.
  const { data } = await (await fetch(`https://api.covalenthq.com/v1/${chainId}/events/address/${contractAddress}/?quote-currency=USD&format=JSON&starting-block=${initialBlock}&ending-block=latest&key=${COVALENT_API_KEY}`)).json()
  const { items } = data;

  const contract = new Contract(contractAddress.toString(), PoE__factory.abi) as PoE;

  // @TODO: Type Covalent responses
  const responses = items.map((item: any) => {
    // @TODO: This only works cause we got two events only, will break with more.
    try {
      const decodedEvents = contract.interface.decodeEventLog("Witnessed", item.raw_log_data, item.raw_log_topics);
      return ({ signer: decodedEvents.signer, cosigner: decodedEvents.cosigner, transaction: item.tx_hash, timestamp: item.block_signed_at, blocknumber: decodedEvents.blocknumber.toString(), eventType: 'witnessed' })
    } catch (err) {
      const decodedEvents = contract.interface.decodeEventLog("Attested", item.raw_log_data, item.raw_log_topics);
      return ({ signer: decodedEvents.signer, cosigner: decodedEvents.cosigner, transaction: item.tx_hash, timestamp: item.block_signed_at, blocknumber: decodedEvents.blocknumber.toString(), eventType: 'attested', signedBlocknumber: decodedEvents.signedblocknumber.toString() })
    }
  })

  try {
    return res.status(200).json({ responses })
  } catch (err: any) {
    if (err.code == errors.INVALID_ARGUMENT) return res.status(422).json({ err: 'Address given is incorrect' })
  }
}