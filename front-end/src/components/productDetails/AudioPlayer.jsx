import {API_URL} from "../../config/api.js"
import axios from "axios";
import {useEffect, useState} from "react";

const AudioPlayer = ({ fileName }) => {
    const audioUrl = `${API_URL}/audio/${fileName}`;

    return (
        <audio controls>
            <source src={audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
        </audio>
    );
};

export default AudioPlayer;