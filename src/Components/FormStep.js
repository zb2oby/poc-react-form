import React from 'react';
import {rules} from "../Services/ValidationRules";
import Dispatcher from "../Services/Dispatcher";
import dataStore from "../Services/dataStore";


export default class FormStep extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            items : [],
            values:{},
        }
    }


    onChange = (name, val) => {
        let values = dataStore.data;
        //on itere sur les items
        let items = this.state.items.map((item)=> {
            if (item.name) {
                //pour l'item qu'on modifie
                if (item.name === name) {
                    //on vide les erreurs s'il en contiens
                    if (item.errors.length > 0) {
                        item.errors = []
                    }
                    //on enregistre sa valeur
                    values[item.name] = val.target.value;

                    //execution de la fonction eventuellement définie en callback du changement de valeur
                    if (item.hasOwnProperty("actionAfterChange")) {
                        item.actionAfterChange(this.state.values);
                    }
                }
                //pour les autres item si ils sont désormais cachés on vide les erreurs egalement et on réinitialise la valeur
                else if (!item.show(values)) {
                    if (item.errors.length > 0) {
                        item.errors = [];
                    }
                    if (item.initialValue) {
                        values[item.name] = item.initialValue
                    } else {
                        values[item.name] = ""
                    }
                }
            }

            return item;
        });

        this.setState({items: items, values: values});



    };


    validateStep = () => {
        let isValid = true;
        let data = dataStore.data;
        let items = this.state.items.map((item)=> {
            if (item.name) {
                //console.log(item)
                //on vide les précédentes erreurs
                item.errors = [];
                //on charge la liste des regles du champ à valider
                let itemRules = rules[item.name];
                //on itere sur les regle pour les champ actuellement visibles
                if (itemRules) {
                    itemRules.map((rule) => {
                        //si une règle n'est pas respectée on set isValid à false pour modifier le state et on charge les messages d'erreur dans l'item
                        if (!rule.isValid(item.value) && item.show(this.state.values) === true) {
                            isValid = false;
                            item.errors.push(rule.message);
                        }
                    });
                }


                if (isValid) {
                    data[item.name] = item.value;
                }
            }
            return item;
        });

        //si au moins une erreur a été rencontrée on recharge les items
        if (!isValid) {
            this.setState({
                items: items
            })
        } else {
            Dispatcher.dispatch({
                type : "UPDATE_DATA",
                data : data
            })
        }

        //on retourne la valeur de isValid pour l'etape suivante
        return isValid
    };

    render() {
        const items = this.state.items.map((item)=> {
            if (item.name) {
                let props = {...item};
                props.show = item.show(this.state.values);
                props.key = item.name;
                delete props.render;
                return (
                    item.render({...props})
                )
            } else {
                let props = {...item};
                props.show = item.show(this.state.values);
                return item.render({...props});
            }

        });

        const verbatim = this.state.values && this.state.verbatim(this.state.values);
        console.log(items);
        return (
            <div>
                {items}
                {verbatim}
                <button type={"button"} onClick={()=>this.validateStep(this.state.items)}>valider</button>
            </div>

        )
    }

}