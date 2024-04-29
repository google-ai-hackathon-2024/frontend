import React from "react";
import { Recorder } from "react-voice-recorder";
import "./index.css";
import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

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
                audioID: null
            },
            showRecorder: true,
            form: {
                conversationType: "",
                conversationTitle: "",
                speakerLabel: ""
            },
            participants: 0
        };
    }

    handleAudioStop = (data) => {
        console.log(data);
    
        // Create a URL for the Blob
        const audioUrl = URL.createObjectURL(data.blob);
    
        // Create an anchor element and trigger download
        const link = document.createElement('a');
        link.href = audioUrl;
        link.download = "recorded_audio.webm"; // You can specify the desired file name and extension
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    
        // Free up the Blob URL
        URL.revokeObjectURL(audioUrl);
    
        // Optional: update the state if needed
        this.setState({ 
            audioDetails: {
                ...this.state.audioDetails,
                url: audioUrl, // You might want to save this for some other purposes in your app
                blob: data.blob,
                chunks: data.chunks,
                duration: data.duration
            }
        });
    }

    sendParticipantInfo = () => {
        const { audioDetails: { audioID }, participants } = this.state;
        fetch("ANOTHER_API_ENDPOINT", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ audioID, participants })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Participants data submitted:", data);
            this.setState({ showRecorder: false });
        })
        .catch(error => {
            console.error("Error submitting participants info:", error);
        });
    }

    handleFormChange = (e) => {
        this.setState({
            form: { ...this.state.form, [e.target.name]: e.target.value }
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting form with:", this.state.form);
        // Here you would typically handle form submission, e.g., updating a database or posting to another API
    }

    render() {
        return (
            <div className="App">
                {this.state.showRecorder ? (
                    <Recorder
                        record={true}
                        title={"New recording"}
                        audioURL={this.state.audioDetails.url}
                        handleAudioStop={this.handleAudioStop}
                        mimeTypeToUseWhenRecording="audio/webm"
                        showUIAudio
                    />
                ) : (
                    <form onSubmit={this.handleSubmit} noValidate autoComplete="off">
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Conversation Type</InputLabel>
                            <Select
                                name="conversationType"
                                value={this.state.form.conversationType}
                                label="Conversation Type"
                                onChange={this.handleFormChange}
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                <MenuItem value="type1">Type 1</MenuItem>
                                <MenuItem value="type2">Type 2</MenuItem>
                                <MenuItem value="type3">Type 3</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            margin="normal"
                            fullWidth
                            name="conversationTitle"
                            label="Conversation Title"
                            value={this.state.form.conversationTitle}
                            onChange={this.handleFormChange}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            name="speakerLabel"
                            label="Audio samples (label with speaker name)"
                            value={this.state.form.speakerLabel}
                            onChange={this.handleFormChange}
                        />
                        <Button type="submit" variant="contained" color="primary">
                            Submit
                        </Button>
                    </form>
                )}
            </div>
        );
    }
}

export default SamplePage;
