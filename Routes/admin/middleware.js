//Custom middleware
const { validationResult } = require('express-validator');

//We are exporting an object that has functions to use on admin routes
module.exports = {
    //Recieve a function to render errors
    handleErrors(templateFunc){
        return (req, res, next) => {
            const errors = validationResult(req);

            if(!errors.isEmpty()) {
                return res.send(templateFunc({ errors }))
            }
            //call the next middleware or routehandler
            next();
        };
    }
};