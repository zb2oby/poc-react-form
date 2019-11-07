import React from 'react';
import Form from "./Form";
import dataStore from "../Services/dataStore";
import Dispatcher from "../Services/Dispatcher";

export default class Formulaire extends React.Component{

    constructor(props) {
        super (props)
        this.state = {
            persistOk: false,
        }
    }


    persist = (data) => {
        Dispatcher.dispatch({
            type : "UPDATE_DATA",
            data : data
        })
        this.setState({persistOk: true})
    };



    render() {
        return (
            <div className="mcf-container mcf-bg--white mcf-p--5">
                <Form>
                    <Form.Item
                        name="nomJeuneFille"
                        initialValue={dataStore.data.nomJeuneFille}
                        inline={true}
                        label={"Nom de jeune fille"}
                        sublabel={"le nom test est interdit"}
                        show={() => (true)}
                        type={"text"}
                        eventTrigger={"onChange"}
                    >
                        <input className="champsInput" />
                    </Form.Item>
                    <Form.Item
                        label={"Nom usuel"}
                        name="nom"
                        required={true}
                        inline={true}
                        show={() => (true)}
                        type={"text"}
                        eventTrigger={"onChange"}
                    >
                        <input className="champsInput" />
                    </Form.Item>
                    <Form.Item
                        name="prenom"
                        label={"Prénom"}
                        required={true}
                        inline={true}
                        show={(values) => (values && values.nom !== "")}
                        type={"text"} //sert à envoyer e ou e.target.value dans le onchange
                        eventTrigger={"onChange"}
                    >
                        <input className="champsInput" />
                    </Form.Item>
                    <Form.Item
                        name={"submit"}
                        show={()=>(true)}
                        submitAction={this.persist}
                        eventTrigger={"onClick"}
                    >
                        <button className="mcf-btn mcf-btn--primary mcf-pl--6 mcf-pr--6 mcf-m--3 float-r" key={"button-submit"} type={"button"}>valider</button>
                    </Form.Item>
                </Form>
                {this.state.persistOk && <div>Enregistrement OK</div>}
            </div>
        )
    }
}
