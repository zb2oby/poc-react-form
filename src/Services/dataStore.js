import {EventEmitter} from "events";
import Dispatcher from "./Dispatcher";


class DataStore extends EventEmitter{
    constructor(){
        super();
        this.data = {}
    }

    handleActions(action){
        switch(action.type){
            // Initialisation/Réinitialisation du store à la sélection du domaine de sinistre (habitation, auto...)
            case "UPDATE_DATA":
                this.data = action.data;
                break;

            default:
                break;
        }
    }
}

const dataStore = new DataStore();
dataStore.setMaxListeners(500);
Dispatcher.register(action => dataStore.handleActions(action));

export default dataStore;