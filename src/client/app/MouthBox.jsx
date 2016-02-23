import React from 'react';

class MouthBox extends React.Component {
    
    constructor(props) {
        super(props);
    }

    render() {
        var visemeClass = "viseme " + this._getVisemeClass(this.props.visemeType, this.props.viseme);
        return (
            <div className="mouthBox">
                <div className={ visemeClass } />
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
}



export default MouthBox;