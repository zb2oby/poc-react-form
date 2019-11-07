import React from 'react';
import {rules} from "../Services/ValidationRules";


export default class FormStep extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            items : [],
            values:{},
        }
    }

    componentDidMount() {
        this.initValues();
    }


    initValues = () => {

        let values = {};

        this.state.items.map((item)=> {
            if (item.name) {
                let val = "";
                if (item.initialValue) {
                    val = item.initialValue
                }

                values[item.name] = val;
            }

        });

        this.setState({values: values})
    };


    /**
     * Met à jour la valeur locale d'un element du formulaire
     * @param name
     * @param val
     */
    onChange = (name, val) => {
        let values = this.state.values;
        //on itere sur les items
        let items = this.state.items.map((item)=> {
            if (item.name) {
                //pour l'item qu'on modifie
                if (item.name === name) {
                    //on vide les erreurs s'il en contiens
                    if (item.errors && item.errors.length > 0) {
                        item.errors = []
                    }
                    //on enregistre sa valeur
                    /*item.value = val;*/
                    values[item.name] = val;

                    //execution de la fonction eventuellement définie en callback du changement de valeur
                    if (item.hasOwnProperty("actionAfterChange")) {
                        item.actionAfterChange(values);
                    }

                }
                //pour les autres item si ils sont désormais cachés on vide les erreurs egalement et on réinitialise la valeur
                else if( !item.show(values) ) {
                    if (item.errors && item.errors.length > 0) {
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


    /**
     * Valide un champ particulier du formumlaire, et met à jour ses erreurs
     * @param dataName
     * @param value
     * @returns {boolean}
     */
    validateData = (dataName, value) => {
        let isValid = true;

        let items = this.state.items.map((item)=> {
            if (item.name === dataName) {
                //console.log(item)
                //on vide les précédentes erreurs
                item.errors = [];
                //on charge la liste des regles du champ à valider
                let itemRules = rules[item.name];
                //on itere sur les regle pour les champ actuellement visibles
                if (itemRules) {
                    itemRules.map((rule)=> {
                        //si une règle n'est pas respectée on set isValid à false pour modifier le state et on charge les messages d'erreur dans l'item
                        if (!rule.isValid(value) && item.show(this.state.values) === true) {
                            isValid = false;
                            item.errors.push(rule.message);
                        }
                        return rule;
                    });
                }

            }

            return item;
        });

        if (!isValid) {
            this.setState({
                items: items
            })
        }
        return isValid;
    }

    /**
     * Valide l'ensemble des données du formulaire, met à jour les erreurs, et enregistre les données et renvoi l'etat
     * @returns {boolean}
     */
    validateStep = (persistFunction) => {
        let isValid = true;
        let items = this.state.items.map((item)=> {
            if (item.name) {
                //console.log(item)
                //on vide les précédentes erreurs
                item.errors = [];
                //on charge la liste des regles du champ à valider
                let itemRules = rules[item.name];
                //on itere sur les regle pour les champ actuellement visibles
                if (itemRules) {
                    itemRules.map((rule)=> {
                        //si une règle n'est pas respectée on set isValid à false pour modifier le state et on charge les messages d'erreur dans l'item
                        if (!rule.isValid(this.state.values[item.name]) && item.show(this.state.values) === true) {
                            isValid = false;
                            item.errors.push(rule.message);
                        }
                        return rule;
                    });

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
            persistFunction();
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

        return (
            <div>
                {items}
            </div>

        )
    }

}