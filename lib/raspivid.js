"use strict";

const util      = require('util');
const spawn     = require('child_process').spawn;
const merge     = require('mout/object/merge');

const Server    = require('./_server');

class RpiServer extends Server {

  constructor(server, opts) {
    super(server, merge({
      cam : 0,
      fps : 12,
    }, opts));
  }

  get_feed() {
    var msk = "rpicam-vid --camera %d --framerate %d --width %d --height %d --vflip --hflip --inline --profile baseline --libav-format mjpeg --libav-video-codec h264_v4l2m2m -n -t 0 -o -";
    var cmd = util.format(msk, this.options.cam, this.options.fps, this.options.width, this.options.height);
    console.log(cmd);

    var streamer = spawn('rpicam-vid', [
        '--camera', this.options.cam, 
        '--framerate', this.options.fps, 
        '--width', this.options.width, 
        '--height', this.options.height, 
        '--vflip', '--hflip', 
        '--inline', 
        '--profile', 'baseline', 
        '--libav-format', 'mjpeg', 
        '--libav-video-codec', 'h264_v4l2m2m', 
        '-n', '-t', '0', '-o', '-'
    ]);
    streamer.on("exit", function(code){
      console.log("Failure", code);
    });

    return streamer.stdout;
  }

};

module.exports = RpiServer;

