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
            phonemes: ""
        };
        this.onSetViseme = this.onSetViseme.bind(this);
        this.onSetPhonemes = this.onSetPhonemes.bind(this);
    }
  
    render () {
        return (
            <div>
                <WaveSelector wave={this.state.wave} />
                <MouthBox viseme={this.state.viseme} />
                <PhonemeEditor wave={this.state.wave} onSetViseme={this.onSetViseme} onSetPhonemes={this.onSetPhonemes} />
                <VisemeBox wave={this.state.wave} phonemes={this.state.phonemes} onSetViseme={this.onSetViseme} />
            </div>
        );
    }
    
    onSetViseme(viseme) {
        this.setState({
            viseme: viseme
        });
    }
    
    onSetPhonemes(phonemes) {
        this.setState({
            phonemes: phonemes
        });
    }
}

render(<App/>, document.getElementById('app'));
