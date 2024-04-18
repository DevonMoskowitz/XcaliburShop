"use strict";
const sqlite = require("better-sqlite3");
const path = require("path");
const db = new sqlite(path.resolve("mydatabase.db"), { fileMustExist: true });

function all(sql, ...params) {
    return db.prepare(sql).all(params);
}

function get(sql, ...params) {
    return db.prepare(sql).get(params);
}

function run(sql, ...params) {
    return db.prepare(sql).run(params[0]);
}


// User management

function getAllUsers() {
    let sql = "SELECT * FROM Users;";
    const data = all(sql);
    return data;
}

function getUserById(id) {
    let sql = "SELECT * FROM Users WHERE id =? ;";
    const item = get(sql, id);
    return item;
}

function checkPassword(id, input) {
    let user = getUserById(id);
    if (user === null) return null;
    return user.get("password") === input;
}

function checkEmail(id, input) {
    let user = getUserById(id);
    if (user === null) return null;
    return user.get("email") === input;
}

function createUser(name, email, password) {
    run("INSERT INTO Users (name, email, password, user_type) VALUES (?, ?, ?, ?)", [name, email, password, "user"])
}

// Products management
function getAllProducts() {
    let sql = "SELECT * FROM Products;";
    const data = all(sql);
    return data;
}

function getProductById(id) {
    let sql = "SELECT * FROM Products WHERE id =? ;";
    const item = get(sql, id);
    return item;
}

function createProduct(name, description, price, image_url, category_id, is_featured) {
    run("INSERT INTO Products (name, description, image_url, price, category_id, is_featured) VALUES (?, ?, ?, ?, ?, ?)", [name, description, image_url, price, category_id, is_featured])
}

function getProductAttribute(id, attribute) {
    return getProductById(id).get(attribute);
}

// Categories management

function getCIDFromString(string) {
    const category = getAllCategories().find(cat => cat["name"].toLowerCase() === string.toLowerCase());
    return category ? category["id"] : -1;
}
function getAllCategories() {
    let sql = "SELECT * FROM Categories;";
    const data = all(sql);
    return data;
}

function getCategoryById(id) {
    let sql = "SELECT * FROM Categories WHERE id =? ;";
    const item = get(sql, id);
    return item;
}

function createCategory(name, order) {
    run("INSERT INTO Categories (name, orda) VALUES (?, ?)", [name, order])
}

function getCategoryAttribute(id, attribute) {
    return getCategoryById(id).get(attribute);
}

// Carts Management

function getAllCarts() {
    let sql = "SELECT * FROM Carts;";
    const data = all(sql);
    return data;
}

function getCartById(id) {
    let sql = "SELECT * FROM Carts WHERE id =? ;";
    const item = get(sql, id);
    return item;
}

function createCart(status, user_id) {
    run("INSERT INTO Carts (status, user_id) VALUES (?, ?)", [status, user_id])
}

function getCartAttribute(id, attribute) {
    return getCartById(id).get(attribute);
}

// Cart Products Management

function getAllCartProducts() {
    let sql = "SELECT * FROM CartProducts;";
    const data = all(sql);
    return data;
}

function getCartProductById(id) {
    let sql = "SELECT * FROM CartProducts WHERE id =? ;";
    const item = get(sql, id);
    return item;
}

function createCartProduct(cart_id, product_id, quantity) {
    run("INSERT INTO CartProducts (cart_id, product_id, quantity) VALUES (?, ?, ?)", [cart_id, product_id, quantity])
}

function getCartProductAttribute(id, attribute) {
    return getCartProductById(id).get(attribute);
}

module.exports = {
    getAllUsers,
    createUser,
    checkEmail,
    checkPassword,
    getUserById,
    getAllProducts,
    getProductById,
    getProductAttribute,
    createProduct,
    getAllCarts,
    getCartById,
    getCartAttribute,
    createCart,
    getAllCartProducts,
    getCartProductById,
    getCartProductAttribute,
    createCartProduct,
    getAllCategories,
    getCategoryById,
    getCategoryAttribute,
    createCategory,
    getCIDFromString
}
