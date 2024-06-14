const mqtt = require("mqtt");
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const client = mqtt.connect("mqtt://192.168.137.1", {
    username: 'iot',
    password: 'iotNhom8',
    port: 1883
});
eat = true;

client.on("connect", () => {
    client.subscribe("eat", (err) => {
        if (err) {
            throw new Error(err);
        }
    });

});


client.on("error", (err) => {
    throw new Error(err)
})
client.on("message", (topic, payload) => {
    console.log(payload.toString());
})