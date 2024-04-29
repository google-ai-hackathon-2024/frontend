import React, { createContext } from 'react';

const initialState = {
    isLoggedIn: false,
    user: null
};

const JWTContext = createContext({
    ...initialState,
    login: () => undefined,
    logout: () => undefined,
    register: () => undefined,
    resetPassword: () => undefined,
    updateProfile: () => undefined
});

export const JWTProvider = ({ children }) => {
    return <JWTContext.Provider value={{ ...initialState }}>{children}</JWTContext.Provider>;
};

export default JWTContext;
