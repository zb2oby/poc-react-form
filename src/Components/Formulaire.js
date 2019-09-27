import React from 'react';
import FormStep from "./FormStep";
import Step1IRD from "./Step1IRD";

export default class Formulaire extends React.Component {

    constructor(props) {
        super (props)
    }


    render() {
        return (
            <Step1IRD/>
        )
    }
}