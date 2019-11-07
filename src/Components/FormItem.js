import React from 'react';
import Label from './Label';
import ErrorMsg from './ErrorMsg';

export default class FormItem extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {

        let elt = null;

        if (this.props.show) {
            elt =  (
                <div className={`${this.props.className && this.props.className} ${!this.props.inline ? "mcf-col-12" : "mcf-mr--3 mcf-mt--3"} mcf-form-row`}>
                    {this.props.label && <Label fixedWidth={this.props.inline && "label-width"} sublabel={this.props.sublabel ? this.props.sublabel : false} required={this.props.required ? this.props.required : false}>{this.props.label}</Label>}

                    {this.props.children}
                </div>)
        }

        let errors = null;
        if (this.props.errors && this.props.errors.length > 0) {
            errors = this.props.errors.map((error, i)=> {
                return <ErrorMsg key={i}>{error}</ErrorMsg>
            });

        }

        return(
          <div>
              {elt}
              {errors !== null && errors}
          </div>
        )
    }
}