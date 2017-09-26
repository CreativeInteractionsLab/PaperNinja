// This program sends data via Bluetooth

// Import the Arduino serial library
#include <SoftwareSerial.h>
SoftwareSerial mySerial(0, 1); // RX, TX

// Flat value reset button is hooked to pin 7
int pushButton = 12;
int buttonState = 0;
String flatValues = "fv";
int flatA0 = 0;
int flatA1 = 0;
int flatA2 = 0;
int flatA3 = 0;
int flatA4 = 0;
int flatA5 = 0;
int flatA6 = 0;
int flatA7 = 0;

// Setup code here
void setup() {
  mySerial.begin(9600); // Initialize serial communications at 9600 bps
  pinMode(pushButton, INPUT); // Make the pushbutton's pin an input
}

// Main code, loops forever
void loop() {
  // Check button state
  if (digitalRead(pushButton)) {
    buttonState = 0;
  } else {
    buttonState = 1;
    // Update the flat values if button is pressed
    flatA0 = analogRead(A0); // A0
    flatA1 = analogRead(A1); // A1
    flatA2 = analogRead(A2); // A2
    flatA3 = analogRead(A3); // A3
    flatA4 = analogRead(A4); // A4
    flatA5 = analogRead(A5); // A5
    flatA6 = analogRead(A6); // Digital Pin 4
    flatA7 = analogRead(A7); // Digital Pin 6
  }

  // Get the difference between flat value and current analog values
  String flatValues = "";
  flatValues += String(flatA0 - analogRead(A0))+","; // A0
  flatValues += String(flatA1 - analogRead(A1))+","; // A1
  flatValues += String(flatA2 - analogRead(A2))+","; // A2
  flatValues += String(flatA3 - analogRead(A3))+","; // A3
  flatValues += String(flatA4 - analogRead(A4))+","; // A4
  flatValues += String(flatA5 - analogRead(A5))+","; // A5
  flatValues += String(flatA6 - analogRead(A6))+","; // Digital Pin 4
  flatValues += String(flatA7 - analogRead(A7))+","; // Digital Pin 6
  
  // Get analog values and store them in a string to send them via TX pin to Bluetooth
  String data = "";
  data += String(analogRead(A0))+","; // A0
  data += String(analogRead(A1))+","; // A1
  data += String(analogRead(A2))+","; // A2
  data += String(analogRead(A3))+","; // A3
  data += String(analogRead(A4))+","; // A4
  data += String(analogRead(A5))+","; // A5
  data += String(analogRead(A6))+","; // Digital Pin 4
  data += String(analogRead(A7))+","; // Digital Pin 6
  data += String(buttonState); // Digital Pin 12

  // Send data via bluetooth
  mySerial.println(data); // Same as: 
  Serial.println(data);
  
  // Delay 10 milliseconds before the next reading to avoid overload
  delay(10);
}
