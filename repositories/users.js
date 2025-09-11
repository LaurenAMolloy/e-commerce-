const fs = require('fs');
const crypto = require('crypto');
const util = require("util");

const scrypt = util.promisify(crypto.scrypt);


class UserRepository {
    //check a filename is given to save user
    //Throw error if no file name
    constructor(filename){
        if(!filename) {
            throw new Error('Creating a repo requires a filename')
        }
        //use fs.access function
        //callback version
        //promise version
        //sync function -no callback
        //Node will just check
        //Not good for perfomance
        //Constructors are not allowed to be async
        //We can use this beacuse we will only have 1 repository
        this.filename = filename;
        try {
            fs.accessSync(this.filename);
        } catch (err) {
            //write file function
            fs.writeFileSync(this.filename, "[]");
        }  
    }

    async getAll() {
        //open the file called this.filename
        //use the promise based function
        //The option object is optional
        return JSON.parse(
            await fs.promises.readFile(this.filename, {
            encoding: 'utf8'
        }));

        //read its contents
        //console.log(contents)

        //parse the contents
        //Store as JSON
        //Make sure the array is not a string
        //const data = JSON.parse(contents);

        //return parsed data
        //return data;

        //Create User
    }

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

    async writeAll(records){
        await fs.promises.writeFile(
            this.filename, 
            JSON.stringify(records, null, 2)
            );
        }

    randomId(){
         return crypto.randomBytes(4).toString('hex');
    }

    async getOne(id){
        const records = await this.getAll();
        return records.find(record => record.id === id);
    }

    async delete(id){
        const records = await this.getAll();
        const filteredRecords =  records.filter(record => record.id !== id);
        await this.writeAll(filteredRecords);

    }

    //update
    async update(id, attrs) {
        const records = await this.getAll();
        const record = records.find(record => record.id === record.id);
        //If this does not exist then something is very wrong!
        if(!record) {
            throw new Error(`Record with id ${id} not found`);
        }
        //object assign take all the properties and copys the key and value to attrs
        Object.assign(record, attrs);
        await this.writeAll(records);
    }

    //getoneby
    async getOneBy(filters){
        //use filters object
        //get all records
        const records = await this.getAll();
        
        //Use a for of loop of an array
        for (let record of records) {
            let found = true;
            
            //inner loop is for of because we are looking at object
            for (let key in filters){
                if(record[key] !== filters[key]){
                    found = false;
                }
            }
        if (found){
            return record;
        }
        }
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

