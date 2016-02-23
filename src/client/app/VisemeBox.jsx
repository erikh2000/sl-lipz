import React from 'react';
import VisemeUtil from './VisemeUtil.js'

class VisemeBox extends React.Component {
    
    constructor(props) {
        super(props);
        this._onPreviewClick = this._onPreviewClick.bind(this);
        this._onVisemeTypeChange = this._onVisemeTypeChange.bind(this);
        this.visemeUtil = new VisemeUtil();
    }

    render() {
        return (
            <div className="visemeBox formGroup">
                <label className="leftLabel" forName="visemeType">Viseme type:</label>
                <select className="visemeType" name="visemeType" value={ this.props.visemeType } onChange={ this._onVisemeTypeChange } >
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
            frameVisemes = this.visemeUtil.createFrameVisemesForWave(this.props.visemeType, this.props.wave, this.props.phonemes);
        console.log("visemes:" + frameVisemes.join(""));
        
        this.props.wave.play();
        setTimeout(onUpdateMouth, 10);
        
        function onUpdateMouth() {
            //Close mouth and stop calling back this function if wave is done playing.
            if (!that.props.wave.getIsPlaying()) {
                that.props.setParentViseme("-");
                return;
            }
            
            //Get viseme for currently playing frame and update mouth.
            var frameNo = that.props.wave.getPlayFrameNo(), viseme;
            if (frameNo < frameVisemes.length) {
                viseme = frameVisemes[frameNo];
            } else {
                viseme = "-";
            }
            that.props.setParentViseme(viseme);
            
            //Call this function again in a bit.
            setTimeout(onUpdateMouth, 10);
        }
    }
    
    _onDownloadLipz() {
        //TODO
    }
    
    _onVisemeTypeChange(e) {
        this.props.setParentVisemeType(e.target.value);
    }
}

export default VisemeBox;