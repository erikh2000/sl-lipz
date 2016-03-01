import React from 'react';

class MouthBox extends React.Component {
    
    constructor(props) {
        super(props);
        this._onMouthBoxMouseOver = this._onMouthBoxMouseOver.bind(this);
        this._onPlayClick = this._onPlayClick.bind(this);
    }

    render() {
        var visemeClass = "viseme " + this._getVisemeClass(this.props.visemeType, this.props.viseme),
            playButtonClass = "hidden";
        if (!this.props.isWaveLoaded) visemeClass += " grayscale";
        return (
            <div className="mouthBox" onMouseOver={ this._onMouthBoxMouseOver } onMouseOut={ this._onMouthBoxMouseOut } >
                <div className={ visemeClass } />
                <div id="thePlayButton" className={ playButtonClass } onClick={ this._onPlayClick } />
                <div className="preloadImages hidden">
                    <div className="viseme-toonboom-default" />
                    <div className="viseme-toonboom-a" />
                    <div className="viseme-toonboom-b" />
                    <div className="viseme-toonboom-c" />
                    <div className="viseme-toonboom-d" />
                    <div className="viseme-toonboom-e" />
                    <div className="viseme-toonboom-f" />
                    <div className="viseme-toonboom-g" />
                    <div className="viseme-blair-default" />
                    <div className="viseme-blair-m" />
                    <div className="viseme-blair-s" />
                    <div className="viseme-blair-e" />
                    <div className="viseme-blair-a" />
                    <div className="viseme-blair-o" />
                    <div className="viseme-blair-w" />
                    <div className="viseme-blair-f" />
                    <div className="viseme-blair-u" />
                    <div className="viseme-blair-l" />
                    <div className="viseme-rms-default" />
                    <div className="viseme-rms-0" />
                    <div className="viseme-rms-1" />
                    <div className="viseme-rms-2" />
                    <div className="viseme-rms-3" />
                    <div className="viseme-rms-4" />
                    <div className="viseme-rms-5" />
                    <div className="viseme-rms-6" />
                    <div className="viseme-rms-7" />
                    <div className="viseme-rms-8" />
                    <div className="viseme-rms-9" />
                </div>
            </div>
        );
    }
    
    _getVisemeClass(visemeType, viseme) {
        if (!viseme || !visemeType || "" === viseme || "-" === viseme) {
            return "viseme-default"
        } else {
            return "viseme-" + visemeType + '-' + viseme.toLowerCase();
        }
    }
    
    _onMouthBoxMouseOver() {
        if (this.props.isWaveLoaded) {
            var el = document.getElementById("thePlayButton");
            el.className = "playButton fa fa-youtube-play";
        }
    }
    
    _onMouthBoxMouseOut() {
        var el = document.getElementById("thePlayButton");
        el.className = "hidden";
    }
    
    _onPlayClick(event) {
        this.props.parentPlay();
    }
}



export default MouthBox;