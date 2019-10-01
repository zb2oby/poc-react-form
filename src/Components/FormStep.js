import React from 'react';
import {rules} from "../Services/ValidationRules";
import Dispatcher from "../Services/Dispatcher";
import dataStore from "../Services/dataStore";


export default class FormStep extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            items : [],
        }
    }


    onChange = (name, val) => {
        let data = dataStore.data;
        data[name] = val.target.value;
        Dispatcher.dispatch({
            type : "UPDATE_DATA",
            data : data
        })
        //on itere sur les items
        let items = this.state.items.map((item)=> {
            //pour l'item qu'on modifie
            if (item.name === name) {
                if (item.errors.length > 0) {
                    item.errors = []
                }
                item.value = val.target.value;
            }

            return item;
        });

        this.setState({items: items});



    };


    validateStep = () => {
        let isValid = true;
        let data = dataStore.data;
        let items = this.state.items.map((item)=> {
            //console.log(item)
            //on vide les précédentes erreurs
            item.errors = [];
            //on charge la liste des regles du champ à valider
            let itemRules = rules[item.name];
            //on itere sur les regle pour les champ actuellement visibles

            itemRules.map((rule)=> {
                //si une règle n'est pas respectée on set isValid à false pour modifier le state et on charge les messages d'erreur dans l'item
                if (!rule.isValid(item.value) && item.show() === true) {
                    isValid = false;
                    item.errors.push(rule.message);
                }
            });


            if (isValid) {
                data[item.name] = item.value;
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
            return (
                item.render({show: item.show(), errors: item.errors, key:item.name, name: item.name, value: item.value})
            )
        });
        console.log(items);
        return (
            <div>
                {items}
                <button type={"button"} onClick={()=>this.validateStep(this.state.items)}>valider</button>
            </div>

        )
    }

}