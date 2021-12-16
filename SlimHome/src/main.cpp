#include <ArduinoJson.h>

#include <WebSocketsClient.h>
#include <SocketIOclient.h>



// wifi library
#include <WiFi.h>

// time library
#include <time.h>

// environment variables


#define esp_out Serial

#define built_in_led 2

SocketIOclient socketIO;

const char* pass = "Mahirtekin199852";
const char* ssid = "Xiaomi_wifi";
const char* websockets_server_host = "entegre.humbldump.com"; //Enter server adress
const uint16_t websockets_server_port = 80; // Enter server port

boolean connectWiFi();
void searchWiFi();
void blinkBuiltInLed(int times, int delayT);
void socketIOEvent(socketIOmessageType_t type, uint8_t * payload, size_t length);

void controlled(const char* message, size_t length){
  esp_out.println("saas");
  esp_out.println(message);
  
}

void setup() {

  esp_out.begin(115200);
  esp_out.setDebugOutput(true);
  
  pinMode(built_in_led, OUTPUT);

  boolean wifi = connectWiFi();
  if (wifi) {
    esp_out.println("Connected to WiFi");
  } else {
    esp_out.println("Failed to connect to WiFi");
  }

  socketIO.begin("entegre.humbldump.com", 80, "/socket.io/?EIO=4&device_id=esp32&device_slug=Mahir_Tekin_Erdensan_1&password=12345678");
  socketIO.onEvent(socketIOEvent);
}

unsigned long messageTimestamp = 0;
void loop() {
  socketIO.loop();
}


void searchWiFi(){
  int numberOfNetwork = WiFi.scanNetworks();
  esp_out.println("----");
  
  for(int i = 0; i < numberOfNetwork; i++ ){
    esp_out.print("Network name: ");
    esp_out.println(WiFi.SSID(i));
    esp_out.print("Signal strength: ");
    esp_out.println(WiFi.RSSI(i));
    esp_out.println("--------------");
  }
}


boolean connectWiFi(){
  double time_spent = 0.0;

  esp_out.printf("-----------| Starting to connect %s |-----------\n", ssid);

  WiFi.begin(ssid, pass);
  clock_t begin = clock();

  while(WiFi.status() != WL_CONNECTED){
    esp_out.print("#");
    delay(1000);
  }
  clock_t end = clock();


  
  time_spent += (double)(end - begin) / CLOCKS_PER_SEC;
  esp_out.printf("\nConnection Time: %lf" ,time_spent);
  esp_out.printf("\nDevice IP address: %s", WiFi.localIP().toString().c_str());;
  esp_out.printf("\nGateway IP address: %s", WiFi.gatewayIP().toString().c_str());;
  esp_out.printf("\n\n-----------| Connection on %s has done with success |-----------\n", ssid);
  blinkBuiltInLed(4, 200);

  return true;
}


//this function will blink the built in led
void blinkBuiltInLed(int times, int delayT){
  for (size_t i = 0; i <= times; i++)
  {
    digitalWrite(built_in_led, HIGH);
    delay(delayT);
    digitalWrite(built_in_led, LOW);
    delay(delayT);
  }
  
}

void socketIOEvent(socketIOmessageType_t type, uint8_t * payload, size_t length) {
    switch(type) {
        case sIOtype_DISCONNECT:
            esp_out.printf("[IOc] Disconnected!\n");
            break;
        case sIOtype_CONNECT:
            esp_out.printf("[IOc] Connected to url: %s\n", payload);

            // join default namespace (no auto join in Socket.IO V3)
            socketIO.send(sIOtype_CONNECT, "/");
            break;
        case sIOtype_EVENT:
        {
            char * sptr = NULL;
            int id = strtol((char *)payload, &sptr, 10);
            esp_out.printf("[IOc] get event: %s id: %d\n", payload, id);
            if(id) {
                payload = (uint8_t *)sptr;
            }
            DynamicJsonDocument doc(1024);
            DeserializationError error = deserializeJson(doc, payload, length);

            if(error) {
                esp_out.print(F("deserializeJson() failed: "));
                esp_out.println(error.c_str());
                return;
            }

            String eventName = doc[0];
            esp_out.printf("[IOc] event name: %s\n", eventName.c_str());
            esp_out.println(doc.as<String>());
            esp_out.println(doc[1][0].as<String>());

            // Message Includes a ID for a ACK (callback)
            if(id) {
                esp_out.println("saas");
                // creat JSON message for Socket.IO (ack)
                DynamicJsonDocument docOut(1024);
                JsonArray array = docOut.to<JsonArray>();

                // add payload (parameters) for the ack (callback function)
                JsonObject param1 = array.createNestedObject();
                param1["now"] = millis();

                // JSON to String (serializion)
                String output;
                output += id;
                serializeJson(docOut, output);

                // Send event
                socketIO.send(sIOtype_ACK, output);
            }
        }
            break;
        case sIOtype_ACK:
            esp_out.printf("[IOc] get ack: %u\n", length);
            break;
        case sIOtype_ERROR:
            esp_out.printf("[IOc] get error: %u\n", length);
            break;
        case sIOtype_BINARY_EVENT:
            esp_out.printf("[IOc] get binary: %u\n", length);
            break;
        case sIOtype_BINARY_ACK:
            esp_out.printf("[IOc] get binary ack: %u\n", length);
            break;
    }
}