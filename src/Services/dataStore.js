import {EventEmitter} from "events";
import Dispatcher from "./Dispatcher";

class DataStore extends EventEmitter{
    constructor(){
        super();
        this.data = {civilite: "Mr", nomJeuneFille: "Aucun", nom: "", prenom: ""}
    }

    handleActions(action){
        switch(action.type){
            // Initialisation/Réinitialisation du store à la sélection du domaine de sinistre (habitation, auto...)
            case "UPDATE_DATA":
                this.data = action.data;
                console.log("UPDATE_DATA", this.data);
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