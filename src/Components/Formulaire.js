import React from 'react';
import FormStep from "./FormStep";
import Step1IRD from "./Step1IRD";

export default class Formulaire extends React.Component {

    constructor(props) {
        super (props)
    }


    render() {
        return (
            <div className="mcf-container mcf-bg--white mcf-p--5">
                <Step1IRD/>
            </div>
        )
    }
}