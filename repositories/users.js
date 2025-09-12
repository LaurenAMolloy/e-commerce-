const fs = require('fs');
const crypto = require('crypto');
const util = require("util");
const Repository = require('./repository')

const scrypt = util.promisify(crypto.scrypt);


class UserRepository extends Repository {
    async create(attrs) {
        attrs.id = this.randomId();

        //Salting Password
        //{ email: "", password: ""}
        const salt = crypto.randomBytes(8).toString('hex');
        //Callback version
        // scrypt(attrs.password, salt, 64, (err, buf) => {
        //     const hashed =  buff.toString('hex');
        // });
        const buf = await scrypt(attrs.password, salt, 64)

        //{email: gchbgbhfj, password:vghcvghgh }
        //load the contents of the JSON
        //THIS GIVES US THE LIST OF USERS
        const records = await this.getAll();
        //push the new user
        const record = {
            //take all props from attrs
            ...attrs,
            //replace the password with the hash/salt password
            password: `${buf.toString("hex")}.${salt}`
        };
        //Replace push with above
        records.push(record);

        await this.writeAll(records);

        //This has moved to writeall method
        //write the updated records to this.filename
        // await fs.promises.writeFile(this.filename, JSON.stringify(records))
        return record;
        }

        async comparePasswords(saved, supplied) {
            //saved => password saved in our database
            //supplied => pw given by user trying to login
            // const result = saved.split('.');
            // const hashed = result[0];
            // const salt = result[1];
    
            //Grab the results from the array
            const [ hashed, salt ] = saved.split('.');
            const hashedSuppliedBuffer = await scrypt(supplied, salt, 64);
    
            //lets compare
            return hashed === hashedSuppliedBuffer.toString("hex")
        }
    

}
            
    

//Is top level async await available now?
//const test = async () => {
   //Access the repo
   //const repo = new UserRepository('users.json');

   //Save a new record
   //await repo.create({email: "test@test.com"});

   //const user = await repo.getOne("83d8f699");

   //await repo.delete("83d8f699");
   
   //Get record
   //const users = await repo.getAll();

   //await repo.update("180d7c23", { password: "mypassword" })

   //const user = await repo.getOneBy({ email: "test@test.com", password: "mypassword" });

   //console.log(user);
   
   //Log the record
   //console.log(user)
//};

//test();

//Exporting is not the best approach - Why?
//When usign in multiple files
//We would need to make different classes
//If there were a typo it would cause a bug
//So we instead new to export an instance of the class

// Now we recieve an instance and all the method are free for us to use
module.exports = new UserRepository('users.json');

