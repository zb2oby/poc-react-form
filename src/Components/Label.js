import React from 'react'

const Label = (props) => {
    return(
        <div className={`mcf-pb--2 mcf-pr--3 ${props.fixedWidth && props.fixedWidth}`}>
            <span className="mcf-font-weight--bold mcf-languette__title">{props.children}</span>{props.required && <span className={"mcf-text--danger"}> *</span>}
            {props.sublabel && <p className="mcf-mb--0"><small>{props.sublabel}</small></p>}
        </div>
    )
}

export default Label