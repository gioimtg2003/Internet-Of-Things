#include <ESP32Servo.h>
#include "WiFi.h"

const char* ssid = "Kha Nguyen";
const char* password = "11111111";
const int servoPin = 13;
Servo servo;

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
  // setup servo
  servo.attach(servoPin);
  servo.write(0);

}

void loop() {


}
