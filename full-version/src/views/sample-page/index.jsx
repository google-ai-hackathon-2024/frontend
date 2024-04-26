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
            audioSamples: [
                'https://storage.googleapis.com/talking-dataset/AOPPY4/1_sample_audio.wav',
                'https://storage.googleapis.com/talking-dataset/AOPPY4/1_sample_audio.wav',
                'https://storage.googleapis.com/talking-dataset/AOPPY4/1_sample_audio.wav'
            ],
            showRecorder: true,
            form: {
                conversationType: "",
                conversationTitle: "",
                speakerLabel: ""
            },
            participants: 0,
        };
    }

    handleAudioStop = async (data) => {
        console.log(data);
        const audioUrl = URL.createObjectURL(data.blob);
        const link = document.createElement('a');
        link.href = audioUrl;
        link.download = "recorded_audio.wav";
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

        const formData = new FormData();
        formData.append("audio", data.blob);
        try {
            const response = await fetch("http://localhost:8000/posts", {
                method: "GET",
            });
            const result = await response.json();
            const audioID = result.audioID;
            this.setState({ audioDetails: { ...this.state.audioDetails, audioID } }, () => {
                const participants = prompt("Enter the total number of participants:");
                if (participants) {
                    this.sendParticipantInfo(parseInt(participants, 10));
                    this.setState({ showRecorder: false });
                }
            });
        } catch (error) {
            console.error("Error posting audio:", error);
        }
    }

    sendParticipantInfo = (participants) => {
        const { audioDetails: { audioID } } = this.state;
        // fetch("ANOTHER_API_ENDPOINT", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify({ audioID, participants })
        // })
        // .then(response => response.json()) 
        // .then(data => {
        //     console.log("Participants data submitted:", data);
        // })
        // .catch(error => {
        //     console.error("Error submitting participants info:", error);
        // });
    }

    handleFormChange = (e) => {
        this.setState({
            form: { ...this.state.form, [e.target.name]: e.target.value }
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting form with:", this.state.form);
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
                        mimeTypeToUseWhenRecording={"audio/webm"}
                        showUIAudio
                    />
                ) : (
                    <form onSubmit={this.handleSubmit} noValidate autoComplete="off" style={{ width: '50%' }}>
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
                        {this.state.audioSamples.map((sample, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                                <audio controls style={{ width: '50%', marginRight: '20px' }}>
                                    <source src={sample} type="audio/wav" />
                                    Your browser does not support the audio tag.
                                </audio>
                                <TextField
                                    margin="normal"
                                    name={`speakerLabel${index}`}
                                    label={`Speaker Label for Sample ${index + 1}`}
                                    value={this.state.form[`speakerLabel${index}`]}
                                    onChange={this.handleFormChange}
                                    style={{ flexGrow: 1 }}
                                />
                            </div>
                        ))}
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