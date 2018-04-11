import React from 'react';
import ReactDOM from 'react-dom';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

import {BoxList} from './components/box-components/BoxList.js';
import {ItemList} from './components/item-components/ItemList.js';
import {UserList} from './components/user-components/UserList.js';
import {ChatBar} from './components/chat-components/ChatBar.js';
import {UserNameGenerator} from './utils/UserNameGenerator.js';


var config = {
    apiKey: "AIzaSyDmhkVdWHYy6yokJTsa58jC8znypZXWsTQ",
    authDomain: "rose-rocket-challenge.firebaseapp.com",
    databaseURL: "https://rose-rocket-challenge.firebaseio.com",
    projectId: "rose-rocket-challenge",
    storageBucket: "",
    messagingSenderId: "82911178666"
};

firebase.initializeApp(config);

/**
 * Main app component.
 */
class App extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            // users currently using app
            currentUsers : [],
            // client/user info
            user : {
                id : null,
                name : null
            },
            boxes : [],
            items : [],
            // items that are currently being moved 
            lockedItems : [],
            activeConversations : []
        }

        this.userNameGenerator = new UserNameGenerator();

        this.connectUserDB = this.connectUserDB.bind(this);
        this.connectModelDB = this.connectModelDB.bind(this);
        this.handleBoxDrop = this.handleBoxDrop.bind(this);
        this.getBoxedItems = this.getBoxedItems.bind(this);
        this.setItemLocked = this.setItemLocked.bind(this);
        this.unboxItem = this.unboxItem.bind(this);
        this.createBox = this.createBox.bind(this);
        this.removeBox = this.removeBox.bind(this);
        this.createItem = this.createItem.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.closeUserConversation = this.closeUserConversation.bind(this);
        this.openUserConversation = this.openUserConversation.bind(this);
   
    }

    /**
     * Given a FB database reference, connects the user-related data in the database to this app.
     * Assigns client a unique generated name, sets up user conversation listeners.
     * @param {Object} db - Firebase database object.
     */
    connectUserDB(db){
        db.ref('currentUsers')
            .once('value').then((res)=>{
                // get currentUsers
                let currentUsers = (res.val() !== null ? Object.values(res.val()) : []);
                
                // determine names that exist
                let seenNameCombos = currentUsers.map((user)=>{
                    return user.nameCombo
                });

                // tell the name generator what combinations to ignore
                this.userNameGenerator.addSeenNameCombos(seenNameCombos);

                // generate our user name
                let rName = this.userNameGenerator.generateName();
                
                // get user id for new user from FB
                let userRef = firebase.database().ref('currentUsers').push();

                // set user info in FB
                let userObj = {name : rName['name'], nameCombo : rName['combo'], id : userRef.key};
                firebase.database().ref(`currentUsers/${userRef.key}`).set(userObj);
                firebase.database().ref(`users/${userRef.key}`).set(userObj);

                // set up a userConversations listener for this user
                db.ref(`/users/${userRef.key}/conversations`).on('value',(res)=>{
                    let convoIds = res.val() !== null ? Object.values(res.val()) : null;

                    if(convoIds !== null){
                        // for every active conversation for this user
                        convoIds.forEach((cid)=>{
                            // when a user is messaged, app state is updated that convo is active
                            db.ref(`/userConversations/${cid}/messages`).on('value',(res)=>{
                                if(res.val() !== null){
                                    this.setState((prevState)=>{
                                        if(!prevState.activeConversations.includes(cid)){
                                            return {activeConversations : [...prevState.activeConversations, cid]}
                                        }
                                    })
                                }
                            })
                        })
                    }
                })
                
                this.setState({user : userObj});

                // set up disconnect listener for FB
                userRef.onDisconnect().remove();
            });
        
        // update app when a new user is added to FB
        db.ref('currentUsers')
            .on('value',(res)=>{
                this.setState({
                    currentUsers : (res.val() !== null ? Object.values(res.val()) : [])
                })
            })
    }
    /**
     * Given a FB database reference, connects the model in the database to this app.
     * Sets up all the value change listeners for locked items, items and boxes. 
     * @param {Object} db - Firebase database object.
     */
    connectModelDB(db){
        db.ref('lockedItems')
            .on('value',(res)=>{
                this.setState({
                    lockedItems : (res.val() !== null ? res.val() : [])
                })
            })

        db.ref('items').on('value',(res)=>{
            this.setState({
                items : (res.val() !== null ? Object.values(res.val()) : [])
            })
        })

        db.ref('boxes').on('value',(res)=>{
            this.setState({
                boxes : (res.val() !== null ? Object.values(res.val()) : [])
            })
        })
    }

    /**
     * Sets up Firebase callbacks.
     */
    componentDidMount(){
        let db = firebase.database();
        this.connectUserDB(db);
        this.connectModelDB(db);
    }

    /**
     * Called when an item is dropped on a box. Given a item id and box id, assign an 
     * item a 'parent' box.
     * @param {String} itemId - id of item to box
     * @param {String} boxId - id of box to add item to
     */
    handleBoxDrop(itemId,boxId){
        // keep for reference - but riskier in terms of concurrent modification
        // let boxDropUpdate = {};
        // boxDropUpdate[`items/${itemId}/box_id`] = boxId;
        // firebase.database().ref().update(boxDropUpdate);

        firebase.database().ref(`items/${itemId}/box_id`)
        .transaction(()=>{
            return boxId;
        })
    }

    /**
     * Sets the locked state of an item with the given itemId. A locked item cannot be moved 
     * or deleted.
     * @param {String} itemId - id of item to lock.
     * @param {Bool} bool - whether or not the item is locked.
     */
    setItemLocked(itemId,bool){
        let lockedItemsCopy = [...this.state.lockedItems];

        if(bool && (!this.state.lockedItems.includes(itemId))){       
            lockedItemsCopy.push(itemId);
        }

        else if (!bool && this.state.lockedItems.includes(itemId)){
            lockedItemsCopy.splice(lockedItemsCopy.indexOf(itemId));
        }

        this.setState({
            lockedItems : lockedItemsCopy
            },()=>{
            let dbref = firebase.database().ref('lockedItems').set(this.state.lockedItems);
        })
    }

    /**
     * Returns all the items that have been boxed.
     */
    getBoxedItems(){
        return this.state.items.filter((item)=>{
            return item.box_id !== 0;
        })
    }

    /**
     * Removes an item from a specified box id. 
     * @param {String} itemId 
     */
    unboxItem(itemId){
        // keep for reference - but riskier in terms of concurrent modification
        // let unboxUpdate = {};
        // unboxUpdate[`/items/${itemId}/box_id`] = 0; 
        // firebase.database().ref().update(unboxUpdate);

        firebase.database().ref(`/items/${itemId}/box_id`)
            .transaction(()=>{
                return 0;
            })
    }

    /**
     * Creates a box with the specified box name and max weight.
     * @param {String} boxName - the name of the new box.
     * @param {Int} boxMaxWeight - the max weight of the box.
     */
    createBox(boxName,boxMaxWeight){
        let newBox = firebase.database().ref('boxes').push();
        newBox.set({
            id: newBox.key,
            name : boxName,
            total_allowed_weight : boxMaxWeight
        })
    }

    /**
     * Removes a box with the specified box id.
     * @param {String} boxId - the id of the box to remove. 
     */
    removeBox(boxId){
        // TODO : Evaluate concurrency issues.
        let itemUpdates = this.state.items
            // all items with id of box to be removed
            .filter((item)=>{
                return (item.box_id === boxId)
            })
            // create a Firebase update object to remove box id's from items
            .reduce((updateObj,item) =>{
                let new_ = {};
                new_[`/items/${item.id}/box_id`] = 0;
                return Object.assign(updateObj,new_);
            },{})

        // 1) remove box
        let boxToRemove = firebase.database().ref(`boxes/${boxId}`);
        boxToRemove.remove();
        // 2) remove box id from items associated with removed box
        firebase.database().ref().update(itemUpdates);
    }

    /**
     * Creates an item with a given item name and weight.
     * @param {String} itemName - the name of the item to create
     * @param {Int} itemWeight - the weight of the new item
     */
    createItem(itemName, itemWeight){
        let newItem = firebase.database().ref('items').push();
        newItem.set({
            id : newItem.key, 
            name : itemName, 
            weight : itemWeight,
            box_id : 0
        })
    }

    /**
     * Removes an item given a specified item id.
     * @param {String} itemId - the id of the item to remove.
     */
    removeItem(itemId){
        let itemToRemove = firebase.database().ref(`items/${itemId}`);
        itemToRemove.remove();
    }

    /**
     * Opens a conversation with a user, given a specified user id.
     * @param {String} userId - Id of user with which to open a conversation.
     */
    openUserConversation(userId){
        let db = firebase.database();

        // if you aren't trying to open a conversation with yourself (silly)
        if(this.state.user.id !== userId){
            db.ref(`users/${this.state.user.id}/conversations/${userId}`)
                .once('value')
                .then((res)=>{
                    // get id of convo with specified user
                    let convoId = res.val();

                    // if it doesn't exist yet...
                    if(convoId === null){
                        // create a new convo with a FB-generated id
                        let newConvo = db.ref(`/userConversations/`).push();

                        // set the members of the conversation 
                        db.ref(`/userConversations/${newConvo.key}`).set({
                            members : [this.state.user.id, userId],
                        })
                        
                        // write a new conversation to client and other user's conversation 'folder'
                        db.ref(`users/${this.state.user.id}/conversations/${userId}`).set(newConvo.key);
                        db.ref(`users/${userId}/conversations/${this.state.user.id}`).set(newConvo.key);

                        convoId = newConvo.key;
                    }
                    
                    // add convo to active conversations
                    if(!this.state.activeConversations.includes(convoId)){
                        this.setState(
                            (prevState) => {return {activeConversations : [...prevState.activeConversations, convoId]}} 
                        );
                    }
                })
        }
    }

    /**
     * Closes a currently open coversation, given a conversation id.
     * @param {String} convoId - Id of conversation to close.
     */
    closeUserConversation(convoId){
        this.setState((prevState)=> {
            return {activeConversations : 
                prevState.activeConversations.filter((c)=>{
                    return c !== convoId
                })
            }
        })
    }

    /**
     * Renders this component to the page.
     */
    render() {
      return (
            <div className = 'wrapper'>
                <header className = "page-header" >
                    <h2>Rose Rocket Tech Test</h2>
                    <h5>Jonathan Fejtek</h5>
                </header>
                <div className = 'app-container'>
                    <div className="collab-space">
                        <ItemList 
                            lockedItems = {this.state.lockedItems} 
                            setItemLocked = {this.setItemLocked} 
                            items = {this.state.items} 
                            createItem = {this.createItem}
                            removeItem = {this.removeItem}
                        />
                        <BoxList 
                            boxedItems = {this.getBoxedItems()} 
                            onBoxDrop = {this.handleBoxDrop} 
                            boxes = {this.state.boxes} 
                            unboxItem = {this.unboxItem}
                            createBox = {this.createBox}
                            removeBox = {this.removeBox}
                        />
                        <ChatBar 
                            closeUserConversation = {this.closeUserConversation} 
                            activeConversations = {this.state.activeConversations}
                            clientId = {this.state.user.id}
                        />
                    </div>

                    <UserList 
                        user = {this.state.user} 
                        users = {this.state.currentUsers} 
                        openUserConversation = {this.openUserConversation}
                    />
                </div>
            </div>

      )
    }
}

App = DragDropContext(HTML5Backend)(App);

ReactDOM.render(<App />, document.getElementById('app'));
