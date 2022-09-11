export const ONCHECKED_SIGN_DOMAIN = {
  name: 'Onchecked',
  version: '1',
};

export type ONCHECKED_MESSAGE_TYPE = {
  blocknumber: number,
  blockhash: string
};

export const ONCHECKED_SIGN_TYPES = {
  Payload: [
    { name: 'blocknumber', type: 'int' },
    { name: 'blockhash', type: 'string' }
  ],
};