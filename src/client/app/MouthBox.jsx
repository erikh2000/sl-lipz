import React from 'react';

class MouthBox extends React.Component {
    
    constructor(props) {
        super(props);
    }

    render() {
        var visemeClass = "viseme " + this._getVisemeClass(this.props.viseme);
        return (
            <div className="mouthBox">
                <div className={ visemeClass } />
            </div>
        );
    }
    
    _getVisemeClass(viseme) {
    if (!viseme || "" === viseme) {
        return "viseme-default"
    } else {
        return "viseme-" + viseme.trim();
    }
}
}



export default MouthBox;