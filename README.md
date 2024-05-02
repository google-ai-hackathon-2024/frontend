# 🎙️MinuteTaker AI🚀

## Prerequisites

Before you begin, ensure you have the following installed on your system:
- Node.js (preferably version 14.x or higher)
- Yarn

## How to run Frontend?

1. Clone the repository

   ```
    git clone <repo-url>
    cd path-to-your-project
   ```

2. Navigate to the project directory and install the dependencies.
    ```
    yarn install
    ```

3. Running the Application

    To run the application in development mode with hot reloading, execute:
    ```
    yarn start
    ```

    This will start the development server, usually accessible via `http://localhost:3000` in your web browser.

## Developing environment

### Components

1. **React** - A JavaScript library for building user interfaces.

2. **@mui/material** - Provides Material-UI components for React.
3. **react-voice-recorder** - A React component for recording audio.
4. **React Router** (`react-router-dom`) - Enables routing functionalities within React applications.
5. **React Markdown** - A markdown component to parse and display markdown text in React.
6. **ui-component/cards/MainCard** - A custom card component part of a UI component library specific to this project.
7. **ui-component/extended/AnimateButton** - A custom button with animation effects, part of the same UI component library.
8. **store** - A Redux store setup (`useSelector`, `useDispatch`) and state management via Redux.

#### Main Components
##### `SamplePage`
- **Purpose**: Serves as the main container for the application interface, managing various states and interactions related to audio recording, file uploading, and form handling.
- **Key Functions**:
  - **Audio Recording**: Using the `Recorder` component from `react-voice-recorder`.
  - **File Uploading**: Handles file uploads through form data submission to an API.
  - **Form Handling**: Manages form state and submits data through custom hooks to an API.
  - **State Management**: Uses local state to manage audio details, loading status, UI visibility, and form inputs.
  - **Dialog Handling**: Toggles visibility of a dialog component for entering participant info.

##### `SampleChat`
- **Purpose**: Manages the chat interface, including message sending and display, and functionality to load transcripts and summaries.
- **Key Functions**:
  - **Message Display**: Renders chat messages dynamically using custom-styled components.
  - **Fetch Operations**: Loads chat transcripts and summaries via API calls.
  - **Interactive Features**: Allows users to download transcripts, share chat links, and send messages.

##### `SampleForm`
- **Purpose**: Provides a form interface for user input, specifically to categorize and detail the conversation.
- **Key Functions**:
  - **Form Submission**: Handles submission of conversation details (type, title, speaker names).
  - **Dynamic Audio Sample Display**: Displays audio samples and associated speaker labels.

##### `FormDialog`
- **Purpose**: A dialog box for entering the number of participants in a conversation.
- **Key Functions**:
  - **Participant Submission**: Collects and submits participant count.

##### API Integration
- **Custom Hooks (`useApi`)**: Implements functions like `uploadAudio`, `setConfig`, `generateResult`, `initChatbot`, and `getChatbotAnswer` to interact with backend services.

##### Styling and Layout
- Utilizes Material-UI components extensively for layout and UI elements, styled components for custom styles, and conditional rendering for interactive and responsive UIs.



## Contact Details
Hyeongkyun Kim (hyeongkyun.kim@uzh.ch or kreative24hk@gmail.com)
