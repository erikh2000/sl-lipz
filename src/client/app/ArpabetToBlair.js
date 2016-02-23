class ArpabetToBlair {
    constructor() {
        this._map = {
            '-'     : '-',
            'aa'    : 'E',
            'ae'    : 'E',
            'ah'    : 'E',
            'ao'    : 'E',
            'aw'    : 'E',
            'ax'    : 'E',
            'ay'    : 'A',
            'b'     : 'M',
            'ch'    : 'S',
            'd'     : 'S',
            'dx'    : 'S',
            'dh'    : 'S',
            'eh'    : 'E',
            'em'    : 'E',
            'el'    : 'E',
            'en'    : 'E',
            'eng'   : 'E',
            'er'    : 'E',
            'ey'    : 'A',
            'f'     : 'F',
            'g'     : 'S',
            'hh'    : 'S',
            'ih'    : 'S',
            'iy'    : 'A',
            'jh'    : 'S',
            'k'     : 'S',
            'l'     : 'L',
            'm'     : 'M',
            'n'     : 'S',
            'ng'    : 'S',
            'nx'    : 'S',
            'ow'    : 'O',
            'oy'    : 'O',
            'p'     : 'M',
            'q'     : 'O',
            'r'     : 'S',
            's'     : 'S',
            'sh'    : 'S',
            't'     : 'S',
            'th'    : 'S',
            'uh'    : 'E',
            'uw'    : 'U',
            'v'     : 'F',
            'w'     : 'S',
            'y'     : 'S',
            'z'     : 'S',
            'zh'    : 'S'
        }
    }
    getViseme(phoneme) {
        var ret = this._map[phoneme];
        if (!ret) {
            console.error("No viseme found for \"" + phoneme + "\" phoneme.");
            return '-';
        } else {
            return ret;
        }
    }
}

export default ArpabetToBlair;