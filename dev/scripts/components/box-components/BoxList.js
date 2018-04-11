import React from 'react';
import {Box} from './Box.js';
import {BoxCreator} from './BoxCreator.js';

/**
 * Renders a list of Boxes.
 */
export class BoxList extends React.Component{
    constructor(props){
        super(props);

        this.getBoxedItemsForBox = this.getBoxedItemsForBox.bind(this);
    }

    /**
     * Returns all the items that have been boxed in specified box.
     * @param {String} box - id of box for which to get items
     */
    getBoxedItemsForBox(box){
        const boxedItems = this.props.boxedItems.filter((item) => {
            return item.box_id === box.id;
        });

        return (boxedItems.length > 0 ? boxedItems : []);
    }

    render(){
        return (
            <div className = "box-list">
                <h3 className = 'list-label'>Boxes</h3>
                <BoxCreator createBox = {this.props.createBox}/>
                <div className="box-list-items">
                    {this.props.boxes.map((box)=>{
                        return (
                        <Box
                            id = {box.id}
                            key = {box.id}
                            boxName = {box.name} 
                            maxWeight = {box.total_allowed_weight}
                            currentWeight = {this.getBoxedItemsForBox(box).reduce((acc,item)=>{return acc + item.weight},0)}
                            onDrop = {this.props.onBoxDrop}
                            items = {this.getBoxedItemsForBox(box)}
                            unboxItem = {this.props.unboxItem}
                            removeBox = {this.props.removeBox}
                        />);
                    })}
                </div>
            </div>
        );
    }


}