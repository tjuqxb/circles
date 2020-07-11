import {combineReducers} from "redux";
import {login} from "./login.reducer";
import {register} from "./register.reducer";
import {message} from "./message.reducer";
import {posts} from "./posts.reducer"
import {userinfo} from "./userinfo.reducer";
import {chatsReducer} from "./chat.reducer";
import {chatSocketReducer} from "./chat.socket.reducer";
import {chatMessage} from "./chatMessage.reducer";
import {chatInputChatReducer} from "./chat.inputChatReducer";
import {currentChatPerson} from "./chat.currentChatPerson1";
import {chatsListReducer} from "./chat.chatList1";
import {chatsReducer1} from "./chat.reducer1";

export const rootReducer = combineReducers({
    inputChatReducer: chatInputChatReducer,
    currentChatPerson,
    message,
    login,
    register,
    posts,
    userinfo,
    chatsReducer,
    socketReducer: chatSocketReducer,
    chatMessage,
    chatsListReducer,
    chatsReducer1,
});
