#include <HX711.h>
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
const char* TOPIC = "eat";
WiFiClient espClient;
PubSubClient client(espClient);

// Config loadCell
const int LOADCELL_DOUT_PIN = 16;
const int LOADCELL_SCK_PIN = 4;
HX711 scale;


void setup() {

  Serial.begin(115200);
  while (!Serial) {
    delay(100);
  }
  Serial.println(ssid);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  //setup MQTT
  client.setServer(MQTT_SERVER, MQTT_PORT);
  client.setCallback(callback);

  // setup servo
  servo.attach(servoPin);
  servo.write(0);
  if (!myservo.attached()) {
    Serial.println("Failed Connect to Servo");
  } 

  // setup loadcell
  rtc_cpu_freq_config_t configLC;
  rtc_clk_cpu_freq_get_config(&configLC);
  rtc_clk_cpu_freq_to_config(RTC_CPU_FREQ_80M, &configLC);
  rtc_clk_cpu_freq_set_config_fast(&configLC);
  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);
  scale.set_scale();
  scale.tare();  // Reset trọng lượng về 0
  long zero_factor = scale.read_average(); // Lấy giá trị trung bình khi không có tải
  Serial.print("Zero factor: ");
  Serial.println(zero_factor);

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
  if (scale.is_ready()) {
    long readLoadCell = scale.get_units();
    if (readLoadCell >  500) { // lớn hơn 500 thì đóng lại
      servo.write(0)
    }
  }
  
  
  client.loop();

}

char* convertToChar(byte* data, unsigned int length) {
  char message[length + 1]; 
  memcpy(message, data, length); 
  message[length] = '\0'; 
  return message;
}

void callback(char* topic, byte* payload, unsigned int length) {
  char* message = convertToChar(payload, length);
  int eat = atoi(message);
  if (eat == 1 && topic == "eat") { // lắng nghe mq
    servo.write(180);
  }
  
  // Serial.print("topic: ");
  // Serial.print(topic);
  // Serial.print(". Message: ");
  // for (int i = 0; i < length; i++) {
  //   Serial.print((char)payload[i]);
  // }
  // Serial.println();
}


// void reconnectMQTT() {
//   while (!client.connected()) {
//     Serial.println("Attempting MQTT connection...");
//     if (client.connect("ESP32_clientID")) {
//       Serial.println("connected");
//       client.publish("test", "Nodemcu connected to MQTT");
//       client.subscribe("eat");

//     } else {
//       Serial.print("failed, rc=");
//       Serial.print(client.state());
//       Serial.println(" try again in 5 seconds");
//       delay(5000);
//     }
//   }
// }
