import {
  ConvertToDateTime,
  ConvertToDay,
  ConvertToHour,
  formatDateNow,
  ConvertToDate,
  secondsToHms,
} from './datetime';
import {ValidateEmail, isURL, isVideo} from './validate';

import {
  ifIphoneX,
  getStatusBarHeight,
  isIphoneXFamilly,
  getBottomSpace,
} from './deviceInfo';
import {tronLog} from './log';

import {deleteFCMToken, registerFCMToken} from './fcmToken';

export {
  // datetime
  ConvertToDateTime,
  ConvertToDay,
  ConvertToHour,
  formatDateNow,
  ConvertToDate,
  secondsToHms,
  //
  ValidateEmail,
  isURL,
  isVideo,

  // Device info
  ifIphoneX,
  getStatusBarHeight,
  isIphoneXFamilly,
  getBottomSpace,
  //
  tronLog,
  deleteFCMToken,
  registerFCMToken,
};
