require('dotenv').config();
const mqtt = require("mqtt");
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const mongoose = require('mongoose');
const eatSchema = require("./eat");

const client = mqtt.connect("mqtt://13.229.236.11", {
    username: 'iot',
    password: 'iotNhom8',
    port: 1883
});

mongoose.connect(process.env.MONGO_URI, {
    dbName: "iot"
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    throw new Error(err);

});
//config cors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", (req, res, next) => {
    console.log(req.originalUrl);
    next();
})

app.get("/eat-new", async (req, res) => {
    let newEat = await eatSchema.aggregate([
        {
            $match: { eat: true }
        },
        {
            $sort: { time: -1 }
        },
        {
            $limit: 1
        },
        {
            $project: {
                _id: 1,
                time: 1
            }
        }
    ]);
    return res.status(200).json(newEat[0] || {})
});

app.get("/eat-count", async (req, res) => {
    let count = await eatSchema.aggregate([
        {
            $match: { eat: true }
        },
        {
            $count: "count"
        }
    ]);
    return res.status(200).json(count[0] || { count: 0 });
})

app.post("/eat", (req, res) => {
    const { eat } = req.body;
    if (typeof eat !== "boolean") {
        return res.status(400).json({ message: "Invalid data" });
    }
    if (client.connected) {
        client.publish("eat", eat ? "1" : "0", async (e) => {
            if (!e) {
                try {
                    let newEat = new eatSchema({ eat });
                    let save = await newEat.save();
                    if (save) {
                        return res.status(200).json({ status: "oke", message: "Success" });
                    } else {
                        return res.status(500).json({ message: "Server Error" });
                    }
                } catch (err) {
                    console.log(err);
                    return res.status(500).json({ message: "Server Error" });
                }

            } else {
                console.log(e);
                return res.status(500).json({ message: "Server Error" });
            }
        });
    } else {
        return res.status(500).json({ message: "Server Error" });
    }

});
http.listen(3000, () => {
    console.log("Server is running on port 3000");
});

client.on("connect", () => {
    console.log("Connected to MQTT broker");
});


client.on("error", (err) => {
    throw new Error(err)
})
client.on("message", (topic, payload) => {
    console.log(payload.toString());
})