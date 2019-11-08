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

            let props = {...item.props}

            if (props.name) {
                if (!props.type || props.type !== "submit") {
                    let val = "";
                    if (props.initialValue) {
                        val = props.initialValue
                    }

                    values[props.name] = val;
                }
            };
            return item;

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

            if (props.name && props.name !== "submit") {
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
                    if (props.hasOwnProperty("callBackAction")) {
                        props.callBackAction(values);
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
            this.initValues();
        }

        //on retourne la valeur de isValid pour l'etape suivante
        return isValid
    };


    defineActionForEvent = (eventTrigger, inputName, inputType, callBackAction) => {

        let actionProps = {};
        let action = null;

        switch (eventTrigger) {
            case "onChange":
                action = (e) => {
                    let val = e;
                    if (inputType === "text") {
                        val = e.target.value
                    }
                    this.onChange(inputName, val)
                }
                break;
            case "onClick":
                if (inputType === "submit") {
                    action = () => this.validateStep(callBackAction);
                } else {
                    action = (e) => this.onChange(inputName, e)
                }
                break;
            default:
                break;

        }

        actionProps[eventTrigger] = action
        return actionProps ;

    };

    render() {

        let items = this.state.items.map((item)=> {

            let formItem = item;

            if (item.props.name) {

                //defninition des actions à passer à l'input en fonction des eventTrigger passés à formitem
                let actionProps = this.defineActionForEvent(item.props.eventTrigger, item.props.name, item.props.type, item.props.callBackAction);

                //clonage de l'input avec les props du formitem
                let inputProps = {
                    name: item.props.name,
                    value: '',
                };

                if (this.state.values[item.props.name]) {
                    inputProps.value = this.state.values[item.props.name];
                }

                let inputField = React.cloneElement(item.props.children, {...inputProps, ...actionProps})

                //clonage du formitem avec les nouveaux children et les nouvelles valeurs du state
                let props = {...item};
                props.show = item.props.show(this.state.values);
                props.key = item.props.name;
                formItem = React.cloneElement(item, {...props, errors: item.props.errors}, inputField);

            } else {

                //clonage de l'input avec les props du formitem

                let actionProps = null
                if (item.props.type === "submit") {
                    actionProps = this.defineActionForEvent("onClick", "", item.props.type, item.props.callBackAction);
                }

                let inputField = React.cloneElement(item.props.children, {...actionProps})

                //clonage du formitem avec les nouveaux children et les nouvelles valeurs du state
                let props = {...item};
                props.show = item.props.show(this.state.values);
                formItem = React.cloneElement(item, {...props}, inputField);

            }

            return formItem;

        });

        //console.log(items)

        return (
            <div>
                {items}
            </div>

        )
    }

}