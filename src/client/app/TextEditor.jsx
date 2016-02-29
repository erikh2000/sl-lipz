import React from 'react';

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
        
        return (
            <div className={ textEditorClass }>
                <label className="leftLabel" htmlFor="text">Text:</label>
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
        this.props.parentSetText(event.target.value);
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