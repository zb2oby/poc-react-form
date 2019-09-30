import React from 'react';
import FormStep from "./FormStep";
import dataStore from "../Services/dataStore";
import FormItem from "./FormItem";


export default class Step1IRD extends FormStep {
    constructor(props) {
        super(props);
        this.state = {
            items :  [
                {
                    name: "nom",
                    show: true,
                    errors: [],
                    value: dataStore.data.nom ? dataStore.data.nom : "",
                    content: <input placeholder={"nom"} onChange={(e) => this.onChange("nom", e)} className={"input"} name={"nom"} />
                },
                {
                    name: "prenom",
                    show : dataStore.data.nom !== "",
                    errors: [],
                    value: dataStore.data.prenom ? dataStore.data.prenom : "",
                    content:  <input placeholder={"prenom"} onChange={(e) => this.onChange("prenom", e)} className={"input"} name={"prenom"} />
                }
            ],

        }
    }




    render() {
        const items = this.state.items.map((item)=> {
            return (
                <FormItem key={item.name} show={item.show} item={item}/>
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