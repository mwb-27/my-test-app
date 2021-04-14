import React, { Component } from 'react';
import * as io from 'socket.io';
import socketClient from 'socket.io-client';
import { Button } from 'antd';

class Live extends Component {
  constructor(props: any) {
    super(props)
  }

  fetchAB(cb: Function) {
    const socket = socketClient('http://127.0.0.1:7001');
    socket.on('connect', () => {
      console.log('connect!');
      socket.emit('chat', 'hello world!');
    });
    
    socket.on('res', msg => {
      console.log('res from server: %s!', msg);
    });
    
    socket.on('fmp4', msg => {
      console.log('fmp4 from server: %s!', msg.byteLength);
      cb(msg);
    });

    socket.emit('fmp4', 'start');
  
    socket.on('disconnect', () => {
      console.log('disconnect');
    });
  
    socket.on('error', () => {
      console.log('error');
    });
  }
  
  play() {
    try {
      const video = document.getElementById('mse-video') as HTMLVideoElement;
      // const assetURL = 'mp4/netfix/demo/frag_bunny.mp4';
      const assetURL = 'fmp4/fmp4';
      const mimeCodec = 'video/mp4; codecs="avc1.64001e, mp4a.40.2"';

      if ('MediaSource' in window && MediaSource.isTypeSupported(mimeCodec)) {
        const mediaSource = new MediaSource();
        //console.log(mediaSource.readyState); // closed
        (video).src = URL.createObjectURL(mediaSource);

        const sourceOpen = () => {
          const _buffer = [] as any;
          const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
          const loadPacket = () => {
            if (!sourceBuffer.updating) { // really, really ready
              if (_buffer.length>0) {
                  const inp = _buffer.shift(); // pop from the beginning
                  console.log('appendBuffer', inp.byteLength);
                  sourceBuffer.appendBuffer(inp);
              }
            }
          }
          sourceBuffer.addEventListener("updateend",loadPacket);
          this.fetchAB(function (buf: ArrayBuffer) {
            _buffer.push(buf);
            if (mediaSource.readyState === 'open' && sourceBuffer.updating !== true) {
              console.log('appendBuffer', buf.byteLength);
              sourceBuffer.appendBuffer(_buffer.shift());
            } else {

            }
          });
        };

        mediaSource.addEventListener('sourceopen', sourceOpen);
        mediaSource.addEventListener('error', (e) => {
          console.log('mediaSource error', e);
        })
        mediaSource.addEventListener('sourceclose', (e) => {
          console.log('mediaSource soucrceclose', e);
        })
      } else {
        console.error('Unsupported MIME type or codec: ', mimeCodec);
      }
    } catch (error) {
      console.log('mse error: ', error)
    }
  }

  // 播放完整MP4
  // fetchAB (url: string, cb: any) {
  //   console.log(url);
  //   const xhr = new XMLHttpRequest;
  //   xhr.open('get', url);
  //   xhr.responseType = 'arraybuffer';
  //   xhr.onload = function () {
  //     console.log('get data');
  //     cb(xhr.response);
  //   };
  //   xhr.send();
  // };

  // play() {
  //   try {
  //     const video = document.getElementById('mse-video') as HTMLVideoElement;
  //     // const assetURL = 'mp4/netfix/demo/frag_bunny.mp4';
  //     const assetURL = 'fmp4/fmp4';
  //     const mimeCodec = 'video/mp4; codecs="avc1.64001e, mp4a.40.2"';

  //     if ('MediaSource' in window && MediaSource.isTypeSupported(mimeCodec)) {
  //       const mediaSource = new MediaSource();
  //       //console.log(mediaSource.readyState); // closed
  //       (video).src = URL.createObjectURL(mediaSource);

  //       const sourceOpen = () => {
  //         const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
  //         this.fetchAB(assetURL, function (buf: ArrayBuffer) {
  //           sourceBuffer.addEventListener('updateend',  () => {
  //             mediaSource.endOfStream();
  //             console.log(mediaSource.readyState); // ended
  //             video.play();
  //           });
  //           sourceBuffer.appendBuffer(buf);
  //         });
  //       };

  //       mediaSource.addEventListener('sourceopen', sourceOpen);
  //       mediaSource.addEventListener('error', (e) => {
  //         console.log('mediaSource error', e);
  //       })
  //       mediaSource.addEventListener('sourceclose', (e) => {
  //         console.log('mediaSource soucrceclose', e);
  //       })
  //     } else {
  //       console.error('Unsupported MIME type or codec: ', mimeCodec);
  //     }
  //   } catch (error) {
  //     console.log('mse error: ', error)
  //   }
  // }

  render() {
    return (
      <div>
        <Button onClick={() => {
          this.play()
        }} type="primary">Primary Button</Button>
        <video id="mse-video" src="" controls autoPlay></video>
      </div>
    )
  }
};

export default Live;