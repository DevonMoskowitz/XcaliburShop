const express = require('express');
const multer = require('multer');
const cors = require("cors")
const app = express();
const sqlmanager = require("./SQLManager")

app.use(cors());
app.use(express.json());

app.get("/DevonsShop/userdata", (req, res) => {
    res.json(sqlmanager.getAllUsers())
})
app.get("/DevonsShop/getproducts", (req, res) => {
    res.json(sqlmanager.getAllProducts())
})

app.get("/DevonsShop/categories/:id", (req, res) => {
    const categoryId = req.params.id

    res.json(sqlmanager.getCategoryById(categoryId))
})

app.get("/DevonsShop/products/:id", (req, res) => {
    const categoryId = req.params.id

    res.json(sqlmanager.getCategoryById(categoryId))
})
app.post("/DevonsShop/newproduct", (req, res) => {

    let cat_id = sqlmanager.getCIDFromString(req.body["category_name"]);

    if (cat_id !== -1) {
        sqlmanager.createProduct(req.body["name"], req.body["description"], parseInt(req.body["price"]), req.body["image_url"], cat_id, req.body["is_featured"] === "true" ? 1 : 0)

        res.send({
            success: true,
            message: "Product created successfully"
        });
    } else {
        res.send({
            success: true,
            message: "Category Name is wrong try again"
        });
    }
}) ;
app.post("/DevonsShop/newuser", (req, res) => {
    let contains = false;
    sqlmanager.getAllUsers().forEach(user => {
        if (user["email"] === req.body["email"]) {
            console.log("Already contains user")
            contains = true
        }
    })
    if (!contains) {
        sqlmanager.createUser(req.body["name"], req.body["email"], req.body["password"])
        res.send({
            success: true,
            message: "User created successfully"
        });
    } else {
        res.send({
            success: false,
            message: "User already exists"
        });
    }

})


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});