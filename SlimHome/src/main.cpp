#include <ArduinoJson.h>

#include <WebSocketsClient.h>
#include <SocketIOclient.h>



// wifi library
#include <WiFi.h>

// time library
#include <time.h>

// environment variables


#define esp_out Serial

SocketIOclient socketIO;

const char 
  *pass = "Mahirtekin199852",
  *ssid = "Xiaomi_wifi",
  *server_host = "entegre.humbldump.com";


const int built_in_led = 2,
      living_room_light = 22,
      kitchen_light = 21,
      bathroom_light = 18;

const uint16_t server_port = 80; // Enter server port

boolean connectWiFi();
void searchWiFi();
void blinkBuiltInLed(int times, int delayT);
void socketIOEvent(socketIOmessageType_t type, uint8_t * payload, size_t length);
void room_control(int led, float req);

//main function
void setup() {

  esp_out.begin(115200);
  esp_out.setDebugOutput(true);
  
  //setup built in led
  pinMode(built_in_led, OUTPUT);
  pinMode(living_room_light, OUTPUT);
  pinMode(kitchen_light, OUTPUT);
  pinMode(bathroom_light, OUTPUT);

  //close all lights
  room_control(living_room_light, 0);
  room_control(kitchen_light, 0);
  room_control(bathroom_light, 0);

  boolean wifi = connectWiFi();
  if(wifi){
    socketIO.begin(server_host, server_port, "/socket.io/?EIO=4&device_id=esp32&device_slug=humbldump&password=123456789");
    socketIO.onEvent(socketIOEvent);
  }
}


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
  for (size_t i = 0; i < times; i++)
  {
    digitalWrite(built_in_led, HIGH);
    delay(delayT);
    digitalWrite(built_in_led, LOW);
    delay(delayT);
  }
  
}

void BuiltInLed(float req){
  digitalWrite(built_in_led, req == 1 ? HIGH : LOW);
  delay(200);
}

//this function will control room lights
void room_control(int led,float req){
  digitalWrite(led, req == 1 ? HIGH : LOW);

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

            esp_out.printf("New Command Pass: %s\n", payload);
            DynamicJsonDocument doc(1024);
            DeserializationError error = deserializeJson(doc, payload, length);

            if(error) {
                esp_out.print(F("deserializeJson() failed: "));
                esp_out.println(error.c_str());
                return;
            }

            //main command came on socket io eg "espCommand_compile"
            const char* command_key = doc[0];
            
            

            if(strcmp(command_key, "espCommand_compile") == 0){
              //parse command data into json object
              JsonObject command_data = doc[1]["command_info"];

              const char* command_name = command_data["home_device_str"];
              const long command_command = command_data["home_device_command"];

              if(strcmp(command_name, "builtin") == 0){
                BuiltInLed(command_command);
              }
              else if(strcmp(command_name, "living_room_light") == 0){
                room_control(living_room_light, command_command);
              }
              else if(strcmp(command_name, "kitchen_light") == 0){
                room_control(kitchen_light, command_command);
              }
              else if(strcmp(command_name, "bathroom_light") == 0){
                room_control(bathroom_light, command_command);
              }
              else if(strcmp(command_name, "all_room_lights") == 0){
                room_control(living_room_light, command_command);
                room_control(kitchen_light, command_command);
                room_control(bathroom_light, command_command);
              }
              else if(strcmp(command_name, "restart_device") == 0 ){
                ESP.restart();
              }
              else{
                esp_out.printf("Command not found: %s\n", command_name);
              }

              esp_out.println("Command: passed");

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
    blinkBuiltInLed(1, 200);
}