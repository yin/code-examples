/*
  AnalogReadSerial
  Reads an analog input on pin 0, prints the result to the serial monitor.
  Attach the center pin of a potentiometer to pin A0, and the outside pins to +5V and ground.
 
 This example code is in the public domain.
 */

#define SensorLED     1
#define SensorINPUT   3  //Connect the sensor to digital Pin 3 which is Interrupts 1.

String readString;

// the setup routine runs once when you press reset:
void setup() {
  pinMode(SensorLED, OUTPUT); 
  pinMode(SensorINPUT, INPUT);

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
        Serial.println("Welcome, I am Arduino - The automatic meassurement system.");
      } else if(command == 'h') {
        Serial.println("Command help")
      } else {
        Serial.println("I don't know, what '" + command"' command means."
      }
    }
  }
        
  if (readString.length() > 0) {
    if (readString == "a"
    readString="";
  } 
/*
  // read the input on analog pin 0:
  int sensorValue = analogRead(A0);
  int digiValue = digitalRead(SensorINPUT);
  // print out the value you read:
  Serial.println(sensorValue);
  delay(1);        // delay in between reads for stability
*/
}
