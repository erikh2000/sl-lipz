import React from 'react';
import {render} from 'react-dom';
import Wave from './Wave.js';
import WaveSelector from './WaveSelector.jsx';
import PhonemeEditor from './PhonemeEditor.jsx';
import MouthBox from './MouthBox.jsx';

class App extends React.Component {
    constructor(props) {
        super(props);
        var wave = new Wave(24, .1);
        this.state= {
            wave: wave,
            viseme: null
        };
        this.onSetViseme = this.onSetViseme.bind(this);
    }
  
    render () {
        return (
            <div>
                <WaveSelector wave={this.state.wave} />
                <MouthBox viseme={this.state.viseme} />
                <PhonemeEditor wave={this.state.wave} onSetViseme={this.onSetViseme} />
            </div>
        );
    }
    
    onSetViseme(viseme) {
        this.setState({
            viseme: viseme
        });
    }
}

render(<App/>, document.getElementById('app'));
