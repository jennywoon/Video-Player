import React, { forwardRef, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Slider from "@mui/material/Slider";
import Popover from "@mui/material/Popover";
import { BiFullscreen } from "react-icons/bi";
import RotateRightIcon from '@mui/icons-material/RotateRight';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';

const PrettoSlider = styled(Slider)({});

const VideoControl = forwardRef(
    (
        {
            onPlayPause,
            playing,
            onRewind,
            onForward,
            playbackRate,
            onPlaybackRateChange,
            onToggleFullScreen,
            played,
            onSeek,
            onSeekMouseDown,
            onSeekMouseUp,
            elapsedTime,
            totalDuration,
        },
        ref
    ) => {
        const [anchorEl, setAnchorEl] = useState(null);
        const [open, setOpen] = useState(false);

        const handlePopover = (event) => {
            setAnchorEl(event.currentTarget);
            setOpen(true);
        };

        const handleClose = () => {
            setAnchorEl(null);
            setOpen(false);
        };

        const valueLabelFormat = (value) => {
            let _elapsedTime = value;
            _elapsedTime = elapsedTime;
            return _elapsedTime;
        };

        return (
            <Container className="controls_wrapper">
                <div ref={ref} className="control_box">
                    <div className="header">
                        <div className="logo">
                            VOD
                        </div>
                    </div>
                    <div className="body">
                        <div onClick={onRewind}>
                            <RotateLeftIcon
                                sx={{ color: "white", fontSize: 60 }}
                            />
                        </div>
                        <div onClick={onPlayPause}>
                            {!playing ? (
                                <PlayCircleFilledWhiteIcon className="play_icon" onClick={onPlayPause}
                                    sx={{ color: "white", fontSize: 90 }}
                                />
                            ) : (
                                <PauseCircleIcon className="play_icon" onClick={onPlayPause}
                                    sx={{ color: "white", fontSize: 90 }}
                                />
                            )}
                        </div>
                        <div onClick={onForward}>
                            <RotateRightIcon
                                sx={{ color: "white", fontSize: 60 }}
                            />
                        </div>
                    </div>
                    <div className="footer">
                        <div className="play_control_box">
                            <div className="slider">
                                <div
                                    className="video_time"
                                >
                                    {elapsedTime}
                                </div>
                                <PrettoSlider
                                    valueLabelDisplay="auto"
                                    min={0}
                                    max={100}
                                    aria-label="custom thumb label"
                                    value={played * 100}
                                    onChange={onSeek}
                                    onMouseDown={onSeekMouseDown}
                                    onChangeCommitted={onSeekMouseUp}
                                    valueLabelFormat={valueLabelFormat}
                                    sx={{
                                        color: "#17a23a",
                                        height: 8,
                                        "& .MuiSlider-thumb": {
                                            width: 22,
                                            height: 22,
                                            "&.Mui-active": {
                                                width: 22,
                                                height: 22,
                                            },
                                        },
                                        "& .MuiSlider-rail": {
                                            opacity: 0.8,
                                            color: "#eee"
                                        },
                                    }}
                                />
                                <div
                                    className="video_time"
                                >
                                    {totalDuration}
                                </div>
                                <div onClick={handlePopover} className="speed">
                                    <div>{playbackRate}X</div>
                                </div>
                                <Popover
                                    id={open ? "playbackrate-popover" : undefined}
                                    open={open}
                                    onClose={handleClose}
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: "top",
                                        horizontal: "left",
                                    }}
                                    transformOrigin={{
                                        vertical: "bottom",
                                        horizontal: "left",
                                    }}
                                >
                                    <StSpeedMap>
                                        {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                                            <div
                                                className="speed_box"
                                                key={rate}
                                                onClick={() => setOpen(false)}
                                            >
                                                <div
                                                    onClick={() => onPlaybackRateChange(rate)}
                                                    className="speed_btn"
                                                >
                                                    <div>{rate}X</div>
                                                </div>
                                            </div>
                                        ))}
                                    </StSpeedMap>
                                </Popover>
                                <div className="fullscreen" onClick={onToggleFullScreen}>
                                    <BiFullscreen />
                                </div>
                            </div>
                            <div className="functions_box">
                                <div className="basic_box">
                            </div>
                            <div className="sub_box">
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        );
    }
);

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 1;
  & .control_box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    .header {
      width: 96%;
      display: flex;
      margin-top: 20px;
      .logo{
        color: white;
        font-weight: 500;
        background-color: #28be62;
        width: 60px;
        height: 35px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 6px;
      }
      .title {
        color: white;
      }
      .tooltip {
        position: absolute;
        top: 16px;
        right: 60px;
        display: none;
        width: 200px;
        background: rgba(255, 255, 255, 0.9);
        padding: 10px;
        border-radius: 10px;
        :after {
        }
      }
      .scrap_btn {
        background: rgba(30, 30, 30, 0.9);
        border-radius: 0.5em;
        padding: 8px;
        &:hover {
          color: black;
          .tooltip {
            display: block;
          }
        }
      }
    }
    .body {
      width: 60%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      cursor: pointer;
    }
    .footer {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0px;
      .play_control_box {
        width: 100%;
        display: flex;
        align-items: center;
        .slider {
            display: flex;
            width: 100%;
            align-items: center;
            gap: 20px;
            margin: 0 20px;
            .video_time {
            color: white;
            margin: 10px;
            }
            .speed {
            color: white;
            cursor: pointer;
            }
            .fullscreen {
            font-size: 22px;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            }
        }
        
      }
      .functions_box {
        display: flex;
        justify-content: space-between;
        .basic_box {
          flex-grow: 1;
          display: flex;
          justify-content: flex-start;
          .play_icon {
            font-size: 30px;
            color: #777;
            transform: scale(0.9);
            &:hover {
              color: white;
              transform: scale(1);
              transition: all 0.2s ease-in-out;
            }
          }
        }
        .sub_box {
          flex-grow: 3;
          display: flex;
          justify-content: flex-end;
        }
      }
    }
  }
`;

const StSpeedMap = styled.div`
    font-weight: 500;
    font-size: 15px;
    padding: 10px 20px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    cursor: pointer;
    flex-grow: 3;
`

VideoControl.propTypes = {
    onSeek: PropTypes.func,
    onSeekMouseDown: PropTypes.func,
    onSeekMouseUp: PropTypes.func,
    onDuration: PropTypes.func,
    onRewind: PropTypes.func,
    onPlayPause: PropTypes.func,
    onFastForward: PropTypes.func,
    onVolumeSeekDown: PropTypes.func,
    onChangeDispayFormat: PropTypes.func,
    onPlaybackRateChange: PropTypes.func,
    onToggleFullScreen: PropTypes.func,
    onMute: PropTypes.func,
    playing: PropTypes.bool,
    played: PropTypes.number,
    elapsedTime: PropTypes.string,
    totalDuration: PropTypes.string,
    muted: PropTypes.bool,
    playbackRate: PropTypes.number,
};
export default VideoControl;