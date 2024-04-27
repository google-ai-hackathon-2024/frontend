import React from "react";
import { Recorder } from "react-voice-recorder";
import "./index.css";
import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import SampleForm from "./SampleForm";
import ChatDisplay from "./SampleChat";
import FormDialog from "./FormDialog";  // Import the FormDialog component
import {uploadAudio, setConfig, generateResult, initChatbot} from 'hooks/useApi';  // Path to the custom hook file

class SamplePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            audioDetails: {
                url: null,
                blob: null,
                chunks: null,
                duration: {
                    h: 0,
                    m: 0,
                    s: 0
                },
                convID: null
            },
            audioSamples: [
                'https://storage.googleapis.com/talking-dataset/AOPPY4/1_sample_audio.wav',
                'https://storage.googleapis.com/talking-dataset/AOPPY4/1_sample_audio.wav',
                // 'https://storage.googleapis.com/talking-dataset/AOPPY4/1_sample_audio.wav'
            ],
            transcriptURL: '', // Added to store the transcript URL
            summaryURL: '', // Added to store the summary URL
            showRecorder: true,
            showChat: false,
            showFormDialog: false,
            form: {
                conversationType: "",
                conversationTitle: "",
                speakerNames: [] // Changed to an array to store speaker names
            },
            chatData: {
                user: "Sample User",
                messages: [
                    { text: "Hello, how are you?" },
                    { text: "I'm fine, thanks for asking!" }
                ]
            }
        };
    }
    
    
    

    handleAudioStop = async (data) => {
        console.log(data);
        const audioUrl = URL.createObjectURL(data.blob);
        const link = document.createElement('a');
        link.href = audioUrl;
        link.download = "recorded_audio.wav";
        console.log(link)
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(audioUrl);

        this.setState({
            audioDetails: {
                ...this.state.audioDetails,
                url: audioUrl,
                blob: data.blob,
                chunks: data.chunks,
                duration: data.duration
            }
        });

        try {
            const uploadResponse = await uploadAudio("/Users/em/Documents/backend/dataset/biz-meeting/biz-result-oup-brainstorming-meeting_16k.wav"); //set your download folder here
            this.state.audioDetails.convID = uploadResponse.convID;
            this.state.audioDetails.url = uploadResponse.audioURL;
            console.log('Upload successful:', uploadResponse);
        } catch (error) {
            console.error('Error during audio upload:', error);
        }

        // Open the form dialog to enter participants
        this.toggleFormDialog();
    }
   

    sendParticipantInfo = (participants) => {
        const { convID } = this.state.audioDetails;
    
        const dataToSend = {
            convID,
            speakerCnt: participants
        };
    
        // Using useApi.setConfig to send the participant info
        setConfig(dataToSend)
            .then(response => {
                console.log("Configuration set successfully:", response);
                // Assuming the response contains convID and audioURLs
                // this.setState(prevState => ({
                //     audioDetails: {
                //         ...prevState.audioDetails,
                //         convID: response.convID,  // Update convID in case it's new or changed
                //     },
                //     audioSamples: response.audioURLs  // Update audio samples with new URLs
                // }));
                // this.setState({ showRecorder: false });  // Update UI state as necessary
            })
            .catch(error => {
                console.error("Error setting configuration:", error);
            });
    
        console.log("Participant count submitted:", participants);
        this.state.showRecorder = false;
        // this.state.showRecorder = false;
        // this.state.showChat = true;
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        const { conversationType, conversationTitle, speakerNames } = this.state.form;
        const convType = parseInt(conversationType, 10); // Parse to integer as expected by the API
    
        const dataToSend = {
            // convID: this.state.audioDetails.convID,
            convID: "AOPPY4",
            speakerName: speakerNames, // This should be the array of speaker names
            convType, // Integer representation of conversation type
            convTitle: conversationTitle // Conversation title
        };
    
        try {
            const response = await generateResult(dataToSend);
            console.log("Result generated successfully:", response);
            const response1 = await initChatbot(dataToSend.convID);
            this.setState({
                audioDetails: {
                    ...this.state.audioDetails,
                },
                transcriptURL: response.transcriptURL,
                summaryURL: response.summaryURL,
                showChat: true
            }, () => {
                // Log the updated state after the callback ensures the state has been updated
                console.log("SummaryURL: ", this.state.summaryURL);
                console.log("TranscriptURL: ", this.state.transcriptURL);
                console.log("chat status:", this.state.showChat);
               
            });
        } catch (error) {
            console.error("Error submitting form data:", error);
        }
    };

    handleFormChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value)
        // Check if the changed field is one of the speaker names.
        if (name.startsWith("speakerLabel")) {
            // Extract the index number from the field's name. Assumes naming convention "speakerNameX".
            const index = parseInt(name.replace("speakerLabel", ""), 10);
            console.log(index)
            // Update the state with the new speaker name at the correct index.
            this.setState(prevState => {
                // Copy the existing array of speaker names.
                let newSpeakerNames = [...prevState.form.speakerNames];
    
                // Update the speaker name at the specified index.
                newSpeakerNames[index] = value;
    
                // If there are empty strings at the end of the array, remove them.
                newSpeakerNames = newSpeakerNames.filter(name => name.trim() !== "");
    
                // Return the new state with updated speaker names.
                return {
                    form: {
                        ...prevState.form,
                        speakerNames: newSpeakerNames
                    }
                };
            });
        } else {
            // For all other fields, just set the new value.
            this.setState({
                form: {
                    ...this.state.form,
                    [name]: value
                }
            });
        }
    };

    toggleFormDialog = () => {
        this.setState(prevState => ({ showFormDialog: !prevState.showFormDialog }));
    }

    render() {
        const { showRecorder, showChat, showFormDialog, audioDetails } = this.state;
        return (
            <div className="App">
                {showRecorder && (
                    <Recorder
                        record={true}
                        title={"New recording"}
                        audioURL={audioDetails.url}
                        handleAudioStop={this.handleAudioStop}
                        mimeTypeToUseWhenRecording={"audio/webm"}
                        // showUIAudio
                    />
                )}
                {showChat && (
                    <ChatDisplay
                    user={this.state.chatData.user}
                    messages={this.state.chatData.messages}
                    convID={this.state.audioDetails.convID} // Pass convID as a prop to ChatDisplay
                    transcriptURL={this.state.transcriptURL} // Pass transcript URL as a prop to ChatDisplay
                    summaryURL={this.state.summaryURL} // Pass summary URL as a prop to ChatDisplay
                />
                )}
                {!showRecorder && !showChat && (
                    <SampleForm
                        form={this.state.form}
                        audioSamples={this.state.audioSamples}
                        handleFormChange={this.handleFormChange}
                        handleSubmit={this.handleSubmit}
                    />
                )}
                <FormDialog
                    open={showFormDialog}
                    onClose={this.toggleFormDialog}
                    onSubmit={this.sendParticipantInfo}
                />
            </div>
        );
    }
}

export default SamplePage;
