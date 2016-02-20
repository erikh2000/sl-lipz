import React from 'react';
import VisemeUtil from './VisemeUtil.js'

class VisemeBox extends React.Component {
    
    constructor(props) {
        super(props);
        this._onPreviewClick = this._onPreviewClick.bind(this);
        this.visemeUtil = new VisemeUtil();
    }

    render() {

        //TODO--make viseme type change set the viseme type.
        return (
            <div className="visemeBox formGroup">
                <label className="leftLabel" forName="visemeType">Viseme type:</label>
                <select className="visemeType" name="visemeType">
                    <option value="blair">Blair</option>
                    <option value="toonboom">Toon Boom</option>
                    <option value="rms">RMS</option>
                </select>
                <button className="previewButton" onClick={ this._onPreviewClick }>Preview Animation</button>
                <button className="downloadLipz" onClick={ this._onDownloadLipz }>Download .Lipz</button>
            </div>
        );
    }
    
    _onPreviewClick() {
        var that = this,
            frameVisemes = this.visemeUtil.createFrameVisemesForWave('toonboom', this.props.wave, this.props.phonemes);
        
        this.props.wave.play();
        
        function onUpdateMouth() {
            var frameNo = that.props.wave.getPlayFrameNo(), viseme;
            if (frameNo < frameVisemes.length) {
                viseme = frameVisemes[frameNo];
            } else {
                viseme = null;
            }
            that.props.onSetViseme(viseme);
            if (that.props.wave.getIsPlaying()) {
                setTimeout(onUpdateMouth, 10);
            }
        }
        setTimeout(onUpdateMouth, 10);
    }
    
    _onDownloadLipz() {
        //TODO
    }
}

export default VisemeBox;