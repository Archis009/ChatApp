import mongoose from "mongoose";
import User from "./src/models/User.js";
import {ENV} from "./src/lib/env.js";

async function run() {
    await mongoose.connect(ENV.MONGO_URI);
    const user = await User.findOne({email: "mahi@gmail.com"});
    console.log(user);
    process.exit(0);
}
run();
