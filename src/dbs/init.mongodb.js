"use strict";
import mongoose from "mongoose";
import { countConnect } from "../helpers/check.connect.js";

//import config from "../configs/config.mongodb.js";
// const {
//     db: { host, port, name },
// } = config;
//const connectString = `mongodb://${host}:${port}/${name}`;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_USERNAME_PASSWORD;

const connectString = `mongodb+srv://${username}:${password}@my-cluster.bvonflo.mongodb.net/test?retryWrites=true&w=majority`;

class Database {
    constructor() {
        this.connect();
    }
    connect(type = "mongodb") {
        if (1 === 1) {
            mongoose.set("debug", true);
            // mongoose.set("debug", function (collectionName, method) {
            //     if (method !== "createIndex") {
            //         console.log("Mongoose:", collectionName, method);
            //     }
            // });
        }
        mongoose
            .connect(connectString)
            .then((_) => {
                console.log("Connected Mongodb Success!");
                countConnect();
            })
            .catch((error) => console.log(error));
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

const instanceMongodb = Database.getInstance();
export default instanceMongodb;
