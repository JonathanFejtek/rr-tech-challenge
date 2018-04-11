import React from 'react';

/**
 * Renders an item that has been boxed.
 * @param {Object} props 
 */
export const BoxedItem = (props) => {
    return (
        <div className = 'boxed-item'>
            <div className = 'boxed-item-name'>
                <button onClick = {() => {props.onClick(props.item.id)}}>
                    <div><i className ="far fa-minus-square"></i></div>
                </button>
                <h4>{props.item.name}</h4>                
            </div>

            <h5>{props.item.weight}</h5>
        </div>
    )
}