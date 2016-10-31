import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import VisemeUtil from './VisemeUtil.js';
import PhonemeUtil from './PhonemeUtil.js';
import * as Actions from './Actions.js';

function mapStateToProps(state) {
    return {
        phonemes:                   state.phonemes,
        arePhonemesLinkedToText:    state.arePhonemesLinkedToText
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Actions, dispatch)
    };
}

class PhonemeEditor extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            cursorPos: -1,
            frameNo: 0
        };
        this._onPhonemesChange = this._onPhonemesChange.bind(this);
        this._onPhonemesKeyUp = this._onPhonemesKeyUp.bind(this);
        this._onPhonemesMouseUp = this._onPhonemesMouseUp.bind(this);
        this._onPhonemesFocus = this._onPhonemesFocus.bind(this);
        this._onPhonemesBlur = this._onPhonemesBlur.bind(this);
        this.visemeUtil = new VisemeUtil();
        this.phonemeUtil = new PhonemeUtil();
    }

    render() {
        var phonemeEditorClass = (this.props.isVisible ? "phonemeEditor formGroup" : "hidden"),
            linkedIconClass = (this.props.arePhonemesLinkedToText ? "fa fa-link" : "fa fa-chain-broken"),
            showFrameNo = this.state.frameNo + 1;
        return (
            <div className={phonemeEditorClass}>
                <label className="leftLabel" htmlFor="phonemes">Phonemes:<span className={linkedIconClass} />
                <br /><br />Frame {showFrameNo}/{this.props.wave.getFrameCount()}</label>
                <textarea className="phonemeBox" rows="10" cols="100" autoComplete="off" autoCorrect="off" autoCapitalize="off" 
spellCheck="false" value={ this.props.phonemes } id="phonemes" 
                    onChange={ this._onPhonemesChange } onKeyUp={ this._onPhonemesKeyUp } onMouseUp={ this._onPhonemesMouseUp } 
                    onFocus={ this._onPhonemesFocus } onBlur={ this.onPhonemesBlur } />
            </div>
        );
    }
    
    _onPhonemesChange(event) {
        var newValue = event.target.value.toLowerCase();
        newValue = this.phonemeUtil.normalizePhonemes(newValue);
        this.props.actions.setPhonemes(newValue);
        this._setFrameOnCursor(event.target);
    }
    
    _onPhonemesKeyUp(event) {
        this.props.actions.setArePhonemesLinkedToText(false);
        if (event.target.value === "") {
            this.props.actions.setArePhonemesLinkedToText(true);
        }
        this._setFrameOnCursor(event.target);
    }
    
    _onPhonemesMouseUp(event) {
        this._setFrameOnCursor(event.target);
    }
    
    _onPhonemesFocus(event) {
        this._setFrameOnCursor(event.target);
    }
    
    _onPhonemesBlur(event) {
        this.setState({
            cursorPos: -1
        });
    }
    
    _setFrameOnCursor(el) {
        var newCursorPos = this._getCaretPosition(el), phonemes = el.value;
        if (newCursorPos === this.state.cursorPos) {
        } else {
            var frameNo = this.phonemeUtil.getFrameNoAtPos(phonemes, newCursorPos), 
                phoneme, viseme, frameRms = null;
            if (frameNo < this.props.wave.getFrameCount() - 1) {
                frameRms = this.props.wave.getFrameRms(frameNo);
                this.props.wave.playFrame(frameNo);
            }
            this.setState({
                frameNo: frameNo,
                cursorPos: newCursorPos
            });
            phoneme = this.phonemeUtil.getPhonemeAtPos(phonemes, newCursorPos);
            viseme = this.visemeUtil.getFrameViseme(this.props.visemeType, frameRms, phoneme);
            this.props.setParentViseme(viseme);
        }
    }
    
    _getCaretPosition (oField) {
      var iCaretPos = 0;

      //IE Support
      if (document.selection) {
        //Set focus on the element
        oField.focus();

        //To get cursor position, get empty selection range
        var oSel = document.selection.createRange();

        //Move selection start to 0 position
        oSel.moveStart('character', -oField.value.length);

        //The caret position is selection length
        iCaretPos = oSel.text.length;
      } else if (oField.selectionStart || oField.selectionStart == '0') { // Firefox support
        iCaretPos = oField.selectionStart;
      }

      // Return results
      return iCaretPos;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PhonemeEditor);