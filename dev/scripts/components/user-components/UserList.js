import React from 'react';
import {User} from './User.js';

/**
 * A Component that renders a list of Users. 
 */
export class UserList extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div>
                <h3 className = 'user-header'>Users Online:</h3>
                <div className = 'current-users'>
                    {this.props.users.map((user)=>{
                        return <User 
                            key = {user.id}
                            isClient = {this.props.user.id === user.id} 
                            data = {user}
                            openUserConversation = {this.props.openUserConversation}
                        />
                    })}
                </div>
            </div>

        )
    }
}