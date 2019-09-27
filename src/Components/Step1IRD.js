import React from 'react';
import FormStep from "./FormStep";
import {rules} from "../Services/ValidationRules";


export default class Step1IRD extends FormStep {
    constructor(props) {
        super(props)
        this.state = {
            items :  [
                {
                    name: "nom",
                    show: true,
                    errors: [],
                    value: "",
                    content: <input placeholder={"nom"} onChange={(e) => this.onChange("nom", e)} className={"input"} name={"nom"} />
                },
                {
                    name: "prenom",
                    show: true,
                    errors: [],
                    value: "",
                    content:  <input placeholder={"prenom"} onChange={(e) => this.onChange("prenom", e)} className={"input"} name={"prenom"} />
                }
            ],

        }
    }
}