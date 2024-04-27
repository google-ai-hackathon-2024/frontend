import React, { useState, useEffect, useRef } from 'react';
import { useTheme, styled } from '@mui/material/styles';
import { Box, Grid, IconButton, InputAdornment, OutlinedInput, Divider, Typography, Stack, Button } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { useSelector, useDispatch } from 'store';
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone';
import ReactMarkdown from 'react-markdown';

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

const ChatDisplay = ({ user, messages, convID, trascriptURL, summaryURL }) => {
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


    const handleDownload = (url) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = url.split('/').pop(); // This assumes the filename comes from the URL segment after the last '/'
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleShare = async (url) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Check this out',
                    url: url
                });
                console.log('Content shared successfully');
            } catch (error) {
                console.error('Error sharing the content', error);
            }
        } else {
            console.error('Web Share API is not supported in this browser.');
        }
    };

    const loadSummary = async () => {
        try {
            const convID = "AOPPY4";
            const url = `http://localhost:5555/summary?convID=${convID}`;
            const response = await fetch(url);
            const summaryText = await response.text();  // Retrieve Markdown text from the .txt file
            setData(prevData => [...prevData, { text: summaryText, sender: 'server', markdown: true }]);
        } catch (error) {
            console.error('Failed to fetch summary:', error);
        }
    };
    
    const loadTranscript = async () => {
        try {
            const convID = "AOPPY4";
            const url = `http://localhost:5555/transcript?convID=${convID}`;
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
        const convID = "AOPPY4";
    
        setData(prevData => [...prevData, { text: message, sender: 'user'}]);
        setMessage('');
    
        try {
            const response = await getChatbotAnswer(convID, message);
            // Assuming the API response has the chatbot's message under the key 'answer'
            console.log('Received response:', response);
            setData(prevData => [...prevData, { text: response, sender: 'server' }]);
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Main theme={theme} open={true}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <MainCard>
                            <Stack spacing={2}>
                                <Stack direction="row" spacing={1}>
                                    <Button variant="outlined" onClick={loadSummary}>Summarize</Button>
                                    <Button variant="outlined" onClick={loadTranscript}>Transcript</Button>
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
