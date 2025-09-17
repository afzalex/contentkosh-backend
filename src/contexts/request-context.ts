import { AsyncLocalStorage } from 'async_hooks';
import { IUser } from '../dtos/auth.dto';

export interface RequestContextData {
  user: IUser | undefined;
}

const asyncLocalStorage = new AsyncLocalStorage<RequestContextData>();

export const requestContext = {
  run: (data: RequestContextData, callback: () => void) => {
    asyncLocalStorage.run(data, callback);
  },

  get: (): RequestContextData | undefined => {
    return asyncLocalStorage.getStore();
  },

  setUser: (user: RequestContextData['user']) => {
    const store = asyncLocalStorage.getStore();
    if (store) {
      store.user = user;
    }
  },

  getUser: (): IUser => {
    const store = asyncLocalStorage.getStore();
    if (!store) {
      throw new Error('Request context not found');
    }
    if (!store.user) {
      throw new Error('User not found in request context');
    }
    return store.user;
  },

  getOptionalUser: (): IUser | undefined => {
    const store = asyncLocalStorage.getStore();
    return store?.user;
  }
};
