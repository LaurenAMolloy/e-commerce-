const express = require('express');

const router = express.Router();

//POST request Add to cart to trigger a form
router.post('/cart/products', (req, res) => {
    console.log(req.body.productId)
    res.send("Product added to cart");
})

//GET Whole cart all listings

//POST Delete item from cart

module.exports = router;

