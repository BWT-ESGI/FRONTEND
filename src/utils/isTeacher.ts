import getUserInfoFromLocalStorage from "./getUserInfoFromLocalStorage";

export default function isTeacher() {
    const userInfo = getUserInfoFromLocalStorage();
    if (!userInfo) {
        return false;
    }
    return userInfo.role === "teacher";
}