console.log("Hi there!");
//Import Express 
const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./Routes/admin/auth');
const productsRouter = require('./Routes/admin/products');

//Create app using express
const app = express();

//This is handled first
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
    keys: ['vhbdmbvhdsmzvbszm']
}));

app.use(authRouter);
app.use(productsRouter);

app.listen(3000, () => {
    console.log('Listening')
});

