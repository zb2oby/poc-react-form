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
                    errors: [],
                    value: dataStore.data.nom ? dataStore.data.nom : "",
                    show: () => (true),
                    render: (props) => (
                        <FormItem {...props}>
                            <input placeholder={props.name} onChange={(e) => this.onChange(props.name, e)} className={"input"} name={props.name} />
                        </FormItem>)
                },
                {
                    name: "prenom",
                    errors: [],
                    value: dataStore.data.prenom ? dataStore.data.prenom : "",
                    show: () => (dataStore.data.nom !== ""),
                    render:(props) => (
                        <FormItem {...props} show={dataStore.data.nom !== ""}>
                            <input placeholder={props.name} onChange={(e) => this.onChange(props.name, e)} className={"input"} name={props.name} />
                        </FormItem>)
                }
            ],

        }
    }



}