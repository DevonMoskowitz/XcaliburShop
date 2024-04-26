const express = require('express');
const cors = require("cors")
const app = express();
const path = require('path');
const sqlmanager = require("./SQLManager")

app.use(cors());
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get("/DevonsShop/userdata", (req, res) => {
    res.json(sqlmanager.getAllUsers())
})

app.get("/DevonsShop/search/:query", (req, res) => {
    const products = sqlmanager.searchProducts("%"+req.params.query + "%");
    res.render('search', { products });
});
app.get("/DevonsShop/getproducts", (req, res) => {
    res.json(sqlmanager.getAllProducts())
})

//get from the user id the cart products
app.get("/DevonsShop/cartproducts/:userid", (req, res) => {

    const userid = req.params.userid;
    let cart = sqlmanager.hasCart(userid);
    if (cart === null) return res.json(null);
    const cartId = cart["id"]
    let data = [];
    const cartProducts = sqlmanager.getAllCartProducts()
    let index = 0;
    for (let i = 0; i < cartProducts.length; i++) {
        const crtp = cartProducts[i];
        if (crtp["cart_id"] === cartId) {
            data[index] = {
                "product": sqlmanager.getProductById(crtp["product_id"]),
                "quantity": crtp["quantity"],
                "cpid": crtp["id"]
            }
            index++;
        }
    }
    res.json(data)
})

app.get("/DevonsShop/categories/:id", (req, res) => {
    const categoryId = req.params.id
    res.json(sqlmanager.getCategoryById(categoryId))
})
app.get("/DevonsShop/product/:id", (req, res) => {
    const productId = req.params.id;

    const product = sqlmanager.getProductById(productId)

    // Render a webpage to display the category details and allow modification/deletion of products
    res.render('details', { product });
});
app.get("/DevonsShop/products/:id", (req, res) => {
    const productId = req.params.id;

    const product = sqlmanager.getProductById(productId)

    // Render a webpage to display the category details and allow modification/deletion of products
    res.send(`
<html>
    <head>
        <title>Product Management</title>
    </head>
    <body>
        <form class="no-display" id="productForm">
            <label>
                Product Id:<br>
                <input type="number" id="pid" name="id" value="" readonly>
            </label>
            <br>
            <label>
                Category Name:<br>
                <input type="text" id="cname" name="catname">
            </label>
            <br>
            <label>
                Image Path:<br>
                <input type="text" id="ipath" name="path">
            </label>
            <br>
            <label>
                Product Name:<br>
                <input type="text" id="name" name="name">
            </label>
            <br>
            <label>
                Description:<br>
                <input type="text" id="description" name="description">
            </label>
            <br>
            <label>
                Price:<br>
                <input type="number" id="price" name="price" value="1">
            </label>
            <br>
            <label id="featured">
                Featured: <br>
                <input type="checkbox" id="feature" name="featured">
            </label>
            <br>
            <input type="submit" id="save" value="Save">
            <br>
            <input type="submit" id="delete" value="Delete">
            
        </form>
        <script>
            let name = "${sqlmanager.getCategoryById(product['category_id'])['name']}";
            document.getElementById("pid").value = ${productId};
            document.getElementById("cname").value = name + "";
            document.getElementById("ipath").value = "${product['image_url']}";
            document.getElementById("name").value = "${product['name']}";
            document.getElementById("description").value = "${product['description']}";
            document.getElementById("price").value = "${product['price']}";
            if (${product['is_featured']} === 0) {
                document.getElementById("feature").checked = false;
            } else {
                document.getElementById("feature").checked = true;
            }

            document.getElementById("delete").addEventListener("click", e => {
                e.preventDefault();
                let current = e.currentTarget;
                let data = {"id": ${productId} };
                console.log(current.value);
                fetch("http://localhost:3000/DevonsShop/deleteproduct", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json' // specify content type as JSON
                    },
                    body: JSON.stringify(data)
                });
                window.location.href = 'http://localhost:63342/DevonsShop/public/product-edit.html?_ijt=2qdjn0u41mca0r4bnp1kaln0bu&_ij_reload=RELOAD_ON_SAVE';
            });
            document.getElementById("save").addEventListener("click", e => {
                e.preventDefault();
                let current = e.currentTarget;
                let cname = document.getElementById("cname").value;
                let data = {"id": ${productId},
                 "category_id": cname,
                    "name": document.getElementById("name").value,
                    "image_url": document.getElementById("ipath").value,
                    "price": document.getElementById("price").value,
                    "is_featured": document.getElementById("feature").checked === true ? 1 : 0,
                    "description": document.getElementById("description").value
                    }
                fetch("http://localhost:3000/DevonsShop/updateproduct", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json' // specify content type as JSON
                    },
                    body: JSON.stringify(data)
                });
                window.location.href = 'http://localhost:63342/DevonsShop/public/product-edit.html?_ijt=2qdjn0u41mca0r4bnp1kaln0bu&_ij_reload=RELOAD_ON_SAVE';
            });
        </script>
    </body>
</html>
`);
});

app.post("/DevonsShop/deleteproduct", (req, res) => {
    sqlmanager.deleteProduct(req.body["id"])
}) ;
app.post("/DevonsShop/updateproduct", (req, res) => {
    let name = req.body["name"]
    let catid = sqlmanager.getCIDFromString(req.body["category_id"])
    let image_url = req.body["image_url"]
    let description = req.body["description"]
    let price = req.body["price"]
    let is_featured = req.body["is_featured"]
    sqlmanager.updateProduct(name, description, price, image_url, catid, is_featured, req.body["id"])
}) ;
app.post("/DevonsShop/checkout", (req, res) => {
    let cart = sqlmanager.hasCart(Number(req.body["user_id"]));
    if (cart === null) return;
    let cart_id = cart["id"]
    req.body["products"].forEach(p => {
        sqlmanager.deleteCartProduct(p)
    })
    sqlmanager.deleteCart(cart_id)
}) ;
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
            success: false,
            message: "Category Name is wrong try again"
        });
    }
}) ;

app.post("/DevonsShop/addtocart", (req, res) => {
    let product = req.body;
    // status is new abandoned or purchased
    let cart = sqlmanager.hasCart(product["userid"]);
    if (cart === null) {
        sqlmanager.createCart("new", product["userid"])
    }
    let cart_id = sqlmanager.getCartByUserId(product["userid"])
    let cp = sqlmanager.doesCartProductExist(cart_id["id"], product["product"]["id"]);
    console.log(cp)
    if (cp !== null) {
        let q = cp["quantity"] + 1;
        sqlmanager.updateCartProduct(q, cp["id"]);
    } else {
        sqlmanager.createCartProduct(cart_id["id"], product["product"]["id"], 1)
    }
})

app.post("/DevonsShop/removefromcart", (req, res) => {
    let id = req.body["product_id"]
    let userId = req.body["user_id"]
    let cartid = sqlmanager.getCartByUserId(userId)["id"];
    let product = sqlmanager.doesCartProductExist(cartid, id)
    let quantity = Number(product["quantity"])
    if (product !== null) {
        if (Number(product["quantity"]) === 1) {
            sqlmanager.deleteCartProduct(product["id"])
        } else {
            let newQ = quantity -1
            sqlmanager.updateCartProduct(newQ, product["id"])
        }
    }

})
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