import {tronLog} from 'app-common';
import {Alert} from 'react-native';
import {SITE_URL} from 'app-config';
import {navigate} from '../navigations/navigations';
import {store} from '../index';
import {saveUserToken, setUser, setOverview} from '../actions/user';

let HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const callRequestWithTimeOut = async request => {
  const promise2 = new Promise(resolve => {
    setTimeout(resolve, 15000, null);
  });

  const resultRace = await new Promise.race([request, promise2]);

  return resultRace;
};

const onResponse = async (request, result) => {
  try {
    const body = await result.text();
    const newBody = JSON.parse(body);

    if (result.status === 401) {
      store.dispatch(saveUserToken(null));
      store.dispatch(setUser(null));
      store.dispatch(setOverview(null));

      Alert.alert('Not logged in', 'Please login to continue.', [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Login',
          onPress: () => navigate('LoginScreen'),
        },
      ]);

      return null;
    }

    // SUCCESS: Return valid response
    return newBody;
  } catch (e) {
    tronLog('onResponseError', result);

    return null;
  }
};

const config = {
  get: async (endpoint, params = {}, randomVersion = true) => {
    const queryParam = {...params};

    if (randomVersion) {
      queryParam.v = Math.floor(Math.random() * 999999999);
    }

    let url = `${SITE_URL}${endpoint}`;

    if (Object.keys(queryParam).length > 0) {
      url += `?${Object.keys(queryParam)
        .map(key => `${key}=${queryParam[key]}`)
        .join('&')}`;
    }

    console.debug(url);

    const options = {
      method: 'GET',
      headers: HEADERS,
    };

    const request = {url, options};
    console.debug(options);
    console.debug(request);

    return callRequestWithTimeOut(
      fetch(url, options).then(result => onResponse(request, result)),
    );
  },

  post: async (endpoint, params = {}) => {
    const url = SITE_URL + endpoint;

    const options = {
      method: 'POST',
      body: JSON.stringify(params),
      headers: HEADERS,
    };

    const request = {
      url,
      options,
    };

    console.debug(url);

    return callRequestWithTimeOut(
      fetch(url, options).then(result => onResponse(request, result)),
    );
  },

  put: async (endpoint, params = {}) => {
    const url = SITE_URL + endpoint;

    const options = {
      method: 'PUT',
      headers: HEADERS,
      body: JSON.stringify(params),
    };

    const request = {
      url,
      options,
    };

    console.debug(url);

    return callRequestWithTimeOut(
      fetch(url, options).then(result => onResponse(request, result)),
    );
  },

  delete: async (endpoint, params = {}) => {
    let url = `${SITE_URL}${endpoint}`;

    if (Object.keys(params).length > 0) {
      url += `?${Object.keys(params)
        .map(key => `${key}=${params[key]}`)
        .join('&')}`;
    }

    const options = {
      method: 'DELETE',
      headers: HEADERS,
    };

    const request = {
      url,
      options,
    };

    console.debug(url);

    return callRequestWithTimeOut(
      fetch(url, options).then(result => onResponse(request, result)),
    );
  },

  multipartPost: async (endpoint, params = {}) => {
    const url = SITE_URL + endpoint;

    const options = {
      method: 'POST',
      body: params,
      headers: {...HEADERS, 'Content-Type': 'multipart/form-data'},
    };

    const request = {
      url,
      options,
    };

    console.debug(url);

    return fetch(url, options).then(result => onResponse(request, result));
  },
};

const getApiUrl = () => SITE_URL;

const setToken = _token => {
  HEADERS = {
    ...HEADERS,
    Authorization: `Bearer ${_token}`,
  };
};

const setClientLocale = (locale = 'en') => {
  HEADERS = {
    ...HEADERS,
    'x-client-locale': locale,
  };
};

export {config, getApiUrl, setToken, setClientLocale};
