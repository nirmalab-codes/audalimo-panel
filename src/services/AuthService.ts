import { UserVo } from "../contracts/vo/User.vo";
import SecureStorageService from "./SecureStorageService";

export const USER_DATA_KEY = "session_info" as string;

export const setUserData = (userData: UserVo): void => {
  SecureStorageService.setItem(USER_DATA_KEY, JSON.stringify(userData));
}

export const getUserData = (): UserVo | null => {
  let result = SecureStorageService.getItem(USER_DATA_KEY);
  if(result != null) return JSON.parse(result) as UserVo
  else return result
}

export const destroyUserData = (): void => {
  SecureStorageService.removeItem(USER_DATA_KEY)
}

/**
 * @description get token form localStorage
 */
export const getToken = (): string | null => {
  let result = getUserData()
  return result == null || result.accessToken == undefined ? null : result.accessToken
}

export default { setUserData, getUserData, destroyUserData, getToken, USER_DATA_KEY };
