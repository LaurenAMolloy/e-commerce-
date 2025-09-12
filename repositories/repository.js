const fs = require('fs');
const crypto = require('crypto');

module.exports = class Repository {

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
        //We can use this because we will only have 1 repository
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
        //assign random id
        attrs.id = this.randomId();

        //get all records
        const records = await this.getAll();
        //push the new product
        //Replace push with above
        records.push(attrs);

        await this.writeAll(records);

        //This has moved to writeall method
        //write the updated records to this.filename
        // await fs.promises.writeFile(this.filename, JSON.stringify(records))
        return attrs ;
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