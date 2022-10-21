import React, { useState, useEffect, useRef } from "react";
import * as Sentry from "@sentry/react";
import ReactGA from "react-ga";
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
let likeCount = 0;

const Video = (props) => {
    // const token = getCookie("token");
    // const [openModal, setOpenModal] = useState(false);

    // let [isLoading, setIsLoading] = useState(true);

    const videoRef = useRef(null);
    const videoControllerRef = useRef(null);
    const controlsRef = useRef(null);

    const { cardId, scrapHandler, isScrapped } = props;
    // const navigate = useNavigate();
    const [video, setVideo] = useState("");
    const [timeDisplayFormat, setTimeDisplayFormat] = useState("normal");
    const [likes, setLikes] = useState({ likeTime: [], like: [] });

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

    useEffect(() => {
        const getDetail = async () => {
            try {
                // const { data } = await feedbackApis.getDetail(cardId);
                // setVideo(data.interview.video);
            } catch (err) {
                Sentry.captureException(`Get video  : ${err}`);
                // navigate("/notFound");
            }
        };
        getDetail();
        // const timeout = setTimeout(() => setIsLoading(false), 400);
        // return () => clearTimeout(timeout);
    },
        //  [cardId, navigate]
    );

    useEffect(() => {
        const getHighlight = async () => {
            // const { data } = await highlightApis.getHighlight(cardId);

            // const filteredLike = [data.topOne, data.topTwo, data.topThree]
            // .filter((time) => time >= 0)
            // .map((item) => (item === 0 ? 3 : item));

            const newLike = [];
            // filteredLike.map((time) =>
            // newLike.push({
            // time,
            // display: format(time),
            // })
            // );
            setLikes((prev) => ({
                likeTime: newLike,
                like: [...prev.like, new Date().getTime()],
            }));
        };
        try {
            getHighlight();
        } catch (err) {
            Sentry.captureException(`Get highlight : ${err}`);
        }
    }, [cardId]);

    const addLikeHandler = () => {
        // if (!token) {
        //     alert("로그인이 필요한 기능입니다. ");
        //     return;
        // }
        likeCount++;
        setLikes((prev) => ({
            likeTime: [...prev.likeTime],
            like: [...prev.like, new Date().getTime()],
        }));
    };

    useEffect(() => {
        const intervalPost = setInterval(async () => {
            if (likeCount === 0) {
                return;
            }
            let currentTime = Math.floor(videoRef.current.getCurrentTime());
            const likeData = {
                interviewId: cardId,
                time: currentTime,
                count: likeCount,
            };

            try {
                // const { data } = await highlightApis.addHighlight(likeData);

                // const filteredLike = [data.topOne, data.topTwo, data.topThree]
                // .filter((time) => time >= 0)
                // .map((time) => (time === 0 ? 2 : time));

                const newLike = [];
                // filteredLike.map((time) =>
                //     newLike.push({
                //         time,
                //         display: format(time),
                //     })
                // );

                setLikes((prev) => ({
                    likeTime: newLike,
                    like: [...prev.like, new Date().getTime()],
                }));

                likeCount = 0;
                ReactGA.event({
                    category: "Highlight",
                    action: "Event addHighlight api",
                });
            } catch (err) {
                Sentry.captureException(`Add highlight : ${err}`);
            }
        }, 6000);

        return () => clearInterval(intervalPost);
    },
        // [cardId, token]
    );

    const cleanLike = useRef((id) => {
        setLikes((currentLikes) => ({
            likeTime: [...currentLikes.likeTime],
            like: currentLikes.like.filter((like) => like !== id),
        }));
    });
    const playPauseHandler = () => {
        setState({ ...state, playing: !state.playing });
    };

    const rewindHandler = () => {
        videoRef.current.seekTo(videoRef.current.getCurrentTime() - 10);
    };

    const forwardHandler = () => {
        videoRef.current.seekTo(videoRef.current.getCurrentTime() + 10);
    };
    // const muteHandler = () => {
    //     setState({ ...state, muted: !state.muted });
    // };

    const volumeChangeHandler = (e, newValue) => {
        setState({
            ...state,
            volume: parseFloat(newValue / 100),
            muted: newValue === 0 ? true : false,
        });
    };

    // const volumeSeekUpHandler = (e, newValue) => {
    //     setState({
    //         ...state,
    //         volume: parseFloat(newValue / 100),
    //         muted: newValue === 0 ? true : false,
    //     });
    // };
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

    const mouseMoveHandler = () => {
        if (video !== null) {
            controlsRef.current.style.visibility = "visible";
            count = 0;
        }
    };

    const mouseLeaveHandler = () => {
        if (video !== null) {
            controlsRef.current.style.visibility = "hidden";
            count = 0;
        }
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

    const linkToSignInHandler = () => {
        // navigate("/signin");
    };

    const openModalHandler = () => {
        // setOpenModal(true);
    };
    return (
        <Container>
            {/* <GlobalModal
                title="알림"
                confirmText="로그인하러 가기"
                open={openModal}
                onClose={() => setOpenModal(false)}
                onConfirm={() => linkToSignInHandler()}
                isConfirm
                isIcon
                icon={<AlertIcon />}
            >
                로그인이 필요한 기능입니다.
            </GlobalModal> */}
            {/* {isLoading ? (
                <VideoBackgroud>
                    <LoadingLoader
                        text="영상을 불러오는 중입니다. "
                        noti="잠시만 기다려주세요."
                        _height="565px"
                    />
                </VideoBackgroud>
            ) : (
                <> */}
            <VideoBackgroud>
                <div
                    ref={videoControllerRef}
                    className="player-wrapper"
                // onMouseMove={mouseMoveHandler}
                // onMouseLeave={mouseLeaveHandler}
                >
                    {/* {video === null ? (
                                <img
                                    src={convertingImg}
                                    className="converting_img"
                                    alt="convertingImg"
                                ></img>
                            ) : (
                                <> */}
                    <div className="react-player">
                        <ReactPlayer
                            ref={videoRef}
                            // url={video}
                            url={"https://chinatan.smilecast.co.kr/video/us-alliance/us-alliance_master_interview.mp4"}
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
                        // onMute={muteHandler}
                        // onVolumeChange={volumeChangeHandler}
                        // onVolumeSeekUp={volumeSeekUpHandler}
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
                        openModalHandler={openModalHandler}
                    />
                    {/* <div
                                        style={{
                                            zIndex: 1000,
                                            position: "absolute",
                                            bottom: "75px",
                                            right: "10px",
                                        }}
                                    >
                                        <button
                                            className="like_btn"
                                            onClick={token ? addLikeHandler : openModalHandler}
                                        >
                                            <div className="tooltip">좋았던 순간을 클릭하세요!</div>
                                            <LikeIcon size={35} />
                                        </button>

                                        {likes.like.map((id) => (
                                            <Bubble
                                                onAnimationEnd={cleanLike.current}
                                                key={id}
                                                id={id}
                                            />
                                        ))}
                                    </div> */}
                    {/* </>
                            )} */}
                </div>
            </VideoBackgroud>
            {/* {video !== null && (
                        <HightLight>
                            <div className="highlight_bar">
                                <div className="contents_box">
                                    <div className="title">
                                        <span>
                                            하이라이트 <img src={questionMark} alt="questionMark" />
                                            <div className="tooltip_highlight">
                                                가장 좋아요를 많이 받은 TOP3 시간입니다. <br /> 클릭하면
                                                해당 시간대로 이동합니다.
                                            </div>
                                        </span>
                                        <span className="line">|</span>
                                    </div>
                                    {likes?.likeTime.length === 0 ? (
                                        <div className="noti">
                                            아직 하이라이트 시간이 없습니다. 좋아요를 눌러
                                            하이라이트를 채워주세요!
                                        </div>
                                    ) : (
                                        likes.likeTime.map((like, index) => {
                                            return (
                                                <div
                                                    className="timestamp_box"
                                                    key={index}
                                                    onClick={() => {
                                                        videoRef.current.seekTo(like.time);
                                                        controlsRef.current.style.visibility = "visible";
                                                        setTimeout(() => {
                                                            controlsRef.current.style.visibility = "hidden";
                                                        }, 1000);
                                                        ReactGA.event({
                                                            category: "Highlight",
                                                            action: "Click Highlight time",
                                                        })
                                                        ;
                                                    }}
                                                    elevation={3}
                                                >
                                                    <button>{like.display}</button>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </HightLight>
                    )} */}
            {/* </>
            )} */}
        </Container>
    );
};

const Container = styled.div`
  position: relative;
  width: 100%;
  @media screen and (min-width: 768px) {
    width:600px;
  }
`;

const VideoBackgroud = styled.div`
  width: 100%;
  .player-wrapper {
    position: relative;
    max-width: 1000px;
    width: 100%;
    margin: 0 auto;
    padding: 40px;
    background-color: black;
  }
`;

export default Video;