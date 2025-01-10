/**
 * Script Name: autoSendMessagesOnCompartoDepto.js
 * Author: Daniel Darritchon
 * Description: Automates sending personalized messages to listings on https://www.compartodepto.cl, allowing sending automated messages and enabling seamless navigation between pages.
 * Version: 1.0
 * Created on: January 9, 2025
 * Last updated: January 9, 2025
 * Ownership: © 2025 Daniel Darritchon. All rights reserved.
 */

/*
    * Instructions:
    1. Log in to [CompartoDepto.cl](https://www.compartodepto.cl).  
    2. Open the browser's developer tools (press `F12` or `Ctrl+Shift+I`).  
    3. Go to the **Console** tab.  
    4. Customize the following variables in the script:  
        - `userMessageTemplate`: Template for the message. Use `{name}` as a placeholder for the listing owner’s name.  
        - `myPropertyValue`: Set the minimum rental price (in CLP) for filtering listings.  
    5. Copy the entire script and paste it into the **Console**.  
    6. Press `Enter` to start the script.  

    * Notes:
    - This script is intended for educational purposes only.
    - Use responsibly and respect the platform's terms of service.
    - The script may need adjustments due to website changes.
    - The script may not work in all scenarios or listings.
    - Refresh the page to stop the script.
*/

let userMessageTemplate = `¡Hola {name}! ¿Cómo estás?

Te cuento que justo se me acaba de desocupar una habitación con baño privado, que está completamente amoblada. El ambiente es familiar, tranquilo y limpio.

El edificio se encuentra dentro de un condominio que cuenta con buena movilización y seguridad en el edificio. El condominio tiene piscina, gimnasio, sauna, amplias áreas verdes y se ubica a 2 cuadras del metro Manquehue, frente a supermercado, y a 2 cuadras del Parque Arauco, frente al Parque Juan Pablo II y Parque Araucano.

Te dejo mi celular por aquí para que puedas contactarme y poder coordinar una visita si gustas.+56956156842

Quedo atenta, que tengas buena noche!`

const myPropertyValue = 400000; // Reemplazar con el valor de la habitación (en pesos chilenos)

// Script

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let dealyMs = 1000;

let totalMessagesSent = 0;

const checkListingPrice = (listing) => {
    const rentElement = listing.querySelector("div[data-test='ps-listing-rent']");
    if (!rentElement) {
        throw new Error("No se encontró el elemento de alquiler.");
    }

    const rentText = rentElement.textContent.trim(); // e.g., "CH$400.000"
    const rentAmount = parseInt(rentText.replace(/[^0-9]/g, ""), 10); // Extracts the number from the text

    if (rentAmount < myPropertyValue) {
        throw new Error("El precio de alquiler es menor que el valor de mi habitación.");
    }
};

const checkAlreadyContacted = (listing) => {
    const alreadyContactedElement = listing.querySelector("span[data-test='ps-listing-is-messaged-desktop']");
    if (alreadyContactedElement && getComputedStyle(alreadyContactedElement).display !== "none") {
        throw new Error("Ya contactado.");
    }
};

const getListingName = (listing) => {
    const nameElement = listing.querySelector("a.js-listingUrl[data-test='ps-listing-title']");
    const listingName = nameElement ? nameElement.textContent : "";
    const name = listingName.split(",")[0].trim();
    return name;
};

const inputCustomMessage = (element, name) => {
    const textarea = element.querySelector("#sendMsgTxt");
    textarea.value = ""; // Clear existing text
    const customMessage = userMessageTemplate.replace("{name}", name);
    textarea.value = customMessage;
    return textarea;
};

const removeDisabledAttribute = (element) => {
    // Remove the disabled attribute if it exists
    if (element.hasAttribute("disabled")) {
        element.removeAttribute("disabled");
    }
    // Optionally force the button to be enabled
    element.disabled = false;
}

const _sendMessage = async (listing) => {
    listing.scrollIntoView();

    await delay(dealyMs);

    checkAlreadyContacted(listing);

    checkListingPrice(listing);

    const name = getListingName(listing);

    const sendMsgButton = listing.querySelector("a.js-sendMsgBtn");
    sendMsgButton.click();

    await delay(dealyMs); // Wait for the popup to appear

    const popup = document.querySelector("#sendMessageModal");
    if (!popup) throw new Error("No se encontró el popup de mensaje.");

    const textArea = inputCustomMessage(popup, name);

    const sendButton = popup.querySelector("#sendMsgBtn");

    removeDisabledAttribute(sendButton);

    await delay(dealyMs); // Wait for the message to be typed

    sendButton.click();

    await delay(dealyMs); // Wait for the message to be sent

    console.log(`Mensaje enviado a ${name}.`);
    textArea.value = ""; // Clear existing text
    totalMessagesSent++;
};

const sendMessageToListing = async (listing) => {
    try {
        await _sendMessage(listing);
    } catch (err) {
        console.warn("Error enviando mensaje:", err);
    }
};

const processListingsOnPage = async () => {
    const listings = document.querySelectorAll(".listing");
    console.log(`Encontradas ${listings.length} contactos en esta página.`);
    for (let i = 0; i < listings.length; i++) {
        await sendMessageToListing(listings[i]);
    }
};

const maybeGoToNextPage = async () => {
    try {
        const nextButton = document.querySelector(".pagination.pagination-next.show-next");
        if (nextButton) {
            nextButton.click();
            await delay(5000); // Wait for the next page to load
            return true;
        }
        return false;
    } catch (err) {
        console.warn("Error al ir a la siguiente página:", err);
        return false;
    }
};

const processAllListings = async () => {
    console.log("Empezando a procesar todas las páginas...");
    do {
        await processListingsOnPage();
    } while (await maybeGoToNextPage());
    console.log(`Total de mensajes enviados: ${totalMessagesSent}`);
};

processAllListings();
