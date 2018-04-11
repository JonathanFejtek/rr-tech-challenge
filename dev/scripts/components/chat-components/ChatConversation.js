import React from 'react';

/**
 * A Component that renders a chat conversation.
 */
export class ChatConversation extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            messages : [],
            members : [],
            memberNames : [],
            currentMessage : ''
        }

        this.handleInput = this.handleInput.bind(this);
    }

    /**
     * Sets up value change listeners for component.
     */
    componentDidMount(){
        let db = firebase.database();
        // set up listener for conversation changes
        db.ref(`userConversations/${this.props.cid}`)
            .on('value',(res)=>{
                let convo = res.val();
                let messages = convo.messages; 

                this.setState({
                    messages : (messages ? Object.values(convo.messages) : []),
                    members : (convo !== null ? convo.members : [])
                })
            })
        
        // populate conversation with members 
        db.ref(`userConversations/${this.props.cid}`).once('value').then((res)=>{
            let convo = res.val();
            convo.members.forEach((mem)=>{
                db.ref(`users/${mem}`)
                .once('value')
                .then((res)=>{
                    this.setState((prevState)=>{
                        return {memberNames : [...prevState.memberNames,res.val()]}
                    })
                })
            })
        })
    }

    /**
     * Sends a message to database.
     */
    sendMessage(){
        let cdb = firebase.database().ref(`userConversations/${this.props.cid}/messages`);
        cdb.push(
            {from : this.props.clientId, content : this.state.currentMessage}
        )
        this.setState({currentMessage : ''});
    }

    /**
     * Handles input from chat text input.
     * @param {Event} e - event from Component text-input.
     */
    handleInput(e){
        this.setState({currentMessage : e.target.value});
    }


    render(){
        return (
            <div className="chat-conversation">
                <header className="conversation-header">
                    <h3>
                        {this.state.memberNames.map((mem,i)=>{
                            return <div>{(mem.id !== this.props.clientId ? `${mem.name}` : null)}</div>;
                        })}
                    </h3>
                    <button onClick = {() => {this.props.closeUserConversation(this.props.cid)}}>X</button>
                </header>
                <div className="conversation-text">
                    {this.state.messages.map((msg)=>{
                        return (
                        <div className = {msg.from === this.props.clientId ? 'from-message' : 'to-message'}>
                            <p className="message-content">{msg.content}</p> 
                        </div>
                        )
                    })}
                </div>
                <textarea 
                    value = {this.state.currentMessage}
                    onInput = {this.handleInput}
                    onKeyDown = {(e)=>{if(e.keyCode === 13) this.sendMessage()}}
                    id= {`${this.props.cid}-chat`} 
                    cols="30" 
                    rows="3"
                >
                </textarea>
            </div>
        )
    }

}