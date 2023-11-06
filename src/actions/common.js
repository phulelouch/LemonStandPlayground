/* eslint-disable import/prefer-default-export */
/**
 * @flow
 * Various action creator for common use cases.
 */

import Types from './types';

export function setAppOpen(isAppOpen: boolean = false) {
  return {
    type: Types.SET_APP_OPEN,
    isAppOpen,
  };
}
export function showLoading(
  loading: boolean = true,
  isNative: boolean = false
) {
  return {
    type: Types.SHOW_LOADING,
    data: { loading, isNative },
  };
}
export function setLoading(loading: boolean = true) {
  return {
    type: Types.SET_LOADING,
    loading,
  };
}
