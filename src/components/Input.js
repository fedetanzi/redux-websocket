/**
 * Created by federicotanzi on 7/3/17.
 */
import React, { Component } from 'react'
import {ControlLabel, FormControl, FormGroup} from 'react-bootstrap';
import PropTypes from 'prop-types'
import {PLACE_TYPE, STREET_TYPE} from "../constants/ActionTypes";

class Input extends Component{

    static propTypes = {
        fetchSuggestions: PropTypes.func.isRequired ,
        clearSuggestions : PropTypes.func.isRequired ,
        inputChange : PropTypes.func.isRequired ,
        suggest_delay_street : PropTypes.number.isRequired,
        suggest_delay_place : PropTypes.number.isRequired,
        text : PropTypes.string.isRequired,
        change: PropTypes.func.isRequired,
        length_query : PropTypes.number.isRequired
    };

    constructor(props){
        super(props);
        this.state = {
            value: this.props.text || '',
            lastInputTime : null,
        };
        this.handleSearch = this.handleSearch.bind(this);
    }

    handleSearch(e) {
        const query = e.target.value;
        this.setState({ value : query  , lastInputTime: Date.now() });
        this.props.inputChange(query);
        if (!query) {
            this.props.clearSuggestions(query)
        }else if(query.length > this.props.length_query){
            setTimeout(() => {
                if (Date.now() - this.state.lastInputTime >= this.props.suggest_delay_street) {
                    this.props.fetchSuggestions(this.state.value, STREET_TYPE)
                }
            }, this.props.suggest_delay_street);
            setTimeout(() => {
                if (Date.now() - this.state.lastInputTime >= this.props.suggest_delay_place) {
                    this.props.fetchSuggestions(this.state.value, PLACE_TYPE)
                }
            }, this.props.suggest_delay_place);
            this.props.change();
        }
    }

    render() {
        return (
            <div className="input-react">
                <FormGroup
                    controlId="formBasicText"
                >
                    <ControlLabel>Ingrese lugar o dirección</ControlLabel>
                    <FormControl
                        type="text"
                        className="input"
                        value={this.props.text}
                        onChange={this.handleSearch}
                    />
                    <FormControl.Feedback />
                </FormGroup>
            </div>
        );
    }

}

export default Input
