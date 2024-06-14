const mqtt = require("mqtt");
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const client = mqtt.connect("mqtt://192.168.137.1", {
    username: 'iot',
    password: 'iotNhom8',
    port: 1883
});

const eatModel = require("./eat");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", (req, res, next) => {
    console.log(req.originalUrl);
    next();
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
                    let newEat = new eatModel({ eat });
                    let save = await newEat.save();
                    if (save) {
                        return res.status(200).json({ message: "Success" });
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