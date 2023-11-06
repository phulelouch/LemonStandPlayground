/* eslint-disable no-undef */
import moment from 'moment';

export function ConvertToDateTime(timeUTC, timezone = '+07:00') {
  const format = 'YYYY/MM/DD HH:mm:ss ZZ';
  moment.updateLocale('en', {
    meridiem(hour, minute) {
      if (hour < 12 && minute < 59) {
        return 'SA';
      }
      return 'CH';
    },
  });
  return moment(timeUTC, format).utcOffset(timezone).format('HH:mm DD-MM-YYYY');
}

export function ConvertToDate(datetime) {
  return moment(datetime, 'YYYY-MM-DDTHH:mm:ss').fromNow();
}

export function ConvertToDay(timeUTC, timezone = '+07:00') {
  const format = 'YYYY/MM/DD HH:mm:ss ZZ';
  return moment(timeUTC, format).utcOffset(timezone).format('DD/MM/YYYY');
}
export function ConvertToHour(timeUTC, timezone = '+07:00') {
  const format = 'YYYY/MM/DD HH:mm:ss ZZ';
  moment.updateLocale('en', {
    meridiem(hour, minute) {
      if (hour < 12 && minute < 59) {
        return 'SA';
      }
      return 'CH';
    },
  });
  return moment(timeUTC, format).utcOffset(timezone).format('hh:mm a');
}

export const formatDateNow = (time) => {
  if (moment(time).format('Y') === moment().format('Y')) {
    if (moment(time).format('MMDD') === moment().format('MMDD')) {
      return moment(time).second(1).locale('vi').fromNow();
    }
    return moment(time).format('DD [tháng] MM');
  }
  return moment(time).format('DD [tháng] MM, Y');
};
export const secondsToHms = (d) => {
  const time = Number(d);

  const hour = new Date(time * 1000).getUTCHours();
  let numberCut = 11;
  lengthCut = 8;
  if (hour === 0) {
    numberCut = 14;
    lengthCut = 5;
  }

  const callTimeCount = new Date(time * 1000)
    .toISOString()
    .substr(numberCut, lengthCut);
  return callTimeCount;
};
