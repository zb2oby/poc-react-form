import React from 'react';

export default class FormItem extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {

        let errors = null;
        if (this.props.item.errors.length > 0) {
            errors = this.props.item.errors.map((error, i)=> {
                return <div key={i}>{error}</div>
            });

        }

        return(
          <div>
              {this.props.show && this.props.item.content}
              {errors !== null && errors}
          </div>
        )
    }
}