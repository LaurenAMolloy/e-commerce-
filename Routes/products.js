const express = require('express');
const productsRepo = require('../repositories/products');
const productsIndexTemplate = require('../views/products/index')

const router = express.Router();

router.get('/', async (req, res) => {
    const products = await productsRepo.getAll();
    res.send(productsIndexTemplate({ products }));
 //Reach into repo and get all
 //send to a template for rendering

});

module.exports = router;