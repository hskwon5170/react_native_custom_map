// 로컬스토리지 사용법과 유사하지만 대신 async/await을 사용해야함
import EncryptedStorage from 'react-native-encrypted-storage';

const setEncryptStorage = async <T>(key: string, data: T) => {
  await EncryptedStorage.setItem(key, JSON.stringify(data));
};

const getEncryptStorage = async (key: string) => {
  const storedData = await EncryptedStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : null;
};

const removeEncryptStorage = async (key: string) => {
  const data = await getEncryptStorage(key);
  if (data) {
    await EncryptedStorage.removeItem(key);
  }
};

export {getEncryptStorage, removeEncryptStorage, setEncryptStorage};
