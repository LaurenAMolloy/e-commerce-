console.log("Hi there!");
//Import Express 
const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const usersRepo = require('./repositories/users');

//Create app using express
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
    keys: ['vhbdmbvhdsmzvbszm']
}))

//Routehandler for GET requests
// / run when someone vists root url(http://localhost:3000/)
//req holds info about the incoming request query params etc
//res hold information to send back to the client object
//Serve the customers
//I am going to take this request and send it to port 3000
app.get('/signup', (req, res) => {
    //callback to take the string and send it back
    //Express and browser wor
    res.send(`
    <div>
    Your id is ${req.session.userId}
    <form method="POST">
    <input placeholder = "email" name="email">
    <input placeholder = "password" name="password">
    <input placeholder = "password-confirmation" name="passwordConfirmation">
    <button>Sign Up</button>
    </form>
    </div>
    `);
});

//Helper Function
//Middlware
//Function in th middle of the request handler
// const bodyParser = (req, res, next) => {
//     //get access to email,password, password confirmation
//     //on method is like an eventlistener
//     //emits a data event
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

app.post('/signup', async (req, res) => {
    //req object that has form properties
    //console.log(req.body)
    const { email, password, passwordConfirmation } = req.body;

    const existingUser = await usersRepo.getOneBy( { email });
    if (existingUser) {
        return res.send('Email in use');
    }
    if (password !== passwordConfirmation) {
        return res.send('Passwords must match');
    }

    //Create a user in our user repo to represent this person
    const user = await usersRepo.create({ email, password});

    //Store the id of that uder inside the users cookie
    //Use a third party package
    //Highly recommended!
    //Objects are manitained by cookiesession for us
   //Added by cookie session
   req.session.userId = user.id;
    
    res.send('Account Created')
})

//Listen at port 3000 
//Open the shop
//How does this work?
//Express sees the request
//Express does not care about the host and the port
//Express cares about the path and the method
//The router gets the path and method
//If it is a GET request run this function

app.get('/signout', (req, res) => {
    //signout tells users to forget cookies
    req.session = null;
    res.send("You are logged out")
});

app.get('/signin', (req, res) => {
    res.send(`
    <div>
    <form method="POST">
    <input placeholder = "email" name="email">
    <input placeholder = "password" name="password">
    <button>Sign In</button>
    </form>
    </div>
    `)
});

app.post('/signin', async(req, res) => {
    const { email, password } = req.body;

    const user = await usersRepo.getOneBy({ email });

    if (!user) {
        return res.send('Email not found');
    }

    const validPassword = await usersRepo.comparePasswords(
        user.password,
        password
    );
        
    //if we are not returned true then exit and show error
    if(!validPassword) {
        return res.send('Invalid password');
    }

    req.session.userId = user.id;
    res.send("You are signed in");
});

app.listen(3000, () => {
    console.log('Listening')
});

