import React from 'react';

/**
 * Component that exposes Item creation functionality.
 */
export class ItemCreator extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            itemName : '',
            itemWeight : ''
        }
        this.createItem = this.createItem.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }

    render(){
        return (
            <div className = "item-creator">
                <input 
                    value = {this.state.itemName} 
                    id = 'itemName' 
                    onInput = {this.handleInput} 
                    placeholder = 'Name' 
                    type="text"
                />
                <input 
                    value = {this.state.itemWeight} 
                    id = 'itemWeight' 
                    onInput = {this.handleInput} 
                    placeholder = 'Item Weight' 
                    type="text"
                />
                <button onClick = {this.createItem} >Create Item</button>
            </div>
        )
    }

    /**
     * Sets the input state for this component
     * @param {Event} e 
     */
    handleInput(e){
        this.setState({[e.target.id] : e.target.value});
    }

    /**
     * Creates a new item. 
     */
    createItem(){
        if(this.state.name !== '' && !isNaN(this.state.itemWeight)){
            this.props.createItem(this.state.itemName,parseInt(this.state.itemWeight));
        }
        this.setState({itemName : '', itemWeight : ''});
    }
}