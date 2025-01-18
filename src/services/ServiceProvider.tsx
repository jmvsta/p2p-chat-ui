import React, { createContext, useContext } from 'react';
import UserService from './UserService';
import ChatService from './ChatService';
import FileService from './FileService';
import MessageService from './MessageService';
import SettingsService from './SettingsService';
import ServerService from './ServerService';

const ServiceContext = createContext({
    chatService: new ChatService(),
    fileService: new FileService(),
    messageService: new MessageService(),
    serverService: new ServerService(),
    settingsService: new SettingsService(),
    userService: new UserService()
});

export const useServices = () => useContext(ServiceContext);

export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <ServiceContext.Provider
            value={{
                chatService: new ChatService(),
                fileService: new FileService(),
                messageService: new MessageService(),
                serverService: new ServerService(),
                settingsService: new SettingsService(),
                userService: new UserService()
            }}
        >
            {children}
        </ServiceContext.Provider>
    );
};
