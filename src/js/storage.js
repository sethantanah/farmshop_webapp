


function saveItem(id, item){
    const object = JSON.stringify(item);
    localStorage.setItem(id, object);
}


function getItem(id){
    const item = localStorage.getItem(id);
    return JSON.parse(item);
}

function removeItem(id){
    localStorage.removeItem(id);
}

function clearStorage(){
    localStorage.clear();
}

module.exports = {saveItem, getItem, removeItem, clearStorage};