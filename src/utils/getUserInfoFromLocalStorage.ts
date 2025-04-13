export default function getUserInfoFromLocalStorage() {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const userFirstname = localStorage.getItem("userFirstname");
    const userLastname = localStorage.getItem("userLastname");
    const userEmail = localStorage.getItem("userEmail");
    
    if (!userId || !token || !role || !userFirstname || !userLastname || !userEmail) {
        console.error("User information is missing in local storage");
        return null;
    }
    
    return {
        userId,
        token,
        role,
        userFirstname,
        userLastname,
        userEmail,
    };
}