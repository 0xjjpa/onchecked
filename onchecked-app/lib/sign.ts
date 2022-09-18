import { verifyTypedData, verifyMessage, arrayify, solidityPack, solidityKeccak256 } from 'ethers/lib/utils'
import { Chain, chain } from 'wagmi'
import { customLocalhost, ONCHECKED_SIGN_DOMAIN, ONCHECKED_SIGN_TYPES, POE_CONTRACTS, POE_CONTRACTS_BLOCK } from '../constants/sign'

export const verifyTypedSignature = ({ signature, message, address }: { signature: string, message: Record<string, any>, address: string }): boolean => {
  return verifyTypedData(
    ONCHECKED_SIGN_DOMAIN, ONCHECKED_SIGN_TYPES, message, signature,
  ).toLowerCase() === address.toLowerCase()
}

export const verifySignature = ({ signature, message, address }: { signature: string, message: string, address: string }): boolean => {
  const encodedMessage = solidityPack(["string"], [message]);
  const hashedMessage = solidityKeccak256(["bytes"], [encodedMessage]);
  return verifyMessage(arrayify(hashedMessage), signature).toLowerCase() === address.toLowerCase()
}

export const getPoEAddress = (chain: Chain): string | undefined => { 
  return POE_CONTRACTS[chain.id];
};

export const getPoEDeployedBlock =  (chain: Chain): number | undefined => {
  return POE_CONTRACTS_BLOCK[chain.id];
}
