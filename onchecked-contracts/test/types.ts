import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import type { PoE } from "../src/types/PoE";

type Fixture<T> = () => Promise<T>;

declare module "mocha" {
  export interface Context {
    poe: PoE;
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    signers: Signers;
  }
}

export interface Signers {
  admin: SignerWithAddress;
}
