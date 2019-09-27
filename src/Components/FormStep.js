import React from 'react';
import FormItem from "./FormItem";
import {rules} from "../Services/ValidationRules";


export default class FormStep extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            items: props.schema
        }
    }


    onChange = (name, val) => {
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
    }


    validate = () => {
        let isValid = true;
        let items = this.state.items.map((item)=> {
            //on vide les précédentes erreurs
            item.errors = [];
            //on charge la liste des regles du champ à valider
            let itemRules = rules[item.name];
            //on itere sur les regle
            itemRules.map((rule)=> {
                //si une règle n'est pas respectée on set isValid à false pour modifier le state et on charge les messages d'erreur dans l'item
                if (!rule.isValid(item.value)) {
                    isValid = false;
                    item.errors.push(rule.message);
                }
            });
            return item;
        });

        //si au moins une erreur a été rencontrée on recharge les items
        if (!isValid) {
            this.setState({
                items: items
            })
        }

        //on retourne la valeur de isValid pour l'etape suivante
        return isValid
    };


    render() {
        const items = this.state.items.map((item)=> {
            return (
                <FormItem key={item.name} item={item}/>
                )
        })


        return (
            <div>
                {items}
                <button type={"button"} onClick={()=>this.validate(this.state.items)}>valider</button>
            </div>

        )
    }
}