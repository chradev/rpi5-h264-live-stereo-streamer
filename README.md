# Motivation for extension

The parent project is an excellent solution for near-real-time video capturing, encoding and streaming. Extending it to reach the robot's stereo vision requirements is a challenge that could be solved thanks to advances in embedded and mobile devices supporting video processing with hardware acceleration.

The main goals of extending the project are:
  * The new PRi 5 board is much more powerful and supports two CSI cameras;
  * There is a new set of feature-rich utilities (rpicam-apps) supporting the video processing;
  * Extremely low latency is a main reason to choose the project for the robot stereo vision.

# Basic changes

In server-rpi.js:
```Javascript
const silence = new WebStreamerServer( server, 
    // Options can be changed
    {cam: camNr, fps: 30, width: 960, height: 1080}
);
```

In raspivid.js:
```Javascript
    var streamer = spawn('rpicam-vid', [        // new rpicam-apps utility
        '--camera', this.options.cam,           // requred to select camera
        '--framerate', this.options.fps,        // optional
        '--width', this.options.width,          // optional
        '--height', this.options.height,        // optional 
        '--vflip', '--hflip',                   // optional
        '--inline',                             // optional
        '--profile', 'baseline',                // requred by Broadway decoder
        '--libav-format', 'mjpeg',              // required for streaming
        '--libav-video-codec', 'h264_v4l2m2m',  // by default
        '-n', '-t', '0', '-o', '-'              // required for streaming
    ]);
```

In index.html:
```HTML
  <!-- provide WSAvcPlayer -->
    <script type="text/javascript" src="http-live-player.js">;</script>
    <script type="text/javascript">
        var canvas0 = document.getElementById("canvas0");
        var canvas1 = document.getElementById("canvas1");
        // Create h264 player
        var uri0 = "ws://" + document.location.hostname + ":8080";
        var uri1 = "ws://" + document.location.hostname + ":8081";
        var wsavc0 = new WSAvcPlayer(canvas0, "webgl", 1, 35);
        var wsavc1 = new WSAvcPlayer(canvas1, "webgl", 2, 35);
        wsavc0.connect(uri0);
        wsavc1.connect(uri1);
        //expose instance for button callbacks
        window.wsavc0 = wsavc0;
        window.wsavc1 = wsavc1;
        wsavc0.playStream();
        wsavc1.playStream();
    </script>
```


# Basic changes usage

 * Start camera 0 on port 8080: node server-rpi.js 0 8080
 * Start camera 1 on port 8081: node server-rpi.js 0 8081
 * Watch stereo h264 video on: http://192.168.1.111:8080/

For watching video as stereo use VR like glasses with dual optical lens and smartphone running browser on a full screen.



# Motivation of original project

This is a very simple h264 video player (that can run on live stream) for your browser.
You might use this with raspicam raw h264 stream.
This is a player around [Broadway](https://github.com/mbebenita/Broadway) Decoder, with very simple API.
NAL unit (h264 frames) are split on the server side, transported using websocket, and sent to the decoded (with frame dropping, if necessary)

[![Version](https://img.shields.io/npm/v/h264-live-player.svg)](https://www.npmjs.com/package/h264-live-player)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](http://opensource.org/licenses/MIT)


# History
* I was targetting a real-time camera video feedback (no audio/surveillance cam) in the browser
* There is no solution for "real time" mp4 video creation / playback (ffmpeg, mp4box.js, mp4parser - _boxing_ _takes_ _time_)
* Media Source Extension is a dead end (mp4 boxing is far too hard to re-create on the client side)
* [Broadway](https://github.com/mbebenita/Broadway) provide the crazy emscripten/asm build of a h264 decoder accelerated by webGL canvas
* Here is all the glue we need, enjoy ;-)


# Installation/demo
```
git clone git@github.com:131/h264-live-player.git player
cd player
npm install

node server-rpi.js    # run on a rpi for a webcam demo
node server-static.js # for sample video (static) file delivery
node server-tcp.js    # for a remote tcp (rpi video feed) sample
node server-ffmpeg    # usefull on win32 to debug the live feed (use ffmpeg & your directshow device / webcam) 

# browse to http://127.0.0.1:8080/ for a demo player

```

# Recommendations
* Broadway h264 Decoder can only work with **h264 baseline profile**
* [**Use a SANE birate**](https://www.dr-lex.be/info-stuff/videocalc.html)
* Browserify FTW
* Once you understand how to integrate the server-side, feel free to use [h264-live-player](https://www.npmjs.com/package/h264-live-player) npm package in your client side app (see vendor/)
* Use [uws](https://github.com/uWebSockets/uWebSockets) (instead of ws) as websocket server


# Credits
* [131](mailto:131.js@cloudyks.org)
* [Broadway](https://github.com/mbebenita/Broadway)
* [urbenlegend/WebStreamer](https://github.com/urbenlegend/WebStreamer)


# Keywords / shout box
raspberry, mp4box, h264, nal, raspivid, mse, media source extension, iso, raspicam, bitrate, realtime, video, mp4, ffmpeg, websocket, ws, socket.io "Let's have a beer and talk in Paris"
