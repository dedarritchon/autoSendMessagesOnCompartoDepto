# autoSendMessagesOnCompartoDepto.js  

## Overview  
This project provides a script to automate sending personalized messages to listings on [CompartoDepto.cl](https://www.compartodepto.cl). It helps users save time by processing multiple listings, sending automated messages, and navigating between pages seamlessly.  

## Features  
- Automatically sends personalized messages to listings.  
- Verifies that the rental price is above a defined threshold before sending messages.  
- Automatically navigates to the next page after processing all listings on the current page.  
- Provides an easy-to-customize template for messages.  

## Usage Instructions  

### Prerequisites  
1. A valid account on [CompartoDepto.cl](https://www.compartodepto.cl).  
2. A modern web browser (e.g., Chrome, Firefox, Edge) with developer tools.  

### Steps  
1. Log in to [CompartoDepto.cl](https://www.compartodepto.cl).  
2. Open the browser's developer tools (press `F12` or `Ctrl+Shift+I`).  
3. Go to the **Console** tab.  
4. Customize the following variables in the script:  
   - `userMessageTemplate`: Template for the message. Use `{name}` as a placeholder for the listing owner’s name.  
   - `myPropertyValue`: Set the minimum rental price (in CLP) for filtering listings.  
5. Copy the entire script and paste it into the **Console**.  
6. Press `Enter` to start the script.  

### Notes  
- The script is **intended for educational purposes only**.  
- Always respect the platform’s [terms of service](https://www.compartodepto.cl/terms).  
- The script may require adjustments if the website's structure changes.  
- Refresh the page to stop the script.  

## Example Message Template  
```javascript
let userMessageTemplate = `¡Hola {name}! ¿Cómo estás?  
Te cuento que justo se me acaba de desocupar una habitación con baño privado, que está completamente amoblada.  
El edificio se encuentra dentro de un condominio con buena movilización y seguridad.  
Quedo atento/a a cualquier consulta. ¡Saludos!`;  
