import React from 'react';
import FormStep from "./FormStep";
import FormItem from "./FormItem";
import Dispatcher from "../Services/Dispatcher";
import dataStore from "../Services/dataStore";

export default class Step1IRD extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items :  [
                {
                    name: "nomJeuneFille",
                    initialValue: dataStore.data.nomJeuneFille,
                    show: () => (true),
                    render: (props) => (
                        <FormItem {...props} inline={true} label={"Nom de jeune fille"} sublabel={"le nom test est interdit"}>
                            <input className="champsInput" defaultValue={this.state.values && this.state.values.nomJeuneFille} onChange={(e) => this.onChange(props.name, e.target.value)} name={props.name} />
                        </FormItem>)
                },
                {
                    name: "nom",
                    show: () => (true),
                    render: (props) => (
                        <FormItem {...props} inline={true} label={"Nom usuel"} required={true}>
                            <input className="champsInput" defaultValue={this.state.values && this.state.values.nom} onChange={(e) => this.onChange(props.name, e.target.value)} name={props.name} />
                        </FormItem>)
                },
                {
                    name: "prenom",
                    show: (values) => (values && values.nom !== ""),
                    render:(props) => (
                        <FormItem {...props} inline={true} label={"Prénom"} required={true}>
                            <input className="champsInput" defaultValue={this.state.values && this.state.values.prenom} onChange={(e) => this.onChange(props.name, e.target.value)} name={props.name} />
                        </FormItem>)
                },
                {
                    show: () => (true),
                    render: () => (
                        <button className="mcf-btn mcf-btn--primary mcf-pl--6 mcf-pr--6 mcf-m--3 float-r" key={"button-submit"} type={"button"} onClick={()=>this.validateStep(this.persist)}>valider</button>
                    )
                }
            ],

        }
    }


   /* persist = () => {
        Dispatcher.dispatch({
            type : "UPDATE_DATA",
            data : this.state.values
        })
        this.setState({messageOk: "EnregistrementOk"})

    }
*/


}