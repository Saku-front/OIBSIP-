# ThermoShift — Temperature Converter

A polished Vanilla HTML/CSS/JavaScript temperature converter supporting Celsius, Fahrenheit, and Kelvin.

## Features
- Celsius / Fahrenheit / Kelvin input selector
- Converts to all three units simultaneously
- Click-to-convert interaction
- Real-time numeric validation
- Absolute-zero validation
- Responsive glassmorphism UI
- Animated aurora background and result cards
- Accessible labels, live regions, and keyboard-friendly controls

## Run
Open `index.html` in a browser. No build step or dependencies are required.

## Formulas
- C → F: `(C × 9/5) + 32`
- F → C: `(F − 32) × 5/9`
- C → K: `C + 273.15`
- K → C: `K − 273.15`

The validation approach is informed by MDN's HTML constraint-validation guidance.
