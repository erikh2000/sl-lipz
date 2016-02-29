import React from 'react';

class WaveSelector extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoaded:           false,
            isBusy:             false,
            fileName:           null,
            durationSecs:       null,
        };
        this.onFilenameChange = this.onFilenameChange.bind(this);
        this.onChangeFile = this.onChangeFile.bind(this);
    }

    render() {
        if (this.state.isLoaded) {
            return this.renderLoaded();
        } else {
            return this.renderNotLoaded();
        }
    }
    
    renderLoaded() {
      return (
          <div className="waveSelector formGroup">
            <div className="audioFileLabel">Audio File: { this.state.fileName } ( {this.state.durationSecs } seconds)
                <button id="changeFile" className="fa fa-pencil" onClick={ this.onChangeFile } />
            </div>
          </div>
      );  
    }
    
    renderNotLoaded() {
      return (
          <div className="waveSelector formGroup">
                <div className="audioFileLabel">Audio File: <input type="file" id="waveFile" size="50" onChange={ this.onFilenameChange } /></div>
          </div>
      );  
    }
    
    onFilenameChange() {
        var x = document.getElementById("waveFile"), that = this;
        if ('files' in x) {
            if (x.files.length == 0) {
                this.setState({isLoaded: false});
            } else {
                this.setState({
                    isBusy: true,
                    fileName: x.files[0].name
                });
                
                this.props.wave.load(x.files[0]).then(
                    function() {
                        var secs = Math.ceil(that.props.wave.getDuration());
                        that.setState({
                            durationSecs: secs,
                            isLoaded: true,
                            isBusy: false
                        });
                        that.props.parentOnWaveLoaded(true);
                    },
                    function(e) {
                        that.setState({
                            durationSecs: null,
                            isLoaded: false,
                            isBusy: false
                        });
                        that.props.parentOnWaveLoaded(false);
                    }
                );
            }
        }
    }

    onChangeFile() {
        this.props.wave.clear();
        this.setState({
            isLoaded: false
        });
        that.props.parentOnWaveLoaded(true);
    }
}

export default WaveSelector;