import getUserInfoFromLocalStorage from "./getUserInfoFromLocalStorage";

export default function isAuthenticated() {
    const userInfo = getUserInfoFromLocalStorage();
    if (!userInfo?.token) {
        return false;
    }
    return true;
}