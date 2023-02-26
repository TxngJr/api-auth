const mongoose =require("mongoose");

const {MONGO_URI} = process.env;

exports.connect = () => {
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.MONGO_URI)
    
    /*
    mongoose.connect(MONGO_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    */
    .then(()=>{
        console.log("Successfully connected to database");
    })
    .catch((error) =>{
        console.log("database connection failed. exiting now...");
        console.error(error);
        process.exit(1);
    });
};