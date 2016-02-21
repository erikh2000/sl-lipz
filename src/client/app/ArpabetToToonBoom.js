class ArpabetToToonBoom {
    constructor() {
        this._map = {
            '-'     : '-',
            'aa'    : 'c',
            'ae'    : 'c',
            'ah'    : 'c',
            'ao'    : 'c',
            'aw'    : 'c',
            'ax'    : 'f',
            'ay'    : 'd',
            'b'     : 'a',
            'ch'    : 'b',
            'd'     : 'b',
            'dx'    : 'b',
            'dh'    : 'b',
            'eh'    : 'c',
            'em'    : 'c',
            'el'    : 'f',
            'en'    : 'f',
            'eng'   : 'd',
            'er'    : 'c',
            'ey'    : 'd',
            'f'     : 'g',
            'g'     : 'b',
            'hh'    : 'b',
            'ih'    : 'b',
            'iy'    : 'd',
            'jh'    : 'b',
            'k'     : 'b',
            'l'     : 'b',
            'm'     : 'a',
            'n'     : 'b',
            'ng'    : 'b',
            'nx'    : 'b',
            'ow'    : 'e',
            'oy'    : 'e',
            'p'     : 'a',
            'q'     : 'e',
            'r'     : 'b',
            's'     : 'b',
            'sh'    : 'b',
            't'     : 'b',
            'th'    : 'b',
            'uh'    : 'f',
            'uw'    : 'f',
            'v'     : 'g',
            'w'     : 'b',
            'y'     : 'b',
            'z'     : 'b',
            'zh'    : 'b'
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