import React from 'react';
import {Item} from './Item.js';
import {ItemCreator} from './ItemCreator.js';

/**
 * Renders a list of Items. 
 */
export class ItemList extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className = 'item-list'>
                <h3 className = 'list-label'>Items</h3>
                <ItemCreator createItem = {this.props.createItem}/>
                <div className="item-list-items">
                    {this.props.items.map((item)=>{
                        return (
                            <Item 
                                id = {item.id} 
                                key = {item.id} 
                                type = "item" 
                                weight = {item.weight} 
                                name = {item.name}
                                isPacked = {item.box_id !== 0}
                                isLocked = {this.props.lockedItems.includes(item.id)}
                                setLocked = {this.props.setItemLocked}
                                removeItem = {this.props.removeItem}
                            />
                        )
                    })}                
                </div>

            </div>
        )
    }
}