import ArpabetToToonBoom from './ArpabetToToonBoom.js';
import ArpabetToBlair from './ArpabetToBlair.js';

class VisemeUtil {
    constructor() {
        this.arpabetToToonBoom = new ArpabetToToonBoom();
        this.arpabetToBlair = new ArpabetToBlair();
        this.rmsQuiet = .0001;
        this.rmsPeak = .5;
        this.rmsFirstViseme = "1";
        this.rmsLastViseme = "9";
        this.rmsVisemeCount = this.rmsLastViseme.charCodeAt(0) - this.rmsFirstViseme.charCodeAt(0) + 1;
    }
    
    getFrameViseme(visemeType, frameRMS, phoneme) {
        if (frameRMS && frameRMS < this.rmsQuiet) {
            return "-";
        }
        
        if (visemeType === 'rms') {
            return getFrameVisemeUsingRMS(frameRMS);
        } else if (visemeType === 'blair') {
            return this.arpabetToBlair.getViseme(phoneme);
        } else if (visemeType === 'toonboom') {
            return this.arpabetToToonBoom.getViseme(phoneme);
        } else {
            console.error("Unknown viseme type - " + visemeType);
            return "-";
        }
    }
    
    getFrameVisemeUsingRMS(rms) {
        var ratio;
        if (rms < this.rmsQuiet) {
            return this.rmsFirstViseme;
        } else if (rms > this.rmsPeak) {
            return this.rmsLastViseme;
        }
        ratio = (rms - this.rmsQuiet) / (this.rmsPeak - this.rmsQuiet);
        return String.fromCharCode(this.rmsFirstViseme.charCodeAt(0) + Math.floor(ratio * this.rmsVisemeCount));
    }
    
    createFrameVisemesForWaveUsingRMS(wave) {
        var ret = [], frameCount = wave.getFrameCount(), frameNo, rms;
        
        for (frameNo = 0; frameNo < frameCount; ++frameNo) {
            rms = wave.getFrameRms(frameNo);
            ret.push(this.getFrameVisemeUsingRMS(rms));
        }
        ret.push("-");
        
        return ret;
    }
    
    createFrameVisemesForWave(visemeType, wave, phonemes) {
        var pos, frameNo = -1, inPhoneme = false, isQuietFrame, phoneme, viseme = "-", visemeMap, char, 
            frameRMS, waveFrameCount = wave.getFrameCount(), ret = [];
        
        if (visemeType === 'rms') {
            return this.createFrameVisemesForWaveUsingRMS(wave);
        } else if (visemeType === 'toonboom') {
            visemeMap = this.arpabetToToonBoom;
        } else if (visemeType === 'blair') {
            visemeMap = this.arpabetToBlair;
        } else {
            console.error("Unknown viseme type - " + visemeType);
            return [];
        }
        
        //Scan from beginning of phoneme string, tracking frames and
        //parsing phonemes. For each frame, put the current viseme.
        for (pos = 0; pos < phonemes.length - 1; ++pos) {
            char = phonemes.charAt(pos);
            frameRMS = wave.getFrameRms(ret.length);
            isQuietFrame = frameRMS < this.rmsQuiet;
            
            if (inPhoneme) {
                if (this.isLetter(char)) {
                    phoneme += char;
                } else {
                    inPhoneme = false;
                    if (isQuietFrame) {
                        viseme = "-"; 
                    } else {
                        viseme = this.getFrameViseme(visemeType, frameRMS, phoneme);
                    }
                    ret.push(viseme);
                }
            } else {
                if (this.isLetter(char)) {
                    phoneme = char;
                    inPhoneme = true;
                } else {
                    if (isQuietFrame) {
                        viseme = "-";
                    }
                    ret.push(viseme);
                }
            }
        }
        
        //For any remaining frames in wave that went beyond viseme frames generated from phonemes, continue
        //the last viseme until RMS goes under quiet threshold. Then continue padding with "-" (resting mouth)
        while (ret.length < waveFrameCount) {
            frameRMS = wave.getFrameRms(ret.length);
            if (frameRMS < this.rmsQuiet) {
                ret.push("-");
            } else {
                ret.push(viseme);
            }
        }
        
        return ret;
    }
    
    isLetter(str) {
        return str.length === 1 && str.match(/[a-z]/i);
    }
}

export default VisemeUtil;