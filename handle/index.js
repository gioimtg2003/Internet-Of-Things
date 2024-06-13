const mqtt = require("mqtt");
const express = require("express");
const app = express();

// const mongoose = require("mongoose");
// mongoose.connect()
const client = mqtt.connect("mqtt://192.168.137.1", {
    username: 'iot',
    password: 'iotNhom8',
    port: 1883
});

client.on("connect", () => {
    client.subscribe("eat", (err) => {
        if (!err) {
            client.publish('test', Buffer.from(JSON.stringify({
                eat: false,
            })))
            client.end()
        }
        else {
            console.log(err)
        }
    })


})

client.on("error", (err) => {
    throw new Error(err)
})
client.on("message", (topic, payload) => {
    console.log(payload);
})