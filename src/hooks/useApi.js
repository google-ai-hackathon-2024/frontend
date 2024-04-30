import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5555';



// Upload audio file to GCP bucket
export const uploadAudio = async (audioFile) => {
    try {
        // const formData = new FormData();
        // formData.append('audio', audioFile); // 'audio' must match the key expected by the Flask endpoint

        const response = await axios.post(`${API_URL}/audio`, audioFile, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data; // Return conversation ID and other data
    } catch (error) {
        console.error('Error uploading audio:', error);
        throw error;
    }
};

// Set configuration for generating transcript
export const setConfig = async (dataToSend) => {
    try {
        const response = await axios.post(`${API_URL}/config`, dataToSend);
        return response.data;
    } catch (error) {
        console.error('Error setting configuration:', error);
        throw error;
    }
};

// Generate result after conversation analysis
export const generateResult = async (dataToSend) => {
    try {
        const response = await axios.post(`${API_URL}/result`, dataToSend);
        return response.data;
    } catch (error) {
        console.error('Error generating result:', error);
        throw error;
    }
};

// Initialize chatbot session
export const initChatbot = async (convID) => {
    try {
        const response = await axios.get(`${API_URL}/chatbot`, {
            params: { convID },
        });
        return response.data;
    } catch (error) {
        console.error('Error initializing chatbot:', error);
        throw error;
    }
};

// Get chatbot answer
export const getChatbotAnswer = async (convID, input) => {
    try {
        const response = await axios.post(`${API_URL}/chatbot`, {
            input,
        }, {
            params: { convID },
        });
        return response.data.answer;
    } catch (error) {
        console.error('Error getting answer from chatbot:', error);
        throw error;
    }
};
