import React, {createContext, useContext} from 'react';
import UserService from './services/UserService';
import ChatService from './services/ChatService';
import FileService from './services/FileService';
import MessageService from './services/MessageService';
import SettingsService from './services/SettingsService';
import ServerService from './services/ServerService';
import InfoPopup from './components/popup/InfoPopup';
import ContactPopup from './components/popup/ContactPopup';
import ChatEditPopup from './components/popup/ChatEditPopup';
import ContactsPopup from './components/popup/ContactsPopup';

const Context = createContext({
    chatService: new ChatService(),
    fileService: new FileService(),
    messageService: new MessageService(),
    serverService: new ServerService(),
    settingsService: new SettingsService(),
    userService: new UserService()
});

export const useServices = () => useContext(Context);

export const Providers: React.FC<{ children: React.ReactNode }> = ({children}) => {
    return (
        <Context.Provider
            value={{
                chatService: new ChatService(),
                fileService: new FileService(),
                messageService: new MessageService(),
                serverService: new ServerService(),
                settingsService: new SettingsService(),
                userService: new UserService()
            }}
        >
            <InfoPopup/>
            <ContactPopup/>
            <ChatEditPopup/>
            <ContactsPopup/>
            {children}
        </Context.Provider>
    );
};
