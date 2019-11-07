import React from 'react'

const ErrorMsg = (props) => {
    return(
        <span className="mcf-text--danger">
            <i className="icon icon-erreur mcf-pr--2"/>
            {props.children}
        </span>
    )
}

export default ErrorMsg