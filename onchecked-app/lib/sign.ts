import { verifyTypedData } from 'ethers/lib/utils'
import { ONCHECKED_SIGN_DOMAIN, ONCHECKED_SIGN_TYPES } from '../constants/sign'

export const verifySignature = ({ signature, message, address }: { signature: string, message: Record<string, any>, address: string }): boolean => {
    return verifyTypedData(
        ONCHECKED_SIGN_DOMAIN, ONCHECKED_SIGN_TYPES, message, signature,
    ).toLowerCase() === address.toLowerCase()
}