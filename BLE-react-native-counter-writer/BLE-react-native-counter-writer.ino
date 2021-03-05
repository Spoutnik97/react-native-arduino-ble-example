
// Includes libraries needed
#include <Arduino.h>
#include "Adafruit_BLE.h"
#include "Adafruit_BluefruitLE_UART.h"
#include "BluefruitConfig.h"

#if SOFTWARE_SERIAL_AVAILABLE
  #include <SoftwareSerial.h>
#endif

    #define FACTORYRESET_ENABLE         1
    #define MINIMUM_FIRMWARE_VERSION    "0.6.6"
    #define MODE_LED_BEHAVIOUR          "MODE"


// Initialize the Software serial link to read data from the module
SoftwareSerial bluefruitSS = SoftwareSerial(BLUEFRUIT_SWUART_TXD_PIN, BLUEFRUIT_SWUART_RXD_PIN);

// Create bluetooth LE class to control our BLE module 
Adafruit_BluefruitLE_UART ble(bluefruitSS, BLUEFRUIT_UART_MODE_PIN,
                      BLUEFRUIT_UART_CTS_PIN, BLUEFRUIT_UART_RTS_PIN);

// defines the pin where the RGB led is wired
int pinR = 3;
int pinG = 5;
int pinB = 6;

// create variables to check characteristics have been created successful
int counterChannel;
int elevationChannel;

// initialize the counter to 0
int counter = 0;


// A small helper
void error(const __FlashStringHelper*err) {
  Serial.println(err);
  digitalWrite(pinR, 255);
  while (1);
}

void setup(void)
{
  pinMode(pinR, OUTPUT);
  pinMode(pinG, OUTPUT);
  pinMode(pinB, OUTPUT);

  // At the beginning all the led are turned down
  analogWrite(pinR, 0);
  analogWrite(pinG, 0);
  analogWrite(pinB, 0);

  // verify if the serial port is available, and initialize it to display some informations
  while(!Serial) {
    delay(500);
  }

  Serial.begin(115200);

  /* Initialise the module */
  Serial.print(F("Initialising the Bluefruit LE module: "));

  if ( !ble.begin(VERBOSE_MODE) )
  {
    error(F("Couldn't find Bluefruit, make sure it's in CoMmanD mode & check wiring?"));
  }

  if ( FACTORYRESET_ENABLE )
  {
    /* Perform a factory reset to make sure everything is in a known state */
    Serial.println(F("Performing a factory reset: "));
    if ( !ble.factoryReset() ){
      error(F("Couldn't factory reset"));
    }
  }

  /* Disable command echo from Bluefruit */
  ble.echo(false);

  Serial.println("Requesting Bluefruit info:");
  /* Print Bluefruit information */
  ble.info();

  ble.reset();
 
   ble.println(F("AT+GATTADDSERVICE=UUID=0x180F"));
   if(!ble.waitForOK()){
    error(F("Error adding service"));
   } 
   
   counterChannel = ble.println(F("AT+GATTADDCHAR=UUID=0x2A19,PROPERTIES=0x10,MIN_LEN=1,DESCRIPTION=Counter,VALUE=100"));

   if(counterChannel == 0){
     error(F("Error adding characteristic"));
   }

   elevationChannel = ble.println(F("AT+GATTADDCHAR=UUID=0x2A6C,PROPERTIES=0x08,MIN_LEN=1,DESCRIPTION=Elevation,VALUE=0"));

   if(elevationChannel == 0){
     error(F("Error adding characteristic"));
   }


  // reset the BLE module to take in count the previous modifications
  ble.reset();
  Serial.println();
  
  ble.verbose(false);  // debug info is a little annoying after this point!

  // set the callbacks to detect when a device has just been connected or disconnected to the BLE module
  ble.setConnectCallback(connected);
  ble.setDisconnectCallback(disconnected);

  
  /* Wait for connection */
  while (!ble.isConnected()) {
      digitalWrite(pinB, 255);
      delay(500);
      digitalWrite(pinB, 0);
      delay(500);
  }
  digitalWrite(pinB, 0);
  digitalWrite(pinG, 255);
  delay(1000);
 
}

void loop(void)
{
   ble.update(200);

  // send the AT command to read the second characteristic we added
  int elevation = ble.println(F("AT+GATTCHAR=2"));

  // if an error occured ("OK" is not received), then display an error message
  if(!ble.waitForOK()) {
    Serial.println(F("Error when reading elevation"));
   }

  // print the elevation value in the serial monitor
  Serial.print(F("[Elevation] ")); Serial.println(elevation);


  // increase the counter value of 1;
  counter++;

  // send the AT command to write the counter value in the first characteristic we added
  ble.print(F("AT+GATTCHAR=1,"));
  ble.println(counter);

  // handle the error if "OK" is not received
  if(!ble.waitForOK()) {
    Serial.println(F("Error when sending counter"));
   }

  // the green LED blinks to informe the user the counter inscreased
   digitalWrite(pinG, 0);
   delay(500);
   digitalWrite(pinG, 255);
   delay(500);
  
}
  
void connected(void)
{
  Serial.println( F("Connected") );
  digitalWrite(pinR, 0);
  digitalWrite(pinG, 255);
  digitalWrite(pinB, 0);
}

void disconnected(void)
{
  counter = 0;
  Serial.println( F("Disconnected") );
  digitalWrite(pinR, 0);
  digitalWrite(pinG, 0);
  digitalWrite(pinB, 255);
}
