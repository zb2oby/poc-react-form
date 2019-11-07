import React from 'react';
import {rules} from "../Services/ValidationRules";
import Label from "./Label";
import ErrorMsg from "./ErrorMsg";


export default class Form extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            items : [],
            values:{},
        }
    }

    componentDidMount() {
        this.setState({items: this.props.children}, () => (this.initValues()))

    }


    static Item = (props) => {
        let elt = null;

        if (props.show) {
            elt =  (
                <div className={`${props.className && props.className} ${!props.inline ? "mcf-col-12" : "mcf-mr--3 mcf-mt--3"} mcf-form-row`}>
                    {props.label && <Label fixedWidth={props.inline && "label-width"} sublabel={props.sublabel ? props.sublabel : false} required={props.required ? props.required : false}>{props.label}</Label>}

                    {props.children}
                </div>)
        }

        let errors = null;
        if (props.errors && props.errors.length > 0) {
            errors = props.errors.map((error, i)=> {
                return <ErrorMsg key={i}>{error}</ErrorMsg>
            });

        }

        return(
            <div>
                {elt}
                {errors !== null && errors}
            </div>
        )
    };


    initValues = () => {

        let values = {};

        this.state.items.map((item)=> {

            if (item.props.name) {
                let val = "";
                if (item.props.initialValue) {
                    val = item.props.initialValue
                }

                values[item.props.name] = val;
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

            let props = {...item.props}

            if (props.name) {
                //pour l'item qu'on modifie
                if (props.name === name) {
                    //on vide les erreurs s'il en contiens
                    if (props.errors && props.errors.length > 0) {
                        props.errors = []
                    }
                    //on enregistre sa valeur
                    /*item.props.value = val;*/
                    values[props.name] = val;

                    //execution de la fonction eventuellement définie en callback du changement de valeur
                    if (props.hasOwnProperty("actionAfterChange")) {
                        props.actionAfterChange(values);
                    }

                }
                //pour les autres item si ils sont désormais cachés on vide les erreurs egalement et on réinitialise la valeur
                else if( !props.show(values) ) {
                    if (props.errors && props.errors.length > 0) {
                        props.errors = [];
                    }
                    if (props.initialValue) {
                        values[props.name] = props.initialValue
                    } else {
                        values[props.name] = ""
                    }
                }
            }
            return React.cloneElement(item, {...props})
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

            let props = {...item.props}

            if (props.name === dataName) {
                //console.log(item)
                //on vide les précédentes erreurs
                props.errors = [];
                //on charge la liste des regles du champ à valider
                let itemRules = rules[props.name];
                //on itere sur les regle pour les champ actuellement visibles
                if (itemRules) {
                    itemRules.map((rule)=> {
                        //si une règle n'est pas respectée on set isValid à false pour modifier le state et on charge les messages d'erreur dans l'item
                        if (!rule.isValid(value) && props.show(this.state.values) === true) {
                            isValid = false;
                            props.errors.push(rule.message);
                        }
                        return rule;
                    });
                }

            }
            return React.cloneElement(item, {...props})
            //return item;
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

            let props = {...item.props}

            if (props.name && props.name !== "submit") {
                //console.log(item)
                //on vide les précédentes erreurs
                props.errors = [];
                //on charge la liste des regles du champ à valider
                let itemRules = rules[props.name];
                //on itere sur les regle pour les champ actuellement visibles
                if (itemRules) {
                    itemRules.map((rule)=> {
                        //si une règle n'est pas respectée on set isValid à false pour modifier le state et on charge les messages d'erreur dans l'item
                        if (!rule.isValid(this.state.values[props.name]) && props.show(this.state.values) === true) {
                            isValid = false;
                            props.errors.push(rule.message);
                        }
                        return rule;
                    });

                }
            }
            return React.cloneElement(item, {...props})
            //return item;
        });

        //si au moins une erreur a été rencontrée on recharge les items
        if (!isValid) {
            this.setState({
                items: items
            })
        } else {
            persistFunction(this.state.values);
        }

        //on retourne la valeur de isValid pour l'etape suivante
        return isValid
    };


    render() {

        const items = this.state.items.map((item)=> {

            if (item.props.name) {
                let props = {...item};
                props.show = item.props.show(this.state.values);
                props.key = item.props.name;
                delete props.render;

                let onChange = null;
                if (item.props.eventTrigger === "onChange") {

                    onChange = (e) => {
                        let val = e;
                        if (item.props.type === "text") {
                            val = e.target.value
                        }
                        this.onChange(item.props.name, val)
                    }
                }
                let onClick = null;
                if (item.props.eventTrigger === "onClick") {
                    if (item.props.name === "submit") {
                        onClick = () => this.validateStep(item.props.submitAction);
                    } else {
                        onClick = (e) => this.onChange(item.props.name, e.target.value)
                    }
                }


                let inputField = React.cloneElement(item.props.children, {name: item.props.name, onChange: onChange, onClick: onClick, defaultValue: this.state.values[item.props.name]})
                return React.cloneElement(item, {...props, errors: item.props.errors}, inputField)

            } else {
                let props = {...item};
                props.show = item.props.show(this.state.values);
                return React.cloneElement(item, {...props})
            }

        });

        return (
            <div>
                {items}
            </div>

        )
    }

}