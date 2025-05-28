// Configuration for API

const config  = {
    // Access JSON server for front end testing
    "dev" : {
        "API_URL": "http://localhost:3001"
    },
    // When the back end is built, set the url here
    "prod" : {
        "API_URL": null
    }
}

// Just need to alter here
const curConfig = config["dev"]
export const API_URL = curConfig["API_URL"];
