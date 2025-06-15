import "dotenv/config";
import mongoose from "mongoose";


async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
}


main();


