import React from 'react';

//TODO--add busy UI handling to avoid changing file while it uploads
class WaveSelector extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isBusy:             false,
            fileName:           null,
            durationSecs:       null,
        };
        this.onFilenameChange = this.onFilenameChange.bind(this);
        this.onChangeFile = this.onChangeFile.bind(this);
    }

    render() {
        if (!this.props.isWaveLoaded && this.props.wave.loaded) { //Parent signalled to unload the wave.
            this.props.wave.clear();
        } 
        
        if (this.props.isWaveLoaded) {
            return this.renderLoaded();
        } else {
            return this.renderNotLoaded();
        }
    }
    
    renderLoaded() {
      return (
          <div className="waveSelector formGroup">
            <div className="audioFileLabel">Audio File: { this.state.fileName } ({this.state.durationSecs } seconds)
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
                that.props.parentOnWaveLoaded(false);
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
                            isBusy: false
                        });
                        that.props.parentOnWaveLoaded(true, that.state.fileName);
                    },
                    function(e) {
                        that.setState({
                            durationSecs: null,
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
        this.props.parentOnWaveLoaded(false);
    }
}

export default WaveSelector;