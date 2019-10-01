import React from 'react';

export default class FormItem extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {

        let errors = null;
        if (this.props.errors.length > 0) {
            errors = this.props.errors.map((error, i)=> {
                return <div key={i}>{error}</div>
            });

        }

        return(
          <div>
              {this.props.show && this.props.children}
              {errors !== null && errors}
          </div>
        )
    }
}