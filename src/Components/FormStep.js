import React from 'react';
import FormItem from "./FormItem";


export default class FormStep extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            items :  [
                {
                    name: "nom",
                    show: true,
                    errors: [],
                    validationRules: (v)=>this.isNotEmpty(v) ,
                    value: "",
                    content: <input placeholder={"nom"} onChange={(e) => this.onChange("nom", e)} className={"input"} name={"nom"} />
                },
                {
                    name: "prenom",
                    show: true,
                    errors: [],
                    validationRules: (v)=>this.isNotEmpty(v) ,
                    value: "",
                    content:  <input placeholder={"prenom"} onChange={(e) => this.onChange("prenom", e)} className={"input"} name={"prenom"} />
                }
            ],
            /*rules : [
                {
                    ruleType: "champ_vide",
                    names: ["nom", "prenom"],
                    isValid: (v)=> (v === ""),
                    message: "le nom est obligatoire"
                }
            ]*/

        }
    }

    isNotEmpty = (v) => {
       let isValid = v !== "" && v !== null;
        return {isValid: isValid, message: "le champ est obligatoire"}
    }


    onChange = (name, val) => {
        let items = this.state.items.map((item)=> {
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
            item.errors = [];
            let checkValidation = item.validationRules(item.value)
            if (!checkValidation.isValid) {
                isValid = false;
                item.errors.push(checkValidation.message);
            }

            return item;
        });

        if (!isValid) {
            this.setState({
                items: items
            })
        }

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
                <button type={"button"} onClick={this.validate}>valider</button>
            </div>

        )
    }
}