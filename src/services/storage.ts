import AsyncStorage from '@react-native-async-storage/async-storage';

const keys = {
  token: 'sigev.accessToken',
  bootstrap: 'sigev.bootstrap',
};

export const storage = {
  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem(keys.token);
  },
  async setToken(token: string | null): Promise<void> {
    if (!token) {
      await AsyncStorage.removeItem(keys.token);
      return;
    }

    await AsyncStorage.setItem(keys.token, token);
  },
  async getBootstrap(): Promise<string | null> {
    return AsyncStorage.getItem(keys.bootstrap);
  },
  async setBootstrap(value: string | null): Promise<void> {
    if (!value) {
      await AsyncStorage.removeItem(keys.bootstrap);
      return;
    }

    await AsyncStorage.setItem(keys.bootstrap, value);
  },
};
