import { errors } from 'ethers'
import type { NextApiRequest, NextApiResponse } from 'next'


type ProofsDataResponse = {
  response?: {
    signer: string,
    cosigner: string,
    transaction: string
  }
  status?: string
  err?: string
}

const { COVALENT_API_KEY } = process.env

export default async function handler(req: NextApiRequest, res: NextApiResponse<ProofsDataResponse | string>) {
  const {
    method,
    query: { contractAddress, initialBlock }
  } = req
  if (method != 'GET') return res.status(405).json({ err: 'Only GET method allowed' })
  if (!COVALENT_API_KEY) return res.status(501).json({ err: 'No Covalent API key loaded'})
  //@TODO Fail if no contract nor initial block.
  const { data } = await (await fetch(`https://api.covalenthq.com/v1/80001/events/address/${contractAddress}/?quote-currency=USD&format=JSON&starting-block=${initialBlock}&ending-block=latest&key=${COVALENT_API_KEY}`)).json()
  const { items } = data;

  console.log("Event Logs", items);

  try {
    return res.status(200).json({ response: { signer: contractAddress ? contractAddress.toString() : '0x0', cosigner: '0x0', transaction: '0x0' } })
  } catch (err: any) {
    if (err.code == errors.INVALID_ARGUMENT) return res.status(422).json({ err: 'Address given is incorrect' })
  }
}