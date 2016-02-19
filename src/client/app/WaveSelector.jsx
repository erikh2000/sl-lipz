import React from 'react';

class WaveSelector extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoaded:           false,
            isBusy:             false,
            fileName:           null,
            currentFrameNo:     0
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
          <div className="waveSelector">
            <p>File: { this.state.fileName }</p>
            <button id="changeFile" onClick={ this.onChangeFile }>Change File</button>
          </div>
      );  
    }
    
    renderNotLoaded() {
      return (
          <div className="waveSelector">
                <input type="file" id="waveFile" size="50" onChange={ this.onFilenameChange } />
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
                        that.setState({
                            isLoaded: true,
                            isBusy: false
                        });
                    },
                    function(e) {
                        that.setState({
                            isLoaded: false,
                            isBusy: false
                        });
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
    }
}

export default WaveSelector;