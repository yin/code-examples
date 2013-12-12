#include <SimpleTimer.h>

/*
 This Arduino sketch was made as semestral project from the subject:
 Automatic Meassurements Systems

 TUKE university in Kosice
 2013 (C) Matej Gagyi
 */

#define VERSION     "1.0"
#define LED          0
#define AIN          A0
#define TIME_DELAY     1000
#define TIME_READINGS  10

int timeSeries[10];
int timePosition = -1;
SimpleTimer timer;
int readingEvent = -1;

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
        printActual();
      } else if (command == 'r') {
        startReading();
      } else if (command == 'e') {
        stopReading();
      } else if(command == 'w') {
        welcome();
      } else if(command == 'h') {
        help();
      } else {
        unknownCommand(command);
      }
    }
  }
  delay(1);
}

void printActual() {
  int analogValue = analogRead(AIN);
  Serial.println(analogValue);
}

void startReading() {
  if (timePosition == -1) {
    timePosition = 0;
    readingEvent = timer.setTimer(TIME_DELAY, takeReading, TIME_READINGS);
    timer.enable(readingEvent);
    digitalWrite(HIGH, LED);
    Serial.println("Recording 10 values for 10 seconds.");
  } else {
    Serial.print(timePosition);
    Serial.print("/");
    Serial.print(TIME_READINGS);
    Serial.println("... recording in progress, please wait.");
  }
}

void takeReading() {
  if (timePosition >= TIME_READINGS) {
    stopReading();
  } else if (timePosition >= 0) {
    timeSeries[timePosition] = analogRead(AIN);
  }
}

void stopReading() {
  timePosition = -1;
  timer.deleteTimer(readingEvent);
  digitalWrite(LOW, LED);
  Serial.println("... recording reading done.");
}

void welcome() {
  Serial.print("Welcome, I am Arduino - The automatic meassurement system ");
  Serial.print(VERSION);
  Serial.println(".");
}

void help() {
  Serial.println("Command help");
  Serial.println("h - This Command help message");
  Serial.println("w - Welcome message and system version");
  Serial.println("p - Print actual analog value");
  Serial.println("r - Start recording values (for 10s)");
  Serial.println("");
}
void unknownCommand(char command) {
  Serial.print("I don't know, what '");
  Serial.print(command);
  Serial.print("' command means.");
}
