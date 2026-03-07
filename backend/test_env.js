import {ENV} from "./src/lib/env.js";
console.log("JWT_SECRET:", encodeURIComponent(ENV.JWT_SECRET));
console.log("NODE_ENV:", encodeURIComponent(ENV.NODE_ENV));
