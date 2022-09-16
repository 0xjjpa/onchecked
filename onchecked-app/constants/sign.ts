export const ONCHECKED_SIGN_DOMAIN = {
  name: 'Onchecked',
  version: '1',
};

export type ONCHECKED_MESSAGE_TYPE = {
  blockhash: string
};

export const ONCHECKED_SIGN_TYPES = {
  Payload: [
    { name: 'blockhash', type: 'string' }
  ],
};