import React from 'react';
import {ChatConversation} from './ChatConversation.js';

/**
 * 
 */
export class ChatBar extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return ( 
            <div className = "chatbar-wrapper">
                <div className="conversation-container">
                    {this.props.activeConversations.map((convId)=>{
                        return (
                            <ChatConversation 
                                closeUserConversation = {this.props.closeUserConversation} 
                                cid = {convId}
                                key = {convId}
                                clientId = {this.props.clientId}
                            />)
                    })}
                </div>
            </div>
        )
    }
}