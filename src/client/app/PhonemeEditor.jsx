import React from 'react';
import VisemeUtil from './VisemeUtil.js';

class PhonemeEditor extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            cursorPos: -1
        };
        this._onPhonemesChange = this._onPhonemesChange.bind(this);
        this._onPhonemesKeyDown = this._onPhonemesKeyDown.bind(this);
        this._onPhonemesMouseUp = this._onPhonemesMouseUp.bind(this);
        this._onPhonemesFocus = this._onPhonemesFocus.bind(this);
        this._onPhonemesBlur = this._onPhonemesBlur.bind(this);
        this.visemeUtil = new VisemeUtil();
    }

    render() {
        var phonemeEditorClass = (this.props.isVisible ? "phonemeEditor formGroup" : "hidden"),
            linkedIconClass = (this.props.isLinked ? "fa fa-link" : "fa fa-chain-broken");
        return (
            <div className={phonemeEditorClass}>
                <label className="leftLabel" htmlFor="phonemes">Phonemes:<span className={linkedIconClass} /></label>
                <textarea className="phonemeBox" rows="10" cols="100" autoComplete="off" autoCorrect="off" autoCapitalize="off" 
spellCheck="false" value={ this.props.phonemes } id="phonemes" 
                    onChange={ this._onPhonemesChange } onKeyUp={ this._onPhonemesKeyDown } onMouseUp={ this._onPhonemesMouseUp } 
                    onFocus={ this._onPhonemesFocus } onBlur={ this.onPhonemesBlur } />
            </div>
        );
    }
    
    _onPhonemesChange(event) {
        var newValue = event.target.value.toLowerCase();
        this.props.setParentPhonemes(newValue);
        this._setFrameOnCursor(event.target);
    }
    
    _onPhonemesKeyDown(event) {
        this.props.setParentIsLinked(false);
        if (event.target.value === "") {
            this.props.setParentIsLinked(true);
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
        var newCursorPos = this._getCaretPosition(el);
        if (newCursorPos === this.state.cursorPos) {
        } else {
            var frameNo = this._getFrameNoForCursorPosition(this.props.phonemes, newCursorPos), phoneme, viseme, frameRms = null;
            if (frameNo < this.props.wave.getFrameCount() - 1) {
                frameRms = this.props.wave.getFrameRms(frameNo);
                this.props.wave.playFrame(frameNo);
            }
            this.setState({
                cursorPos: newCursorPos
            });
            phoneme = this._getPhonemeAtPos(this.props.phonemes, newCursorPos);
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
    
    _getFrameNoForCursorPosition(phonemes, cursorPos) {
        var frameNo = 0, seekPos = 0;
        while (seekPos < cursorPos) {
            var c = phonemes.charAt(seekPos);
            if (c === ' ' || c === '-') {
                ++frameNo
            }
            ++seekPos;
        }
        return frameNo;
    }
    
    _getPhonemeAtPos(str, pos) {
        var left, right;

        //Scan left until find a phoneme.
        for (left = pos; left > -1; --left) {
            if (this._isLetter(str.charAt(left))) {
                break;
            }
        }
        
        if (left === -1) {
            return "-"; //No phoneme found.
        }
        
        //Scan left to find beginning of phoneme.
        for (; left > -1; --left) {
            if (!this._isLetter(str.charAt(left))) {
                break;
            }
        }
        ++left;
        
        //Scan right to find end of phoneme.
        for (right = left + 1; right < str.length - 1; ++right) {
            if (!this._isLetter(str.charAt(right))) {
                break;
            }
        }
        
        return str.substr(left, right-left);
    }
    
    _isLetter(str) {
        return str.length === 1 && str.match(/[a-z]/i);
    }
}

export default PhonemeEditor;