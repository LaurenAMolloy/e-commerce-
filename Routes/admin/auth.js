const express = require('express');

const { handleErrors} = require('../admin/middleware')
const usersRepo = require('../../repositories/users');
const signupTemplate = require("../../views/admin/auth/signup");
const signinTemplate = require("../../views/admin/auth/signin");
const { requireEmail, requirePassword, requirePasswordConfirmation, requireEmailExist,requireValidPasswordForUser } = require('./validators');


const router = express.Router();

//Routehandler for GET requests
// / run when someone vists root url(http://localhost:3000/)
//req holds info about the incoming request query params etc
//res hold information to send back to the client object
//Serve the customers
//I am going to take this request and send it to port 3000
router.get('/signup', (req, res) => {
    //callback to take the string and send it back
    res.send(signupTemplate({ req }));
});

//Helper Function
//Middlware
//Function in the middle of the request handler
//const bodyParser = (req, res, next) => {
    //get access to email,password, password confirmation
    //on method is like an eventlistener
    //emits a data event
//     if (req.method = "POST") {
//         req.on("data", data => {
//         const parsed = data.toString("utf8").split("&");
//         console.log(parsed)
//         const formData = {};
//         for (let pair of parsed) {
//             const [key, value] = pair.split('=');
//             formData[key] = value;
//             console.log(formData[key]);
//         }
//         req.body = formData;
//         next();
//     });
//     } else {
//         next();
//     } 
// }

router.post(
    '/signup', 
[ 
    requireEmail,
    requirePassword,
    requirePasswordConfirmation,
], 
handleErrors(signupTemplate),
async (req, res) => {

    //req object that has form properties
    //console.log(req.body)
    const { email, password } = req.body;

    //Create a user in our user repo to represent this person
    const user = await usersRepo.create({ email, password});

    //Store the id of that uder inside the users cookie
    //Use a third party package
    //Highly recommended!
    //Objects are manitained by cookiesession for us
   //Added by cookie session
   req.session.userId = user.id;
    
    res.redirect('/admin/products');
})

//Listen at port 3000 
//Open the shop
//How does this work?
//Express sees the request
//Express does not care about the host and the port
//Express cares about the path and the method
//The router gets the path and method
//If it is a GET request run this function

router.get('/signout', (req, res) => {
    //signout tells users to forget cookies
    req.session = null;
    res.send("You are logged out")
});

router.get('/signin', (req, res) => {
    res.send(signinTemplate({}));
});

router.post(
    '/signin', 
    [requireEmailExist, requireValidPasswordForUser],
    handleErrors(signinTemplate),
    async(req, res) => {
    
    const { email } = req.body;

    const user = await usersRepo.getOneBy({ email });

    req.session.userId = user.id;
    res.redirect('admin/products')
});

module.exports = router;