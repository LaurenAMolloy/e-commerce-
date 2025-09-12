//Create Routes
//Export Routes
const express = require("express");
const { validationResult } = require('express-validator');
const multer = require('multer');

const { handleErrors } = require('./middleware')
const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const productsIndexTemplate = require('../../views/admin/products/index')
const { requireTitle, requirePrice } = require('./validators');

const router = express.Router();
const upload = multer( { storage: multer.memoryStorage() })

//products
router.get('/admin/products', async (req, res) => {
//find all products
    const products = await productsRepo.getAll();
//render
//send to user
    res.send(productsIndexTemplate({ products }));

});

//form
router.get('/admin/products/new', (req, res) => {
    res.send(productsNewTemplate({}));
});

//submit form
router.post('/admin/products/new',
 upload.single("image"),
 [ requireTitle, requirePrice], 
 handleErrors(productsNewTemplate),
 async (req, res) => {
    const errors = validationResult(req);
    //console.log(req.body);

    //see the raw data coming in
    // req.on("data", data => {
    //     console.log(data.toString())
    // })
    
    //Not recommended in production!
    //Take the iamge convert it to base 64
    const image = (req.file.buffer.toString('base64'));
    const { title, price } = req.body;
    //Create inside products repo
    await productsRepo.create({ title, price, image });

    res.send("Submitted");
})
//submit and edit
//delete

module.exports = router;