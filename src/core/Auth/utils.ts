import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN = "access_token";
const REFRESH_TOKEN = "refresh_token";
const USER_NAME = "username";
const RESSOURCE_ID = "ressourceId";

export type TokenType = {
  access: string;
  refresh?: string;
};

export async function getItem<T>(key: string): Promise<T> {
  const value = await SecureStore.getItemAsync(key);
  return value ? JSON.parse(value) || null : null;
}

export async function setItem<T>(key: string, value: T) {
  const stringifedValue = JSON.stringify(value);
  await SecureStore.setItemAsync(key, stringifedValue);
}
export async function removeItem(key: string): Promise<void> {
  await SecureStore.deleteItemAsync(key);
}

export const getToken = () => {
  return Promise.all([
    getItem<string>(ACCESS_TOKEN),
    getItem<string>(REFRESH_TOKEN),
  ]);
};
export const removeToken = () => {
  removeItem(ACCESS_TOKEN);
  removeItem(REFRESH_TOKEN);
};
export const setToken = (value: TokenType) => {
  setItem<string>(ACCESS_TOKEN, value.access);
  setItem<string>(REFRESH_TOKEN, value.refresh ? value.refresh : "");
};

export const getUserName = () => getItem<string>(USER_NAME);
export const removeUsername = () => removeItem(USER_NAME);
export const setUsername = (value: string) => setItem<string>(USER_NAME, value);

export const getRessourceId = () => getItem<number>(RESSOURCE_ID);
export const removeRessourceId = () => removeItem(RESSOURCE_ID);
export const setRessourceId = (value: number) =>
  setItem<number>(RESSOURCE_ID, value);
