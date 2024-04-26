import React from "react";
import { Recorder } from "react-voice-recorder";
import "./index.css";

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
                }
            },
            showRecorder: true,
            form: {
                conversationType: "",
                conversationTitle: "",
                speakerLabel: ""
            }
        };
    }

    handleAudioStop = (data) => {
        console.log(data);
        this.setState({ audioDetails: data }, () => {
            this.sendAudio(data.blob);
        });
    }

    handleAudioUpload = (file) => {
        console.log(file);
        this.sendAudio(file);
    }

    sendAudio = (audioBlob) => {
        const formData = new FormData();
        formData.append("audio", audioBlob);
        
        fetch("YOUR_API_ENDPOINT", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log("Success:", data);
            this.setState({ showRecorder: false });
        })
        .catch(error => {
            console.error("Error:", error);
        });
    }

    handleFormChange = (e) => {
        this.setState({
            form: { ...this.state.form, [e.target.name]: e.target.value }
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        fetch("ANOTHER_API_ENDPOINT", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(this.state.form)
        })
        .then(response => response.json())
        .then(data => {
            console.log("Form submitted:", data);
            // Handle successful submission, maybe clear form or show a success message
        })
        .catch(error => {
            console.error("Error submitting form:", error);
        });
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
                        handleAudioUpload={this.handleAudioUpload}
                        handleReset={this.handleReset}
                    />
                ) : (
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            Conversation Type:
                            <select name="conversationType" value={this.state.form.conversationType} onChange={this.handleFormChange}>
                                <option value="">Select type</option>
                                <option value="type1">Type 1</option>
                                <option value="type2">Type 2</option>
                                <option value="type3">Type 3</option>
                            </select>
                        </label>
                        <label>
                            Conversation Title:
                            <input type="text" name="conversationTitle" value={this.state.form.conversationTitle} onChange={this.handleFormChange} />
                        </label>
                        <label>
                            Audio samples (label with speaker name):
                            <input type="text" name="speakerLabel" value={this.state.form.speakerLabel} onChange={this.handleFormChange} />
                        </label>
                        <button type="submit">Submit</button>
                    </form>
                )}
            </div>
        );
    }
}

export default SamplePage;
