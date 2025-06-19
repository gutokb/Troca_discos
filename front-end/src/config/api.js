// Configuration for API

const config  = {
    // Access JSON server for front end testing
    "dev" : {
        "API_URL": "http://localhost:3001/api"
    },
    // When the back end is built, set the url here
    "prod" : {
        "API_URL": "http://localhost:8000/api"
    }
}

// Detecta automaticamente com base na URL
const isLocalhost = window.location.hostname === "localhost";
const curConfig = isLocalhost ? config.prod : config.prod;

export const API_URL = curConfig.API_URL;
