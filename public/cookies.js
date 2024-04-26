export function saveLoginInfo(email, name, id) {
    sessionStorage.setItem("username", email);
    sessionStorage.setItem("name", name);
    sessionStorage.setItem("userid", id)
    sessionStorage.setItem("logged", true)
}

export function isLoggedIn() {
    return Boolean(sessionStorage.getItem("logged"));
}

// Function to retrieve login information from sessionStorage
export function getUsernameFromCookie() {
    return sessionStorage.getItem("username");
}

export function getNameFromCookie() {
    return sessionStorage.getItem("name");
}

export function getIdFromCookie() {
    return sessionStorage.getItem("userid")
}

// Function to clear login information from sessionStorage
export function clearLoginInfo() {
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("userid")
}
