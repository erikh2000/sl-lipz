class Wave {

    constructor(frameRate = 24, framePlayLength = .5) {
        //Animation frame rate that is used to divide audio file into segments of audio played per frame.
        this.frameRate = frameRate;          
        
        //Length of audio in seconds to play for each frame. Typically longer than the frame's audio to give a better preview.
        this.framePlayLength = framePlayLength; 
        
        this.completeBuffer = null; //Buffer containing complete wave.
        this.frameBuffers = [];     //Each element contains an audio buffer to play for one frame.
        this.samplesPerFrame = 0;   //Number of samples contained in one frame for a single channel (not doubled for stereo)
        this.framePlaySamples = 0;  //Number of samples to play for one frame. Based on framePlayLength and may excheed samplesPerFrame.
        this.isLoaded = false;      //Are the frame buffers loaded and ready to play?
        this.bufferSource = null;   //Buffer source used for playback.
        this.isPlaying = false;
        this.playStartTime = 0;
        
        this.audioContext = new AudioContext(); //Used for playing frames.
    }
  
    load(file) {
        var that = this;
        return new Promise(function(resolve, reject) {
            that.isLoaded = false;
            if (!file) {
                reject(Error("File param invalid."));
            }
            var fr = new FileReader();
            fr.onload = function(fileData) {
                that.audioContext.decodeAudioData(fileData.target.result, function(audioBuffer) {
                    that.completeBuffer = audioBuffer;
                    that._loadAudioSamplesIntoFrameBuffers(audioBuffer);
                    that.isLoaded = true;
                    resolve();
                }, function(e) {
                    reject(Error("Error decoding audio data" + e.err));
                });
            };
            fr.onerror = function() {
                reject(Error("Could not read data from file."));
            }
            fr.readAsArrayBuffer(file);
        });
    }
    
    clear() {
        this.frameBuffers = [];
        this.isLoaded = false;
    }

    isLoaded() {
        return this.isLoaded;
    }

    getFrameCount() {
        return (this.isLoaded) ? this.frameBuffers.length : 0;
    }
    
    getDuration() {
        return (this.isLoaded) ? this.completeBuffer.duration : 0;
    }
    
    getIsPlaying() {
        return this.isPlaying;
    }
    
    getPlayPosition() {
        if (!this.isPlaying) {
            return 0;
        }
        
        return (Date.now() - this.playStartTime) / 1000;
    }
    
    getPlayFrameNo() {
        var pos = this.getPlayPosition(), duration = this.getDuration();
        if (pos === 0 || duration === 0) {
            return 0;
        }
        return Math.ceil((pos / duration) * this.frameBuffers.length);
    }
    
    getFrameRms(frameNo) {
        if (frameNo >= this.frameBuffers.length) {
            return 0;
        }
        return this.frameBuffers[frameNo].rms;
    }

    playFrame(frameNo) {
        if (!this.isLoaded) {
            console.error("Can't play frame because wave not loaded.");
            return;
        }
        if (frameNo < 0 || frameNo >= this.frameBuffers.length) {
            console.error("Can't play frame #" + frameNo + " because OOB.");
            return;
        }
        
        if (this.bufferSource) {
            this.bufferSource.stop();
        }
        
        this._play(this.frameBuffers[frameNo]);
    }
    
    play() {
        if (!this.isLoaded) {
            console.error("Can't play frame because wave not loaded.");
            return;
        }
        
        if (this.bufferSource) {
            this.bufferSource.stop();
        }
        
        this._play(this.completeBuffer);
    }
    
    /* Private methods */
    
    _play(audioBuffer) {
        var that = this;
        
        if (this.bufferSource) {
            this.bufferSource.stop();
        }
        
        this.bufferSource = this.audioContext.createBufferSource();
        this.bufferSource.buffer = audioBuffer;
        this.bufferSource.connect(this.audioContext.destination);
        this.bufferSource.onended = function() {
            that.isPlaying = false;
        }
        this.bufferSource.start(0);
        
        this.isPlaying = true;
        this.playStartTime = Date.now();
    }

    _loadAudioSamplesIntoFrameBuffers(buffer) {            
        var startPos, endPos, frameBuffer;
        
        this.samplesPerFrame = Math.ceil(buffer.sampleRate / this.frameRate);
        
        //Calc number of samples to put in each frame buffer.
        this.framePlaySamples = buffer.sampleRate * this.framePlayLength;
        if (this.framePlaySamples < this.samplesPerFrame) {
            this.framePlaySamples = this.samplesPerFrame;
        }
        
        //Copy PCM data for each frame into a separate buffer.
        startPos = 0;
        this.frameBuffers = [];
        while (startPos < buffer.length) {
            endPos = startPos + this.framePlaySamples;
            frameBuffer = this._createBufferFromAudioSection(startPos, endPos, buffer);
            this.frameBuffers.push(frameBuffer);
            startPos += this.samplesPerFrame;
        }
    }
    
    _createBufferFromAudioSection(startRead, endRead, buffer) {
        var writeSize = endRead - startRead,
            writeBuffer = this.audioContext.createBuffer(1, writeSize, buffer.sampleRate),
            write = writeBuffer.getChannelData(0),
            read = buffer.getChannelData(0), //TODO--mix multi-channel into one channel. This only gets first channel.
            i, rmsTotal = 0;
        
        for (i = 0; i < writeSize; ++i) {
            if (startRead + i >= buffer.length) {
                write[i] = 0;
            } else {
                write[i] = read[startRead + i];
            }
            
            if (i < this.samplesPerFrame && startRead + i < buffer.length) {
                rmsTotal += (write[i] * write[i]);
            }
        }
        
        writeBuffer.rms = Math.sqrt(rmsTotal);
        
        return writeBuffer;
    }
}

export default Wave;