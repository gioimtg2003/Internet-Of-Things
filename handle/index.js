const mqtt = require("mqtt");
const express = require("express");
const app = express();

// const mongoose = require("mongoose");
// mongoose.connect()
const client = mqtt.connect("mqtt://localhost", {
    username: 'iot',
    password: 'iotNhom8',
    port: 1883
});

client.on("connect", () => {
    client.subscribe("eat", (err) => {
        if (!err) {
            client.publish('eat', Buffer.from(JSON.stringify({
                eat: true,
                date: Date.now()
            })))
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
    console.log(JSON.parse(payload.toString()));
    client.end()
})