import React from 'react';
import {render} from 'react-dom';
import PhonemeUtil from './PhonemeUtil.js';
import VisemeUtil from './VisemeUtil.js';
import Wave from './Wave.js';
import WaveSelector from './WaveSelector.jsx';
import PhonemeEditor from './PhonemeEditor.jsx';
import TextEditor from './TextEditor.jsx';
import MouthBox from './MouthBox.jsx';

class App extends React.Component {
    constructor(props) {
        super(props);
        var wave = new Wave(24, .1);
        this.state= {
            wave: wave,
            viseme: null,
            visemeType: "blair",
            text: "",
            phonemes: "",
            arePhonemesLinkedToText: true,
            isWaveLoaded: false,
            isWavePlaying: false
        };
        this.phonemeUtil = new PhonemeUtil();
        this.visemeUtil = new VisemeUtil();
        this.setViseme = this.setViseme.bind(this);
        this.setVisemeType = this.setVisemeType.bind(this);
        this.setPhonemes = this.setPhonemes.bind(this);
        this.setText = this.setText.bind(this);
        this.onWaveLoaded = this.onWaveLoaded.bind(this);
        this.setArePhonemesLinkedToText = this.setArePhonemesLinkedToText.bind(this);
        this.play = this.play.bind(this);
    }
  
    render () {
        var isTextEditorVisible = this.state.isWaveLoaded;
        var isPhonemeEditorVisible = (this.state.visemeType != "rms") && isTextEditorVisible && this.state.text !== "";
        
        return (
            <div>
                <MouthBox isWaveLoaded={this.state.isWaveLoaded} parentPlay={this.play} visemeType={this.state.visemeType} viseme={this.state.viseme} />
                <WaveSelector wave={this.state.wave} parentOnWaveLoaded={this.onWaveLoaded} />
                <TextEditor isVisible={isTextEditorVisible} text={this.state.text} parentSetText={this.setText} />
                <PhonemeEditor isVisible={isPhonemeEditorVisible} isLinked={this.state.arePhonemesLinkedToText} wave={this.state.wave} visemeType={this.state.visemeType} phonemes={this.state.phonemes} setParentViseme={this.setViseme} setParentPhonemes={this.setPhonemes} setParentIsLinked={this.setArePhonemesLinkedToText} />
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
    
    onWaveLoaded(isLoaded) {
        this.setState({
            isWaveLoaded: isLoaded
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
            console.log("frame#=" +frameNo);
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
}

render(<App/>, document.getElementById('app'));
