import Types from './types';

// eslint-disable-next-line import/prefer-default-export
export const saveStatusNetwork = (connection: boolean = true) => ({
  type: Types.NETWORK_STATUS,
  connection,
});
