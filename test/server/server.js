import express from "express";
import cors from "cors";
import morgan from "morgan";
import ENV from "./config.js";
import connect from "./conn.js";
import router from "./router.js";

const app = express();

app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({
    limit: "50mb",
    extended: true
}));
app.use(cors());
app.use(morgan("tiny"));
app.disable("x-powered-by");
app.disable("etag");
app.use("/api", router);

connect().then(() => {
    try {
        app.listen(ENV.PORT,'192.168.1.44', () => {
            console.log(`Server started on port:${ENV.PORT}`);
        });
    } catch (error) {
        console.log("Cannot start server..");
    }
}).catch(error => {
    console.log("Invalid database connection..");
});