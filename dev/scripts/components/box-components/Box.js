import React from 'react';
import ReactDOM from 'react-dom';
import { DropTarget } from 'react-dnd';
import PropTypes from 'prop-types';
import {BoxedItem} from './BoxedItem.js';

/**
 * Renders a Box. A Box has a name, max weight, and a list of Items. 
 */
export class Box extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        const {
			isOver,
			canDrop,
			connectDropTarget,
			lastDroppedItem,
        } = this.props;

        const valid = isOver && canDrop;

        const dragHoverStyle = isOver ? canDrop ? 'box-valid-over' : 'box-invalid-over ' : null;

        return connectDropTarget(
            <div className = {`box ${dragHoverStyle}`}>
                <header className="box-top">
                    <h3>{this.props.boxName} </h3>   
                    <button onClick = {()=>{this.props.removeBox(this.props.id)}}>
                        <div><i className="far fa-trash-alt"></i></div>
                    </button>             
                </header>

                <div className="boxed-items">
                    {this.props.items.map((item)=>{
                        return (
                            <BoxedItem 
                                onClick = {this.props.unboxItem} 
                                item = {item}
                                key = {item.id}
                            />
                        )
                    })}               
                </div>


                <h5 className = "weight-display">{`T.W: ${this.props.currentWeight}/${this.props.maxWeight}`}</h5>
            </div>
        )
    }

}

//---------------------------------------------------------
// The following is adapted from react-dnd documentation
// https://react-dnd.github.io/react-dnd/

/**
 * Contains methods that describe how a Box will respond to drag and drop events.
 */
const spec = {

    /**
     * Method called when an Item component is dropped on a Box.
     * @param {Object} props - Component props of Box 
     * @param {DropTargetMonitor} monitor - dnd object used to query information about drag state
     * @param {*} component - N/a
     */
    drop(props,monitor,component){
        props.onDrop(monitor.getItem().id,props.id);
    },

    /**
     * Returns true iff an Item Component can drop on Box - if weight constraint is met.
     * @param {Object} props - Component props of Box 
     * @param {DropTargetMonitor} monitor - dnd object used to query information about drag state 
     * @param {*} component 
     */
    canDrop(props,monitor,component){
        return monitor.getItem().weight+props.currentWeight <= (props.maxWeight);
    },

    hover(props, monitor,component){}
}

const propTypes = {  
    // Injected by React DnD:
    isOver: PropTypes.bool.isRequired,
    canDrop : PropTypes.bool.isRequired,
    connectDropTarget: PropTypes.func.isRequired
};

/**
 * Injects react-dnd event and state handlers
 * @param {DragSourceConnector} connect 
 * @param {DragSourceMonitor} monitor 
 */
function collect(connect, monitor){
    return{
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
    }
}

Box.propTypes = propTypes;
Box = DropTarget('item',spec,collect)(Box);

//--------------------------------------------------------------