
let ham = document.getElementById("hamburger");
let icons = document.getElementById("icons");
let tags = document.getElementById("tags");
let checked = false;

let json = {
    "name": "Legacy TShirt",
    "description": "This T-Shirt is our very best quality with our brand on it",
    "price": 20
}

document.addEventListener("click", e => {
    if (e.target.id === "sign-in" || e.target.id === "cart") {
        if (e.target.id === "cart") {
            console.log("incart")
            if (isLoggedIn()) {
                // go to cart

                window.location.href = "cart.html"
            } else {
                window.location.href = "sign-in.html"
            }
        } else {
            if (isLoggedIn()) {
                console.log(getUsernameFromCookie())
            } else {
                window.location.href = "sign-in.html"
            }
        }
    }
})

document.getElementById("hamburger").addEventListener("click", clickHam)

function clickHam() {
    if (!checked) {
        ham.style.setProperty("right", "32%")
        icons.style.setProperty("right", "0")
        tags.style.setProperty("right", "0")
        checked = true;
    } else {
        ham.style.setProperty("right", "25px")
        icons.style.setProperty("right", "-100%")
        tags.style.setProperty("right", "-100%")
        checked = false;
    }
}

function isLoggedIn() {
    return Boolean(sessionStorage.getItem("logged"));
}

// Function to retrieve login information from sessionStorage
function getUsernameFromCookie() {
    return sessionStorage.getItem("username");
}

function getNameFromCookie() {
    return sessionStorage.getItem("name");
}

function getIdFromCookie() {
    return sessionStorage.getItem("userid")
}

// Function to clear login information from sessionStorage
function clearLoginInfo() {
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("userid");
    sessionStorage.removeItem("logged");
}



