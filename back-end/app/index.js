import "dotenv/config";
import mongoose from "mongoose";
import express from "express";
import userRouter from "./route/userRoutes.js";
import cartRouter from "./route/cartRoutes.js";
import recordRouter from "./route/recordRoutes.js";
import audioRouter from "./route/audioRoutes.js";
import cors from "cors"




const requestLogger = (req, res, next) => {
    const start = Date.now();

    // Capture the original end function
    const originalEnd = res.end;

    // Override the end function to log when response is sent
    res.end = function(...args) {
        const duration = Date.now() - start;
        const timestamp = new Date().toISOString();

        // console.log(`[${timestamp}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);

        console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);

        // Call the original end function
        originalEnd.apply(this, args);
    };

    next();
};

async function main() {
    try {

        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
    const app = await express();
    app.use(cors())
    app.use(requestLogger);
    app.use(express.json())
    app.use("/api/users", userRouter);
    app.use("api/cart", cartRouter);
    app.use("/api/records", recordRouter);
    app.use("/api/audio", audioRouter)
    app.listen(process.env.PORT, (err) => {console.log(err)})
}


main().catch((err) => {console.log(err)});


