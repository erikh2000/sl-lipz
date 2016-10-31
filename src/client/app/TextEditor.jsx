import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from './Actions.js';

function mapStateToProps(state) {
    return {
        text: state.text
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Actions, dispatch)
    };
}

class TextEditor extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            isEditing: true
        };
        this._onTextChange = this._onTextChange.bind(this);
        this._onTextBlur = this._onTextBlur.bind(this);
        this._onEditClick = this._onEditClick.bind(this);
    }

    render() {
        var textEditorClass = (this.props.isVisible ? "textEditor formGroup" : "hidden"),
            textBoxClass = (this.state.isEditing ? "textBox" : "hidden"), 
            textLabelClass = (this.state.isEditing ? "hidden" : "textLabel");
        
        console.log(textEditorClass);
        
        return (
            <div className={ textEditorClass }>
                <label className="leftLabel">Text:</label>
                <div className={ textLabelClass } >{ this.props.text } <button id="changeFile" className="fa fa-pencil" onClick={ this._onEditClick } /></div>
                <textarea id="theTextBox" className={ textBoxClass } rows="10" cols="100" value={ this.props.text } onChange={ this._onTextChange } onBlur={ this._onTextBlur } />
            </div>
        );
    }
    
    componentDidUpdate(prevProps) {
        if (this.state.isEditing) {
            document.getElementById("theTextBox").focus();
        }
    }
    
    _onTextChange(event) {
        this.props.actions.setText(event.target.value);
    }
    
    _onTextBlur() {
        this.setState({
            isEditing: false
        });
    }
    
    _onEditClick() {
        this.setState({
            isEditing: true
        });
    }
}

export default TextEditor;