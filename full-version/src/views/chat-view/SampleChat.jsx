import React, { useState, useEffect, useRef } from 'react';
import { useTheme, styled } from '@mui/material/styles';
import { Box, Grid, IconButton, InputAdornment, OutlinedInput, Divider, Typography, Stack, Button } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { useSelector, useDispatch } from 'store';
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone';
import ReactMarkdown from 'react-markdown';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ContentCopyIcon from '@mui/icons-material/ContentCopy'; // Renamed for clarity
import { useParams } from 'react-router-dom';  // Add this line

import { drawerWidth } from 'store/constant';
import { gridSpacing } from 'store/constant';

import {getChatbotAnswer} from 'hooks/useApi';  // Import the getChatbotAnswer function

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
        marginLeft: 0,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const MessageBubble = styled(Typography)(({ theme, sender }) => ({
    maxWidth: '80%',
    padding: theme.spacing(1),
    borderRadius: '20px',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    marginLeft: sender === 'user' ? 'auto' : theme.spacing(2),
    marginRight: sender === 'user' ? theme.spacing(2) : 'auto',
    backgroundColor: sender === 'user' ? theme.palette.primary.main : theme.palette.grey[300],
    color: sender === 'user' ? theme.palette.common.white : theme.palette.text.primary,
    wordBreak: 'break-word',
}));

const ChatContainer = styled(Box)(({ theme }) => ({
    height: '50vh',
    overflowY: 'auto'
}));

const ChatDisplay = () => {
    const { convID } = useParams(); // Get convID from the URL parameter

    const theme = useTheme();
    const dispatch = useDispatch();
    const [message, setMessage] = useState('');
    const chatState = useSelector(state => state.chat);
    const [data, setData] = useState([]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        setData(chatState.chats);
        scrollToBottom();
    }, [chatState.chats]);

    useEffect(() => {
        scrollToBottom();
    }, [data]);


    const loadSummary = async () => {
        try {
            const convID1 = convID;
            const url = `http://localhost:5555/summary?convID=${convID1}`;
            const response = await fetch(url);
            const summaryText = await response.text();  // Retrieve Markdown text from the .txt file
            setData(prevData => [...prevData, { text: summaryText, sender: 'server', markdown: true }]);
        } catch (error) {
            console.error('Failed to fetch summary:', error);
        }
    };
    
    const loadTranscript = async () => {
        try {
            const convID1 = convID;
            const url = `http://localhost:5555/transcript?convID=${convID1}`;
            const response = await fetch(url);
            const transcriptText = await response.text();  // Retrieve Markdown text from the .txt file
            setData(prevData => [...prevData, { text: transcriptText, sender: 'server', markdown: true }]);
        } catch (error) {
            console.error('Failed to fetch transcript:', error);
        }
    };

    const sendMessage = async () => {
        console.log('Sending message:', message);
        if (!message.trim()) return;
    
        // Assuming the convID is stored in state or comes from a prop, we'll use a dummy ID for now.
        // Replace 'dummy-conv-id' with the actual convID from your state or props.
        const convID1 = convID;
    
        setData(prevData => [...prevData, { text: message, sender: 'user'}]);
        setMessage('');
    
        try {
            const response = await getChatbotAnswer(convID1, message);
            // Assuming the API response has the chatbot's message under the key 'answer'
            console.log('Received response:', response);
            setData(prevData => [...prevData, { text: response, sender: 'server' }]);
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };
    const handleDownload = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch file.');
            }
            const data = await response.text();
            const blob = new Blob([data], { type: 'text/plain' });
    
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = 'conversation-summary.txt'; // You can customize the download file name
            document.body.appendChild(link);
            link.click();
    
            // Clean up by revoking the Blob URL and removing the link
            window.URL.revokeObjectURL(downloadUrl);
            document.body.removeChild(link);
        } catch (error) {
            console.error('Failed to download file:', error);
        }
    };

    const handleCopy = async (url) => {
        if (navigator.clipboard) {
            try {
                await navigator.clipboard.writeText(url);
                console.log('URL copied to clipboard');
            } catch (error) {
                console.error('Failed to copy:', error);
            }
        } else {
            console.error('Clipboard API not supported');
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Main theme={theme} open={true}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <MainCard>
                            <Stack spacing={2}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Button variant="outlined" onClick={loadSummary}>Summarize</Button>
                                    <IconButton color="inherit" onClick={() => handleDownload(`http://localhost:5555/summary?convID=${convID}`)}>
                                        <FileDownloadIcon />
                                    </IconButton>
                                    <IconButton color="inherit" onClick={() => handleCopy(`http://localhost:5555/summary?convID=${convID}`)}>
                                        <ContentCopyIcon />
                                    </IconButton>
                                    
                                    <Button variant="outlined" onClick={loadTranscript}>Transcript</Button>
                                    <IconButton color="inherit" onClick={() => handleDownload(`http://localhost:5555/transcript?convID=${convID}`)}>
                                        <FileDownloadIcon />
                                    </IconButton>
                                    <IconButton color="inherit" onClick={() => handleCopy(`http://localhost:5555/transcript?convID=${convID}`)}>
                                        <ContentCopyIcon />
                                    </IconButton>
                                    <Box flexGrow={1} /> {/* This will push all items after it to the right */}

                                    <Button variant="outlined" onClick={loadSummary}>Share Chat</Button>
                                </Stack>
                                <Divider />
                                <ChatContainer>
                                    {data.map((chat, index) => (
                                        <MessageBubble key={index} sender={chat.sender}>
                                            <ReactMarkdown>{chat.text}</ReactMarkdown>
                                            {index === data.length - 1 ? <div ref={messagesEndRef} /> : null}
                                        </MessageBubble>
                                    ))}
                                </ChatContainer>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <OutlinedInput
                                        fullWidth
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton onClick={sendMessage} edge="end">
                                                    <SendTwoToneIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                </Stack>
                            </Stack>
                        </MainCard>
                    </Grid>
                </Grid>
            </Main>
        </Box>
    );
};

export default ChatDisplay;