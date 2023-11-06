import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import { persistStore, persistCombineReducers } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createSagaMiddleware from 'redux-saga';

import rootReducer from '../reducers';
import rootSaga from '../sagas';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['debug', 'user', 'wishlist'],
  blacklist: ['network', 'course', 'productIAP'],
};

const persistedReducer = persistCombineReducers(persistConfig, rootReducer);
const sagaMiddleware = createSagaMiddleware();

export default function configStore() {
  const store = createStore(persistedReducer, applyMiddleware(sagaMiddleware));

  sagaMiddleware.run(rootSaga);

  const persistor = persistStore(store);

  return { store, persistor };
}
