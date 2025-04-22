import getUserInfoFromLocalStorage from "./getUserInfoFromLocalStorage";

export default function isStudent() {
    const userInfo = getUserInfoFromLocalStorage();
    if (!userInfo) {
        return false;
    }
    return userInfo.role === "student";
}