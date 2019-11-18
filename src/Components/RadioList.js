import React from 'react'
import Radio from "./Radio";

/**
 * Encapsule une liste de boutons radios
 * Props :
 * - values : Tableau de valeurs
 * - name : nom des radios
 * - onChange : callback appelé à la sélection d'un bouton radio, renvoie la valeur sélectionnée
 */
const RadioList = (props) => {

    const { dataSet, name, className, onChange, value } = props;

    let elts = dataSet.map((v, k) => {

        return (
            <Radio key={k} value={v} defaultValue={value} onChange={(e) => onChange(e)} name={name} className={className}/>
        )
    });

    return (
        <>
        {elts}
        </>
    )

};

export default RadioList;