/*
  AnalogReadSerial
  Reads an analog input on pin 0, prints the result to the serial monitor.
  Attach the center pin of a potentiometer to pin A0, and the outside pins to +5V and ground.
 
 This example code is in the public domain.
 */

#define VERSION     "1.0"
#define LED          0

int timeSeries[10];
int timePosition = -1;

// the setup routine runs once when you press reset:
void setup() {
  pinMode(LED, OUTPUT); 

  // initialize serial communication at 9600 bits per second:
  Serial.begin(9600);
  Serial.println("Type command 'h' to see what I can do for you.");
}

// the loop routine runs over and over again forever:
void loop() {
  while (Serial.available()) {
    delay(10);  

    if (Serial.available() > 0) {
      char command = Serial.read();
      if (command == 'p') {
        int analogValue = analogRead(A0);
        Serial.println(analogValue);
      } else if(command == 'w') {
        Serial.print("Welcome, I am Arduino - The automatic meassurement system ");
        Serial.print(VERSION);
        Serial.println(".");
      } else if(command == 'h') {
        Serial.println("Command help");
        Serial.println("h - This Command help message");
        Serial.println("w - Welcome message and system version");
        Serial.println("p - Print actual analog value");
        Serial.println("");
      } else {
        Serial.print("I don't know, what '");
        Serial.print(command);
        Serial.print("' command means.");
      }
    }
  }
  delay(1);
}
