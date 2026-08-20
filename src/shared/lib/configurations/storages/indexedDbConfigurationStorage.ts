import type { ConfigHelper } from '../types/config';

const DATABASE_NAME = 'goods-return';
const DATABASE_VERSION = 1;
const STORE_NAME = 'configurations';
const mutationQueue = { current: Promise.resolve<unknown>(undefined) };

const openDatabase = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Не удалось открыть IndexedDB'));
    request.onblocked = () => reject(new Error('Открытие IndexedDB заблокировано'));
  });

const executeRequest = <TResult>(
  mode: IDBTransactionMode,
  createRequest: (store: IDBObjectStore) => IDBRequest<TResult>,
) =>
  openDatabase().then(
    (database) =>
      new Promise<TResult>((resolve, reject) => {
        const transaction = database.transaction(STORE_NAME, mode);
        const request = createRequest(transaction.objectStore(STORE_NAME));
        const rejectTransaction = () => {
          database.close();
          reject(transaction.error ?? request.error ?? new Error('Ошибка операции IndexedDB'));
        };

        transaction.oncomplete = () => {
          database.close();
          resolve(request.result);
        };
        transaction.onerror = rejectTransaction;
        transaction.onabort = rejectTransaction;
      }),
  );

const enqueueMutation = <TResult>(mutation: () => Promise<TResult>) => {
  const result = mutationQueue.current.then(mutation, mutation);
  mutationQueue.current = result.catch(() => undefined);
  return result;
};

export const indexedDbConfigHelper: ConfigHelper = {
  async get(key) {
    const value = await executeRequest('readonly', (store) => store.get(key));
    return value ?? null;
  },
  async getKeys() {
    const keys = await executeRequest('readonly', (store) => store.getAllKeys());
    return keys.filter((key): key is string => typeof key === 'string');
  },
  async set<T>(key: string, value: T) {
    await enqueueMutation(() => executeRequest('readwrite', (store) => store.put(value, key)));
  },
  async remove(key) {
    await enqueueMutation(() => executeRequest('readwrite', (store) => store.delete(key)));
  },
};
