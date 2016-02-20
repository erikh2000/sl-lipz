import React from 'react';
import Rita from '../../libs/rita-full.js';
import VisemeUtil from './VisemeUtil.js';

class PhonemeEditor extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            text: "",
            phonemes: "",
            cursorPos: -1
        };
        this._onPhonemesChange = this._onPhonemesChange.bind(this);
        this._onPhonemesKeyDown = this._onPhonemesKeyDown.bind(this);
        this._onPhonemesMouseUp = this._onPhonemesMouseUp.bind(this);
        this._onPhonemesFocus = this._onPhonemesFocus.bind(this);
        this._onPhonemesBlur = this._onPhonemesBlur.bind(this);
        this._onTextChange = this._onTextChange.bind(this);
        this.visemeUtil = new VisemeUtil();
    }

    render() {
        return (
            <div className="phonemeEditor formGroup">
                <label className="leftLabel" htmlFor="text">Text:</label>
                <input className="textBox" type="text" value={ this.state.text } id="text" onChange={ this._onTextChange } /><br />
                <label className="leftLabel" htmlFor="phonemes">Phonemes:</label>
                <textarea className="phonemeBox" rows="10" cols="100" autoComplete="off" autoCorrect="off" autoCapitalize="off" 
spellCheck="false" value={ this.state.phonemes } id="phonemes" 
                    onChange={ this._onPhonemesChange } onKeyUp={ this._onPhonemesKeyDown } onMouseUp={ this._onPhonemesMouseUp } 
                    onFocus={ this._onPhonemesFocus } onBlur={ this.onPhonemesBlue } />
            </div>
        );
    }
    
    _onTextChange(event) {
        var sourceText = RiTa.stripPunctuation(event.target.value),
            phonemes = RiTa.getPhonemes(sourceText);
        
        this.setState({
            text: event.target.value,
            phonemes: phonemes
        });
        
        this.props.onSetPhonemes(phonemes);
    }
    
    _onPhonemesChange(event) {
        var newValue = event.target.value.toLowerCase();
        this.setState({
			phonemes: newValue
		});
        this.props.onSetPhonemes(phonemes);
        this._setFrameOnCursor(event.target);
    }
    
    _onPhonemesKeyDown(event) {
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
            var frameNo = this._getFrameNoForCursorPosition(this.state.phonemes, newCursorPos), phoneme, viseme, frameRms = null;
            if (frameNo < this.props.wave.getFrameCount() - 1) {
                frameRms = this.props.wave.getFrameRms(frameNo);
                this.props.wave.playFrame(frameNo);
            }
            this.setState({
                cursorPos: newCursorPos
            });
            phoneme = this._getPhonemeAtPos(this.state.phonemes, newCursorPos);
            viseme = this.visemeUtil.getFrameViseme('toonboom', frameRms, phoneme); //TODO--get viseme type and pass in 1st param.
            this.props.onSetViseme(viseme);
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