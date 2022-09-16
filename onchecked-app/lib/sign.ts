import { verifyTypedData, verifyMessage, arrayify, solidityPack, solidityKeccak256, computeAddress } from 'ethers/lib/utils'
import { ONCHECKED_SIGN_DOMAIN, ONCHECKED_SIGN_TYPES } from '../constants/sign'

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
