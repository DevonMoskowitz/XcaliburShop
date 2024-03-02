
let ham = document.getElementById("hamburger");
let icons = document.getElementById("icons");
let tags = document.getElementById("tags");
let checked = false;

let json = {
    "name": "Legacy TShirt",
    "description": "This T-Shirt is our very best quality with our brand on it",
    "price": 20
}
function clickAddNewButton() {
    let button = document.getElementById("productButton")
    let form = document.getElementById("productForm")
    if (form.classList.contains("no-display")) {
        button.innerText = "Hide New"
        form.classList.replace("no-display", "display")
    } else {
        button.innerText = "Add New"
        form.classList.replace("display", "no-display")
    }
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
document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault()
    let file = document.getElementById("fileUpload").files[0]
    if (file != null) {
        let currentData;
        fetch("/products.json").then(res => {
            if (!res.ok) {
                throw new Error
                (`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        }).then(data => {
            currentData = data;
        }).catch(error => {
            console.log("Error: " + error)
        });
        const newFile = parseJsonFile(file)
        newFile.then().then(result => {
            console.log(result)
        })

    }
})

async function parseJsonFile(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.onload = event => resolve(JSON.parse(event.target.result))
        fileReader.onerror = error => reject(error)
        fileReader.readAsText(file)
    })
}


