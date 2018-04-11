import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {DragSource} from 'react-dnd';

/**
 * Component representation of an Item. An item has a name and weight. 
 */
export class Item extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        const { isDragging, connectDragSource } = this.props;
        return (
            // dnd-wrapped component
            connectDragSource(
            <div
                onMouseUp = {() => {this.props.setLocked(this.props.id,false)}}
                className = {`item-container ${this.props.isPacked ? 'item-packed' : null} ${this.props.isLocked ? 'item-locked' : null}`}>
                <div className="item-top">
                    <h3>{this.props.name}</h3>
                    {!this.props.isLocked 
                        ?   <button onClick = {() => {this.props.removeItem(this.props.id)}}>
                                <div><i className="far fa-trash-alt"></i></div>
                            </button> 
                        :   null
                    }
                </div>
                
                <h5>W: {this.props.weight}</h5>
            </div>
            )
        );
    }
}

//---------------------------------------------------------
// The following is adapted from react-dnd documentation
// https://react-dnd.github.io/react-dnd/

const propTypes = {  
    // Injected by React DnD:
    isDragging: PropTypes.bool.isRequired,
    connectDragSource: PropTypes.func.isRequired
};


/**
 * Injected methods that are called on item drag.
 */
const dragItem = {

    /**
     * Method called when Item drag begins. Locks the Item Component on drag start.
     * @param {Object} props - Item Component props
     */
    beginDrag(props){
        props.setLocked(props.id, true);
        return props;
    },

    /**
     * Returns true iff the Item is available to be dragged. The Item can be dragged iff
     * it is neither locked nor being currently dragged.
     * @param {Object} props - Item component props
     * @param {*} monitor - N/a
     * @param {*} component - N/a
     */
    canDrag(props, monitor, component){
        return !props.isLocked && !props.isPacked;
    },

    /**
     * Method called when Item drag ends. Sets the dragged Item to no longer be locked,
     * making it available for dragging again.
     * @param {Object} props - Item component props
     */
    endDrag(props){
        props.setLocked(props.id,false);
    }
}

/**
 * Injects react-dnd event and state handlers
 * @param {DragSourceConnector} connect 
 * @param {DragSourceMonitor} monitor 
 */
function collect(connect, monitor) {
    return {
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging()
    };
}

Item.propTypes = propTypes;
Item = DragSource(props => (props.type),dragItem,collect)(Item);

//---------------------------------------------------------