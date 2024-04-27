import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

export default function FormDialog({ open, onClose, onSubmit, participants }) {
    const [participantCount, setParticipantCount] = React.useState(participants || '');

    const handleCancel = () => {
        onClose();
    };

    const handleSubmit = () => {
        onSubmit(participantCount);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleCancel} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Enter Participants</DialogTitle>
            <DialogContent>
                <Stack spacing={3}>
                    <DialogContentText>
                        <Typography variant="body2" component="span">
                            Please enter the total number of participants:
                        </Typography>
                    </DialogContentText>
                    <TextField
                        autoFocus
                        size="small"
                        id="participants"
                        label="Number of Participants"
                        type="number"
                        value={participantCount}
                        onChange={(e) => setParticipantCount(e.target.value)}
                        fullWidth
                    />
                </Stack>
            </DialogContent>
            <DialogActions sx={{ pr: 2.5 }}>
                <Button sx={{ color: 'error.dark' }} onClick={handleCancel} color="secondary">
                    Cancel
                </Button>
                <Button variant="contained" size="small" onClick={handleSubmit}>
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
}
