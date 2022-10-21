import React, { useState, useRef } from "react";
import ReactPlayer from "react-player";
import screenfull from "screenfull";
import VideoControl from "./VideoControl.jsx";
import styled from "styled-components";

function format(seconds) {
    if (isNaN(seconds)) {
        return `00:00`;
    }
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = pad(date.getUTCSeconds());
    if (hh) {
        return `${hh}:${pad(mm)}:${ss}`;
    }
    return `${mm}:${ss}`;
}

function pad(string) {
    return ("0" + string).slice(-2);
}

let count = 0;

const Video = (props) => {

    const videoRef = useRef(null);
    const videoControllerRef = useRef(null);
    const controlsRef = useRef(null);

    const { cardId, scrapHandler, isScrapped } = props;
    const [timeDisplayFormat, setTimeDisplayFormat] = useState("normal");

    const [state, setState] = useState({
        playing: true,
        muted: false,
        controls: false,
        volume: 0.5,
        playbackRate: 1.0,
        played: 0,
        seeking: false,
        duration: 0,
    });

    const { playing, muted, volume, playbackRate, played } = state;

    const playPauseHandler = () => {
        setState({ ...state, playing: !state.playing });
    };

    const rewindHandler = () => {
        videoRef.current.seekTo(videoRef.current.getCurrentTime() - 10);
    };

    const forwardHandler = () => {
        videoRef.current.seekTo(videoRef.current.getCurrentTime() + 10);
    };

    const playBackChangeHandler = (rate) => {
        setState({
            ...state,
            playbackRate: rate,
        });
    };

    const toggleFullScreenHandler = () => {
        screenfull.toggle(videoControllerRef.current);
    };

    const progressHandler = (changeState) => {
        if (count > 10) {
            controlsRef.current.style.visibility = "hidden";
            count = 0;
        }
        if (controlsRef.current.style.visibility === "visible") {
            count += 1;
        }
        if (!state.seeking) {
            setState({ ...state, ...changeState });
        }
    };

    const onSeekChangeHandler = (e, newValue) => {
        setState({ ...state, played: parseFloat(newValue / 100) });
    };

    const seekMouseDownHandler = (e) => {
        setState({ ...state, seeking: true });
    };

    const seekMouseUpHandler = (e, newValue) => {
        setState({ ...state, seeking: false });
        videoRef.current.seekTo(newValue / 100, "fraction");
    };

    const displayFormatHandler = () => {
        setTimeDisplayFormat(
            timeDisplayFormat === "normal" ? "remaining" : "normal"
        );
    };

    const currentTime =
        videoRef && videoRef.current ? videoRef.current.getCurrentTime() : "00:00";
    const duration =
        videoRef && videoRef.current ? videoRef.current.getDuration() : "00:00";

    const elapsedTime =
        timeDisplayFormat === "normal"
            ? format(currentTime)
            : `-${format(duration - currentTime)}`;

    const totalDuration = format(duration);

    return (
        <Container>
            <VideoBackgroud>
                <div
                    ref={videoControllerRef}
                    className="player-wrapper"
                >
                    <div className="react-player">
                        <ReactPlayer
                            ref={videoRef}
                            url={" https://chinatan.smilecast.co.kr/video/us-alliance/us-alliance_master_interview.mp4"}
                            playing={playing}
                            controls={false}
                            muted={muted}
                            volume={volume}
                            playbackRate={playbackRate}
                            onProgress={progressHandler}
                            width="100%"
                            height="100%"
                        />
                    </div>
                    <VideoControl
                        ref={controlsRef}
                        onPlayPause={playPauseHandler}
                        playing={playing}
                        onRewind={rewindHandler}
                        onForward={forwardHandler}
                        onSeekMouseDown={seekMouseDownHandler}
                        onSeekMouseUp={seekMouseUpHandler}
                        muted={muted}
                        volume={volume}
                        playbackRate={playbackRate}
                        onPlaybackRateChange={playBackChangeHandler}
                        onToggleFullScreen={toggleFullScreenHandler}
                        played={played}
                        onSeek={onSeekChangeHandler}
                        elapsedTime={elapsedTime}
                        totalDuration={totalDuration}
                        onChangeDisplayFormat={displayFormatHandler}
                        cardId={cardId}
                        scrapHandler={scrapHandler}
                        isScrapped={isScrapped}
                    />
                </div>
            </VideoBackgroud>
        </Container>
    );
};

const Container = styled.div`
  position: relative;
  width: 100%;
`;

const VideoBackgroud = styled.div`
  width: 100%;
  .player-wrapper {
    position: relative;
    max-width: 1000px;
    width: 100%;
    padding: 40px;
    box-sizing: border-box;
    background-color: black;
  }
`;

export default Video;