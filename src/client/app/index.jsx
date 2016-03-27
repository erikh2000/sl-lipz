import React from 'react';
import {render} from 'react-dom';
import PhonemeUtil from './PhonemeUtil.js';
import VisemeUtil from './VisemeUtil.js';
import Wave from './Wave.js';
import WaveSelector from './WaveSelector.jsx';
import PhonemeEditor from './PhonemeEditor.jsx';
import TextEditor from './TextEditor.jsx';
import MouthBox from './MouthBox.jsx';

function getDefaultState(wave) {
    return {
        wave: wave,
        viseme: null,
        visemeType: "blair",
        text: "",
        phonemes: "",
        arePhonemesLinkedToText: true,
        isWaveLoaded: false,
        isWavePlaying: false,
        waveFilename: null
    };
}

class App extends React.Component {

    constructor(props) {
        super(props);
        var wave = new Wave(24, .1);
        this.state = getDefaultState(wave); 
        this.phonemeUtil = new PhonemeUtil();
        this.visemeUtil = new VisemeUtil();
        this.setViseme = this.setViseme.bind(this);
        this.setVisemeType = this.setVisemeType.bind(this);
        this.setPhonemes = this.setPhonemes.bind(this);
        this.setText = this.setText.bind(this);
        this.onWaveLoaded = this.onWaveLoaded.bind(this);
        this.setArePhonemesLinkedToText = this.setArePhonemesLinkedToText.bind(this);
        this.play = this.play.bind(this);
        this._onSettingsClick = this._onSettingsClick.bind(this);
        this._onDownloadClick = this._onDownloadClick.bind(this);
        this._onClearClick = this._onClearClick.bind(this);
    }
  
    render () {
        var isTextEditorVisible = this.state.isWaveLoaded;
        var isPhonemeEditorVisible = (this.state.visemeType != "rms") && isTextEditorVisible && this.state.text !== "";
        
        return (
            <div>
                <MouthBox isWaveLoaded={this.state.isWaveLoaded} parentPlay={this.play} visemeType={this.state.visemeType} viseme={this.state.viseme} />
                <WaveSelector isWaveLoaded={this.state.isWaveLoaded} wave={this.state.wave} parentOnWaveLoaded={this.onWaveLoaded} />
                <TextEditor isVisible={isTextEditorVisible} text={this.state.text} parentSetText={this.setText} />
                <PhonemeEditor isVisible={isPhonemeEditorVisible} isLinked={this.state.arePhonemesLinkedToText} wave={this.state.wave} visemeType={this.state.visemeType} phonemes={this.state.phonemes} setParentViseme={this.setViseme} setParentPhonemes={this.setPhonemes} setParentIsLinked={this.setArePhonemesLinkedToText} />
                <div className="formGroup buttonBar">
                    <button className="settingsButton" onClick={this._onSettingsClick}>Settings...</button>
                    <button className="clearButton" onClick={this._onClearClick}>Clear</button>
                    <button className="downloadButton" onClick={this._onDownloadClick}>Download .Lipz</button>
                </div>
            </div>
        );
    }
    
    setViseme(viseme) {
        this.setState({
            viseme: viseme
        });
    }
    
    setVisemeType(visemeType) {
        this.setState({
            visemeType: visemeType
        });
    }
    
    setPhonemes(phonemes) {
        this.setState({
            phonemes: phonemes
        });
    }
    
    onWaveLoaded(isLoaded, filename) {
        this.setState({
            isWaveLoaded: isLoaded,
            waveFilename: filename
        });
    }
    
    setText(text) {
        if (this.state.arePhonemesLinkedToText) {
            var phonemes = this.phonemeUtil.getPhonemesFromText(text);
            this.setState({
                text: text,
                phonemes: phonemes
            });
        } else {
            this.setState({
                text: text
            });
        }
    }
    
    setArePhonemesLinkedToText(isLinked) {
        this.setState({
            arePhonemesLinkedToText: isLinked
        });
    }
    
    play() {
        var that = this,
            frameVisemes = this.visemeUtil.createFrameVisemesForWave(this.state.visemeType, this.state.wave, this.state.phonemes);
        
        this.state.wave.play();
        setTimeout(onUpdateMouth, 10);
        
        function onUpdateMouth() {
            //Close mouth and stop calling back this function if wave is done playing.
            if (!that.state.wave.getIsPlaying()) {
                that.setViseme("-");
                return;
            }
            
            //Get viseme for currently playing frame and update mouth.
            var frameNo = that.state.wave.getPlayFrameNo(), viseme;
            if (frameNo < frameVisemes.length) {
                viseme = frameVisemes[frameNo];
            } else {
                viseme = "-";
            }
            that.setViseme(viseme);
            
            //Call this function again in a bit.
            setTimeout(onUpdateMouth, 10);
        }
    }
    
    _onSettingsClick() {
        //TODO
    }
    
    _onClearClick() {
        //Clear wave file selection--TODO
        var defaultState = getDefaultState(this.state.wave);
        console.log(defaultState);
        this.state.wave.clear();
        this.setState(
            defaultState
        );
    }
    
    _onDownloadClick() {
        var frameVisemes = this.visemeUtil.createFrameVisemesForWave(this.state.visemeType, this.state.wave, this.state.phonemes).join(""),
            lipzContent = {
                fps: 24,
                "text_en-us": this.state.text,
                visemeType: this.state.visemeType,
                visemes: frameVisemes
            },
            lipzText = JSON.stringify(lipzContent),
            filename = this.getLipzFilename(this.state.waveFilename);
        
        this.downloadTextAsFile(filename, lipzText);
    }
    
    downloadTextAsFile(filename, text) {
          var element = document.createElement('a');
          element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
          element.setAttribute('download', filename);

          element.style.display = 'none';
          document.body.appendChild(element);

          element.click();

          document.body.removeChild(element);
    }
    
    getLipzFilename(waveFilename) {
        if (waveFilename && waveFilename.length > 1) {
            var extensionPos = waveFilename.lastIndexOf(".");
            if (extensionPos === -1) {
                return waveFilename + ".lipz";
            } else {
                return waveFilename.substring(0, extensionPos) + ".lipz";
            }
        } else {
            return "default.lipz";
        }
    }
}

render(<App/>, document.getElementById('app'));
