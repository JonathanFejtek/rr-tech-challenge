import React from 'react';

/**
 * Component that exposes Box creation functionality. 
 */
export class BoxCreator extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            name : '',
            maxWeight : ''
        }

        this.handleInput = this.handleInput.bind(this);
        this.createBox = this.createBox.bind(this);
    }

    /**
     * Handles input from input fields in this component
     * @param {Event} e - event from input fields in this component
     */
    handleInput(e){
        this.setState({[e.target.id] : e.target.value});
    }

    /**
     * Creates a box. 
     */
    createBox(){
        if(this.state.name !== '' && !isNaN(this.state.maxWeight)){
            this.props.createBox(this.state.name,parseInt(this.state.maxWeight));
        }
        this.setState({name : '', maxWeight : ''});
    }

    render(){
        return (
            <div className = "box-creator">
                <input 
                    value = {this.state.name} 
                    id = 'name' 
                    onInput = {this.handleInput} 
                    placeholder = 'Name' 
                    type="text"
                />
                <input 
                    value = {this.state.maxWeight} 
                    id = 'maxWeight' 
                    onInput = {this.handleInput} 
                    placeholder = 'Max Weight' 
                    type="text"
                />
                <button onClick = {this.createBox} >Create Box</button>
            </div>
        )
    }
}