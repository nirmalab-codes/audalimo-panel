import HashHmacSHA256 from 'crypto-js/hmac-sha256'
import uuidv4 from 'uuid-browser/v4'

const UUID_KEY_IDX = "UUID_KEY_STORE"

export const getUuid = ():string => {
    let key = ""
    let result = window.localStorage.getItem(HashHmacSHA256(UUID_KEY_IDX, UUID_KEY_IDX))
    if(result == null){
        key = uuidv4()
        window.localStorage.setItem(HashHmacSHA256(UUID_KEY_IDX, UUID_KEY_IDX), btoa(key))
    }else{
        key = atob(result)
    }
    return key
}

export const getItem = (key: string): string | null => {
    let result = window.localStorage.getItem(HashHmacSHA256(key, getUuid()))
    if(result != null) return atob(result)
    else return result
}

export const setItem = (key: string, value: string) => {
    window.localStorage.setItem(HashHmacSHA256(key, getUuid()), btoa(value))
}

export const removeItem = (key: string) => {
    return window.localStorage.removeItem(HashHmacSHA256(key, getUuid()))
}

export default { getItem, setItem, removeItem, getUuid }