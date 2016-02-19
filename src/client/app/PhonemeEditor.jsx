import React from 'react';
import Rita from '../../libs/rita-full.js';
import ArpabetToToonBoom from './ArpabetToToonBoom.js';

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
        this._onPreviewClick = this._onPreviewClick.bind(this);
        this._visemeMap = new ArpabetToToonBoom();
    }

    render() {
        return (
            <div className="phonemeEditor">
                <div className="buttonBar">
                    <button id="previewButton" onClick={ this._onPreviewClick }>Preview</button>
                </div>
                <label htmlFor="text">Text:</label>
                <input className="textBox" type="text" value={ this.state.text } id="text" onChange={ this._onTextChange } /><br />
                <label htmlFor="phonemes">Phonemes:</label>
                <textarea className="phonemeBox" rows="10" cols="100" autoComplete="off" autoCorrect="off" autoCapitalize="off" 
spellCheck="false" value={ this.state.phonemes } id="phonemes" 
                    onChange={ this._onPhonemesChange } onKeyUp={ this._onPhonemesKeyDown } onMouseUp={ this._onPhonemesMouseUp } 
                    onFocus={ this._onPhonemesFocus } onBlur={ this.onPhonemesBlue } />
            </div>
        );
    }
    
    _onPreviewClick() {
        var that = this,
            frameToVisemeMap = this._createFrameToVisemeMap(this.state.phonemes);
        
        this.props.wave.play();
        
        function onUpdateMouth() {
            var frameNo = that.props.wave.getPlayFrameNo(), viseme;
            if (frameNo < frameToVisemeMap.length) {
                viseme = frameToVisemeMap[frameNo];
            } else {
                viseme = null;
            }
            that.props.onSetViseme(viseme);
            if (that.props.wave.getIsPlaying()) {
                setTimeout(onUpdateMouth, 10);
            }
        }
        setTimeout(onUpdateMouth, 10);
    }
    
    _onTextChange(event) {
        var sourceText = RiTa.stripPunctuation(event.target.value),
            phonemes = RiTa.getPhonemes(sourceText);
        
        this.setState({
            text: event.target.value,
            phonemes: phonemes
        });
    }
    
    _onPhonemesChange(event) {
        this.setState({
			phonemes: event.target.value.toLowerCase()
		});
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
            var frameNo = this._getFrameNoForCursorPosition(this.state.phonemes, newCursorPos), phoneme, viseme;
            if (frameNo < this.props.wave.getFrameCount() - 1) {
                this.props.wave.playFrame(frameNo);
            }
            this.setState({
                cursorPos: newCursorPos
            });
            phoneme = this._getPhonemeAtPos(this.state.phonemes, newCursorPos);
            viseme = this._visemeMap.getViseme(phoneme);
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
    
    _createFrameToVisemeMap(str) {
        var pos, frameNo = -1, inPhoneme = false, phoneme, viseme, char, ret = [], isQuietFrame;
        
        //Scan from beginning of phoneme string, tracking frames and
        //parsing phonemes. For each frame, put the current viseme.
        for (pos = 0; pos < str.length - 1; ++pos) {
            char = str.charAt(pos);
            isQuietFrame = (this.props.wave.getFrameRms(ret.length) < .1);
            
            if (inPhoneme) {
                if (this._isLetter(char)) {
                    phoneme += char;
                } else {
                    inPhoneme = false;
                    if (isQuietFrame) {
                        console.log("Quiet at frame #" + ret.length);
                        viseme = null; //Closed mouth.
                    } else {
                        viseme = this._visemeMap.getViseme(phoneme);
                    }
                    ret.push(viseme);
                }
            } else {
                if (this._isLetter(char)) {
                    phoneme = char;
                    inPhoneme = true;
                } else {
                    if (isQuietFrame) {
                        console.log("Quiet at frame #" + ret.length);
                        viseme = null; //Closed mouth.
                    }
                    ret.push(viseme);
                }
            }
        }
        
        //If still in phoneme at the end, add one more frame because there is no non-phoneme character
        //to delimit.
        if (inPhoneme) {
            viseme = this._visemeMap.getViseme(phoneme);
            ret.push(viseme);
        }
        
        //End on closed mouth.
        ret.push(null);
        
        return ret;
    }
    
    _isLetter(str) {
        return str.length === 1 && str.match(/[a-z]/i);
    }
}

export default PhonemeEditor;