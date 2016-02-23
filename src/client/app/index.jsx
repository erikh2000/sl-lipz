import React from 'react';
import {render} from 'react-dom';
import Wave from './Wave.js';
import WaveSelector from './WaveSelector.jsx';
import PhonemeEditor from './PhonemeEditor.jsx';
import MouthBox from './MouthBox.jsx';
import VisemeBox from './VisemeBox.jsx';

class App extends React.Component {
    constructor(props) {
        super(props);
        var wave = new Wave(24, .1);
        this.state= {
            wave: wave,
            viseme: null,
            visemeType: "blair",
            phonemes: ""
        };
        this.setViseme = this.setViseme.bind(this);
        this.setVisemeType = this.setVisemeType.bind(this);
        this.setPhonemes = this.setPhonemes.bind(this);
    }
  
    render () {
        return (
            <div>
                <WaveSelector wave={this.state.wave} />
                <MouthBox visemeType={this.state.visemeType} viseme={this.state.viseme} />
                <PhonemeEditor wave={this.state.wave} visemeType={this.state.visemeType} setParentViseme={this.setViseme} setParentPhonemes={this.setPhonemes} />
                <VisemeBox wave={this.state.wave} visemeType={this.state.visemeType} phonemes={this.state.phonemes} setParentViseme={this.setViseme} setParentVisemeType={this.setVisemeType} />
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
}

render(<App/>, document.getElementById('app'));
