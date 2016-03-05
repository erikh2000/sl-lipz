import Rita from '../../libs/rita-full.js';

class PhonemeUtil {
    constructor() {
        
    }
    
    getPhonemesFromText(text) {
        var sourceText = text.toLowerCase().trim(), phonemes;
        
        sourceText = sourceText.replace(/\'/g, ''); //Remove apostrophes.
        sourceText = sourceText.replace(/\|/g, ' | '); //Put spaces around delimiters so they don't mess up arpabet parsing.
        
        var phonemes = RiTa.getPhonemes(sourceText);
        
        phonemes = this.normalizePhonemes(phonemes);
        
        phonemes = phonemes.replace(/\s\s+/g, ' '); //Condense multiple whitespace characters to a single space.
        phonemes = phonemes.replace(/ \|/g, '\|'); //Remove space in front of "|".
        phonemes = phonemes.replace(/\| /g, '\|'); //Remove space after "|".
        
        return phonemes;
    }
    
    normalizePhonemes(value) {
        var phonemes = value.toLowerCase();
        phonemes = phonemes.replace(/-/g, ' '); //Replace "-" with " ".
        phonemes = phonemes.replace(/[^a-z\|\s:]/g, ''); //Remove any non-arpabet and non "|" characters.
        
        return phonemes;
    }

    getFrameNoAtPos(phonemes, cursorPos) {
        var frameNo = 0, seekPos = 0;
        while (seekPos < cursorPos) {
            var c = phonemes.charAt(seekPos);
            if (c === ' ' || c === '|') {
                ++frameNo
            }
            ++seekPos;
        }
        return frameNo;
    }
    
    getPhonemeAtPos(phonemes, pos) {
        var left, right;

        //Scan left until find a phoneme.
        for (left = pos; left > -1; --left) {
            if (this._isLetter(phonemes.charAt(left))) {
                break;
            }
        }
        
        if (left === -1) {
            return "-"; //No phoneme found.
        }
        
        //Scan left to find beginning of phoneme.
        for (; left > -1; --left) {
            if (!this._isLetter(phonemes.charAt(left))) {
                break;
            }
        }
        ++left;
        
        //Scan right to find end of phoneme.
        for (right = left + 1; right < phonemes.length; ++right) {
            if (!this._isLetter(phonemes.charAt(right))) {
                break;
            }
        }
        
        return phonemes.substr(left, right-left);
    }
    
    _isLetter(str) {
        return str.length === 1 && str.match(/[a-z]/i);
    }
}

export default PhonemeUtil;