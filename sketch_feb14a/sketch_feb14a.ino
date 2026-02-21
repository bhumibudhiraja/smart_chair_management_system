const int fsrPin = 34;   // FSR connected to GPIO34

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("Single FSR Test Started");
}

void loop() {

  int fsrValue = analogRead(fsrPin);

  Serial.print("FSR Value: ");
  Serial.println(fsrValue);

  delay(500);
}