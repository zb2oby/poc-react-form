import React, {useState, useEffect} from 'react';

const Radio = (props) => {

    const {value, defaultValue, name, className, onChange} = props
    const [checked, setChecked] = useState();

    useEffect(() => {
        setChecked(defaultValue === value.value)
    }, [defaultValue, value.value]);


    const id = 'radio_' + name + '_' + value.value;
    return (
        <>
            <label htmlFor={id}>{value.label}</label>
            <input type={"radio"} id={id} name={name} className={className} value={value.value} onClick={(e) => onChange(e)} defaultChecked={checked}/>
        </>

    )

}

export default Radio;