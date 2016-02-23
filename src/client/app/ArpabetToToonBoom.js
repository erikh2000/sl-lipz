class ArpabetToToonBoom {
    constructor() {
        this._map = {
            '-'     : '-',
            'aa'    : 'C',
            'ae'    : 'C',
            'ah'    : 'C',
            'ao'    : 'C',
            'aw'    : 'C',
            'ax'    : 'C',
            'ay'    : 'D',
            'b'     : 'A',
            'ch'    : 'B',
            'd'     : 'B',
            'dx'    : 'B',
            'dh'    : 'B',
            'eh'    : 'C',
            'em'    : 'C',
            'el'    : 'C',
            'en'    : 'C',
            'eng'   : 'C',
            'er'    : 'C',
            'ey'    : 'D',
            'f'     : 'G',
            'g'     : 'B',
            'hh'    : 'B',
            'ih'    : 'C',
            'iy'    : 'C',
            'jh'    : 'B',
            'k'     : 'B',
            'l'     : 'B',
            'm'     : 'A',
            'n'     : 'B',
            'ng'    : 'B',
            'nx'    : 'B',
            'ow'    : 'E',
            'oy'    : 'E',
            'p'     : 'A',
            'q'     : 'F',
            'r'     : 'B',
            's'     : 'B',
            'sh'    : 'B',
            't'     : 'B',
            'th'    : 'B',
            'uh'    : 'C',
            'uw'    : 'C',
            'v'     : 'G',
            'w'     : 'F',
            'y'     : 'B',
            'z'     : 'B',
            'zh'    : 'B'
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

export default ArpabetToToonBoom;