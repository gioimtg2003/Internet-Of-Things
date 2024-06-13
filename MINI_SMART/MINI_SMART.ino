#include <Arduino_JSON.h>

#include <PubSubClient.h>
#include <ESP32Servo.h>
#include "WiFi.h"

const char* ssid = "HVHK - Password: 12345678";
const char* password = "12345678@@";
// config servo
const int servoPin = 13; // Chân P13
Servo servo;

// config MQTT
const char* MQTT_SERVER = "192.168.137.1";
const int MQTT_PORT = 1883;
const char* MQTT_USER = "iot";
const char* MQTT_PASSWORD = "iotNhom8";
const char* TOPIC = "test";

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {

  Serial.begin(115200);
  while (!Serial) {
    delay(100);
  }
  Serial.println();
  Serial.println("******************************************************");
  Serial.print("Connecting WIFI to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  //Config MQTT
  client.setServer(MQTT_SERVER, MQTT_PORT);
  client.setCallback(callback);

  // setup servo
  servo.attach(servoPin);
  servo.write(0);

}

void loop() {

  if (!client.connected()) {
    if (client.connect("ESP32Client", MQTT_USER, MQTT_PASSWORD)) {
      Serial.println("Connected to MQTT broker");
      client.subscribe(TOPIC);
    } else {
      Serial.print("Failed to connect to MQTT broker, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
  client.loop();

}

void callback(char* topic, byte* payload, unsigned int length) {
  // Convert to char*
  char message[length + 1]; 
  memcpy(message, payload, length); 
  message[length] = '\0'; 
  
  JSONVar myObject = JSON.parse(message);

  if (JSON.typeof(myObject) == "undefined") {
    Serial.println("Parsing input failed!");
    return;
  }

  bool eat = myObject["eat"];
  if (eat) {
    servo.write(180);
  } else {
    servo.write(0);
  }


  Serial.print("topic: ");
  Serial.print(topic);
  Serial.print(". Message: ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
}
