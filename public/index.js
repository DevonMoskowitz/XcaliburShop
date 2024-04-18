
let ham = document.getElementById("hamburger");
let icons = document.getElementById("icons");
let tags = document.getElementById("tags");
let checked = false;

let json = {
    "name": "Legacy TShirt",
    "description": "This T-Shirt is our very best quality with our brand on it",
    "price": 20
}

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



