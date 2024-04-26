import { saveLoginInfo, isLoggedIn, getUsernameFromCookie, getNameFromCookie, clearLoginInfo, getIdFromCookie } from './cookies.js';
document.addEventListener("submit", (ev) => {
    ev.preventDefault()
    let username = document.getElementById("user").value
    let pass = document.getElementById("password").value
    fetch("http://localhost:3000/DevonsShop/userdata").then(req => {return req.json();}).then(resp => {
        let able = false;
        let admin = false;
        let userr;
        resp.forEach(user => {
            if (user["email"] === username && user["password"] === pass) {
                able = true
                admin = user["user_type"] === "admin";
                userr = user;
            }
        });
        if (!able) {
            document.getElementById("wrong").style.display = "block"
            setTimeout(() => {
                document.getElementById("wrong").style.display = "none"
            }, 2 * 1000)
        } else {
            document.getElementById("success").style.display = "block"
            // execute code for successful login
            saveLoginInfo(userr["email"], userr["name"], userr["id"])
            if (admin) {
                window.location = "product-edit.html"
            } else {
                window.location = "index.html"
            }
        }
    }).catch(error => {
        console.error("Error fetching data:", error);
    })
});