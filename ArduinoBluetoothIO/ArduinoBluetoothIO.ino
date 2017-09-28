// This program sends data via Bluetooth

// Import the Arduino serial library
#include <SoftwareSerial.h>
SoftwareSerial mySerial(0, 1); // RX, TX

// Flat value reset button is hooked to pin 8
int pushButton = 8;
int led = 7;
int buttonState = 0;
int bendA0 = 0;
int bendA1 = 0;
int bendA2 = 0;
int bendA3 = 0;

// Setup code here
void setup() {
  mySerial.begin(9600); // Initialize serial communications at 9600 bps
  //setup an led to show status
  pinMode(led, OUTPUT);
  //use the pullup option to save a resistor:  https://www.arduino.cc/en/Tutorial/DigitalInputPullup
  pinMode(pushButton, INPUT_PULLUP); // Make the pushbutton's pin an input
}

// Main code, loops forever
void loop() {
  // Check button state, for pullup buttons, HIGH means open (not pressed)
  if (digitalRead(pushButton) == HIGH) {
    buttonState = 0;
    digitalWrite(led, LOW);
  } else {
    buttonState = 1;
    digitalWrite(led, HIGH);
  }

  // Get analog values and store them in a string to send them via TX pin to Bluetooth
  String data = "";
  data += String(analogRead(A0))+","; // A0
  data += String(analogRead(A1))+","; // A1
  data += String(analogRead(A2))+","; // A2
  data += String(analogRead(A3))+","; // A3
  data += String(buttonState); // Digital Pin 8

  // Send data via bluetooth
  mySerial.println(data);
  // Send it to Serial to see it in the Serial Monitor
  Serial.println(data);
  
  // Delay 10 milliseconds before the next reading to avoid overload
  delay(10);
}
