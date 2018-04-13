/*
 * Drag and Drop functionallity
 */

/*
 * Drop handler, process object if dropped to cart
 */
function drop_handler(ev) {
    $(".cart").removeClass("ui-state-hover");
    var data = ev.dataTransfer.getData("text");
    d.add(data);
    ev.preventDefault();
}

/*
 * Drag handler, process object when a drag of the object is started
 */
function drag_handler(ev) {
    ev.dataTransfer.setData("text", ev.srcElement.attributes["data-id"]['value']);
}

/*
 * Enables drag of objects
 */
function allowDrop_handler(ev) {
    ev.preventDefault();
}

/*
 * Enable highlight of cart when an object is hoovering the cart
 */
function dragenter_handler(ev) {
    $(".cart").addClass("ui-state-hover");
}

/*
 * Removes highlight of cart 
 */
function dragleave_handler(ev) {
    $(".cart").removeClass("ui-state-hover");
}
