import React from "react";
import { Recorder } from "react-voice-recorder";
import "./index.css";
import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import SampleForm from "./SampleForm";
import ChatDisplay from "./SampleChat";
import FormDialog from "./FormDialog";  // Import the FormDialog component
import {uploadAudio, setConfig, generateResult, initChatbot} from 'hooks/useApi';  // Path to the custom hook file
import { CircularProgress } from '@mui/material'; // Importing CircularProgress for the loading icon

class SamplePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            audioDetails: {
                file: null,
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
            
            loading: false  // Initialize the loading state as false
            
        };
        this.fileInputRef = React.createRef();
    }

    setLoading = (loading) => {
        this.setState({ loading });
    }


    handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            this.uploadFile(file);
        }
    }

    handleAudioUpload = () => {
        this.fileInputRef.current.click(); // Programmatically click the hidden file input
    }

    uploadFile = async (file) => {
        this.setLoading(true); // Start loading
        try {
            const formData = new FormData();
            formData.append('audio', file);
            const uploadResponse = await uploadAudio(formData);
            console.log('Upload successful:', uploadResponse);
            this.setState(prevState => ({
                audioDetails: {
                    ...prevState.audioDetails,
                    convID: uploadResponse.convID, // Assuming your API returns an audioID
                    // url: uploadResponse.audioURL // Assuming your API returns a new URL for the uploaded file
                }
            }));
        } catch (error) {
            console.error('Error during audio upload:', error);
        }
        this.setLoading(false); // End loading regardless of success or failure
        this.toggleFormDialog();
    }

    handleReset() {
        const reset = {
            file: null,
          url: null,
          blob: null,
          chunks: null,
          duration: {
            h: 0,
            m: 0,
            s: 0
          }
        };
        this.state.audioDetails = reset;
      }

    //     handleAudioUpload = async () => {
    //     const { file } = this.state.audioDetails;
    //     if (!file) {
    //         console.error("No file selected for upload.");
    //         return;
    //     }

    //     try {
    //         const formData = new FormData();
    //         formData.append('audio', file);
    //         const uploadResponse = await uploadAudio(formData);
    //         console.log('Upload successful:', uploadResponse);
    //         this.setState(prevState => ({
    //             audioDetails: {
    //                 ...prevState.audioDetails,
    //                 convID: uploadResponse.convID,
    //                 url: uploadResponse.audioURL
    //             }
    //         }));
    //     } catch (error) {
    //         console.error('Error during audio upload:', error);
    //     }
    // }


    handleAudioStop = async (data) => {
        console.log(data);
        this.setLoading(true); // End loading regardless of success or failure
        // Update state with the new audio details
        this.setState({
            audioDetails: {
                ...this.state.audioDetails,
                url: URL.createObjectURL(data.blob),
                blob: data.blob,
                chunks: data.chunks,
                duration: data.duration
            }
        });
    
        try {
            // Use FormData to prepare the file for uploading
            const formData = new FormData();
            formData.append('audio', data.blob); // Append the blob from state to FormData, and set filename
            console.log(formData)
            // Assume uploadAudio is a defined async function to handle API upload
            const uploadResponse = await uploadAudio(formData); // Send FormData to the API
            this.setState(prevState => ({
                audioDetails: {
                    ...prevState.audioDetails,
                    convID: uploadResponse.convID, // Assuming your API returns an audioID
                    // url: uploadResponse.audioURL // Assuming your API returns a new URL for the uploaded file
                }
            }), () => {
                console.log('Upload successful:', uploadResponse);
            });
        } catch (error) {
            console.error('Error during audio upload:', error);
        } finally {
            this.setLoading(false); // End loading regardless of success or failure
        }
        // Open the form dialog to enter participants
        console.log(this.state.audioDetails.convID)
        this.toggleFormDialog();
    }
   

    sendParticipantInfo = (participants) => {
        this.setLoading(true); // End loading regardless of success or failure    
        const speakerCnt1 = parseInt(participants, 10); // Parse to integer as expected by the API
        const conversationID = this.state.audioDetails.convID;
        console.log("conversationID", conversationID)
        const dataToSend = {
            convID: conversationID,
            speakerCnt: speakerCnt1
        };
    
        // Using useApi.setConfig to send the participant info
        setConfig(dataToSend)
            .then(response => {
                console.log("Configuration set successfully:", response.audioURLs);
                // Assuming the response contains convID and audioURLs
                this.setState(prevState => ({
                    audioDetails: {
                        ...prevState.audioDetails,
                    },
                    audioSamples: response.audioURLs  // Update audio samples with new URLs
                }));
                this.setState({ showRecorder: false });  // Update UI state as necessary
            })
            .catch(error => {
                console.error("Error setting configuration:", error);
            }).finally(() => {
                this.setLoading(false); // End loading regardless of success or failure
            });
        console.log("Participant count submitted:", participants);
        // this.state.showRecorder = false;
        // this.state.showChat = true;
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        this.setLoading(true); // End loading regardless of success or failure
        const { conversationType, conversationTitle, speakerNames } = this.state.form;
        const convType = parseInt(conversationType, 10); // Parse to integer as expected by the API
    
        const dataToSend = {
            convID: this.state.audioDetails.convID,
            // convID: "AOPPY4",
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
        }finally {
            this.setLoading(false); // End loading regardless of success or failure
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
        const { showRecorder, showChat, showFormDialog, loading } = this.state;
        const overlayStyle = {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,  // Ensure it stretches across the entire screen
            bottom: 0, // Ensure it stretches across the entire screen
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1500  // Ensure it is above everything else
        };

        return (
            <div className="App">
                {loading && <div style={overlayStyle}><CircularProgress /></div>}
                <div style={{ opacity: loading ? 0.3 : 1 }}> {/* Apply opacity to entire content when loading */}
                    {showRecorder && (
                        <Recorder
                            record={true}
                            title={"New recording"}
                            audioURL={this.state.audioDetails.url}
                            // showUIAudio
                            handleAudioStop={this.handleAudioStop}
                            handleAudioUpload={this.handleAudioUpload}
                            handleReset={this.handleReset}
                            mimeTypeToUseWhenRecording={`audio/webm`}
                        />
                    )}
                    <input
                        type="file"
                        style={{ display: 'none' }}
                        onChange={this.handleFileChange}
                        ref={this.fileInputRef}
                        accept="audio/*"
                    />
                    {showChat && <ChatDisplay
                        convID={this.state.audioDetails.convID}
                    />}
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
            </div>
        );
    }
}

export default SamplePage;