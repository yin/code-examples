#include <SimpleTimer.h>

/*
 This Arduino sketch was made as semestral project from the subject:
 Automatic Meassurements Systems

 TUKE university in Kosice
 2013 (C) Matej Gagyi
 */

#define VERSION     "1.0"
#define LED          1
#define AIN          A0
#define TIME_DELAY     1000
#define TIME_READINGS  10

int timeSeries[10];
int timePosition = -1;
SimpleTimer timer;
int readingEvent = -1;

int inPin = AIN;

// the setup routine runs once when you press reset:
void setup() {
  pinMode(LED, OUTPUT);
  digitalWrite(LOW, LED);
  
  // initialize serial communication at 9600 bits per second:
  Serial.begin(9600);
  intro();
}

void intro() {
  Serial.println("Type command 'h' to see what I can do for you.");
}

// the loop routine runs over and over again forever:
void loop() {
  delay(10);
  if (Serial.available() > 0) {
    char command = Serial.read();
    if (command == 'p') {
      printActual();
    } else if (command == 'r') {
      startReading();
    } else if (command == 'e') {
      stopReading();
    } else if (command == 't') {
      printRecords();
    } else if(command == 'w') {
      welcome();
    } else if(command == 'h') {
      help();
    } else if(command == '0') {
      setIn(0, A0);
    } else if(command == '1') {
      setIn(1, A1);
    } else if(command == '2') {
      setIn(2, A2);
    } else if(command == '3') {
      setIn(3, A3);
    } else if(command == '4') {
      setIn(4, A4);
    } else if(command == '5') {
      setIn(5, A5);
    } else {
      unknownCommand(command);
    }
  }
  timer.run();
  delay(1);
}

void setIn(int pinNum, int pin) {
  inPin = pin;
  Serial.print("Input PIN set to: ");
  Serial.println(pinNum);
}

void printActual() {
  int analogValue = analogRead(inPin);
  Serial.println(analogValue);
}

void printRecords() {
  for (int i = 0; i < TIME_READINGS; i++) {
    Serial.println(timeSeries[i]);
  }
}

void startReading() {
  if (timePosition == -1) {
    timePosition = 0;
    readingEvent = timer.setTimer(TIME_DELAY, takeReading, TIME_READINGS);
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
  Serial.println("reading value");
  if (timePosition >= 0 && timePosition < TIME_READINGS) {
    timeSeries[timePosition++] = analogRead(inPin);
  }
  if (timePosition >= TIME_READINGS - 1) {
    stopReading();
  }
}

void stopReading() {
  digitalWrite(LOW, LED);
  Serial.println("... recording reading done.");
  timePosition = -1;
  timer.deleteTimer(readingEvent);
}

void welcome() {
  Serial.print("Welcome, I am Arduino - The automatic measurement system ");
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
