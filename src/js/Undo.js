/**
 * Created by Tom on 2017-02-16.
 * 
 * 
 * This function stores actions in a list and has a pointer indicating the last action.
 * Can also check if there is something to undo or redo.
 */

function Undo() {
    this.actionsList = [];
    this.currentPosition = 0;
}

/** 
 * Adds action and the opposite action to list of actions and puts the pointer to the latest action *
 */
Undo.prototype.add = function (action, opposite, beer_id){
    var obj = {"action":action, "opposite":opposite, "id": beer_id};
    this.actionsList[this.currentPosition] = obj;
    this.currentPosition++;
}

/** 
 * Uses the pointer to get the opposite action from the list of action and returns the object then moves the pointer down the list.
 */

Undo.prototype.undo = function () {
    this.currentPosition--;
    var pos = this.currentPosition;
    var ret = this.actionsList[pos]["opposite"];
    window.d[ret](this.actionsList[pos]['id'], false);
}

/** 
 * Uses the pointer to get the action from the list of action and returns the object then moves the pointer up in the list. 
 */
Undo.prototype.redo = function () {
    
    var pos = this.currentPosition;
    var ret = this.actionsList[pos]["action"];
    window.d[ret](this.actionsList[pos]['id'], false);
    this.currentPosition++;
}
/** 
 * Clears the list of actions and resets the pointer
 */
Undo.prototype.clear = function () {
    this.actionsList = [];
    this.currentPosition = 0;
}

/** 
 * Checks if the list of actions is 0 and returns false if it is and true if it's not 
 */
Undo.prototype.undoCheck = function () {
    return (this.currentPosition != 0);
}

/** 
 * Checks if there are any actions that can be redone
 */
Undo.prototype.redoCheck = function () {
    return (this.actionsList.length - 1 >= this.currentPosition)
}