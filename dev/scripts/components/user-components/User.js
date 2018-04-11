import React from 'react';

/**
 * Renders a user's name to the screen. Renders whether or not the user is the client. 
 */
export class User extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div onClick = {() => {this.props.openUserConversation(this.props.data.id)}} className = 'user'>
                <div><i className ="fas fa-user"></i></div>
                <h4>{`${this.props.data.name}${this.props.isClient ? ' (You)' : ''}`}</h4>
            </div>
        )
    }
}