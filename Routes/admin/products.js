//Create Routes
//Export Routes
const express = require("express");
const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new')

const router = express.Router();

//products
router.get('/admin/products', (req, res) => {

});

//form
router.get('/admin/products/new', (req, res) => {
    res.send(productsNewTemplate({}));
});

//submit form
//submit and edit
//delete

module.exports = router;