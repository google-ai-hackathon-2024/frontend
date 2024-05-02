import React, { useState } from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Grid, Typography } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { CircularProgress } from '@mui/material';

function SampleForm({ form, audioSamples, handleFormChange, handleSubmit }) {

    return (
        <MainCard title="Conversation Form">
            <form onSubmit={handleSubmit} autoComplete="off">
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <FormControl fullWidth required>
                            <InputLabel id="conversation-type-label">Conversation Type</InputLabel>
                            <Select
                                labelId="conversation-type-label"
                                name="conversationType"
                                value={form.conversationType}
                                label="Conversation Type"
                                onChange={handleFormChange}
                                required
                            >
                                <MenuItem value="0">Business Meeting</MenuItem>
                                <MenuItem value="1">Debate</MenuItem>
                                <MenuItem value="2">Interview</MenuItem>
                                <MenuItem value="3">Monologue</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            margin="normal"
                            name="conversationTitle"
                            label="Conversation Title"
                            value={form.conversationTitle}
                            onChange={handleFormChange}
                            required
                        />
                    </Grid>
                    {audioSamples.map((sample, index) => (
                        <Grid item xs={12} key={index}>
                            <Typography variant="subtitle1" gutterBottom>
                                Speaker {index + 1} - Audio Sample
                            </Typography>
                            <audio controls style={{ width: '100%' }}>
                                <source src={sample} type="audio/wav" />
                                Your browser does not support the audio tag.
                            </audio>
                            <TextField
                                fullWidth
                                margin="normal"
                                name={`speakerLabel${index}`}
                                label={`Speaker ${index + 1} : Enter the name of the speaker that you hear mostly in the sample.`}
                                value={form[`speakerLabel${index}`]}
                                onChange={handleFormChange}
                                required
                            />
                        </Grid>
                    ))}
                    <Grid item xs={12}>
                        <AnimateButton>
                            <Button type="submit" variant="contained" color="primary" fullWidth>
                           Submit
                            </Button>
                        </AnimateButton>
                    </Grid>
                </Grid>
            </form>
        </MainCard>
    );
}

export default SampleForm;
