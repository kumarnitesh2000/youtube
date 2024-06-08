import React, { useState, useRef, useEffect } from "react";
import { Timeline } from "@xzdarcy/react-timeline-editor";
import anime from "animejs/lib/anime.es.js";
import "./style.css";
import useStore from "./store";
import _ from "lodash";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import { SVG } from "@svgdotjs/svg.js";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CustomAction from "./CustomAction";
import TimeLineRowView from "./TimeLineRowView";
import {
  deleteElementFromArrayByIndex,
  cleanUpAnimationKeyFrames,
  setCurrentActionClick,
  setActionSelectedByCurrentEl,
  selectColorCode,
} from "./utils";
import { Typography, IconButton, Divider, Slider } from "@mui/material";

const TimelineEditor = ({
  hotspots,
  properties,
  currentEl,
  setHotspots,
  setValue,
  setCurrentEl,
}) => {
  const domRef = useRef();
  const { timer, setTimer, recording, setRecording } = useStore();
  const timelineState = useRef();
  const [data, setData] = useState([]);
  const [timeline, setTimeline] = useState(null);
  const convertHotspotIntoTimelineRow = (hotspots) => {
    const output = [];
    Object.keys(hotspots).forEach((selector) => {
      const hotspot = hotspots[selector];
      const animationProps = Object.keys(hotspot.animation);
      let bgColor = selectColorCode(selector);
      animationProps.forEach((prop) => {
        const timelineRow = {
          id: `${selector}:::${prop}`,
          selector,
          prop,
          actions: [],
        };

        let cumulativeDuration = 0;
        let cumulativeDelay = 0;

        hotspot.animation[prop].forEach((animation, index) => {
          const start =
            (animation.delay + cumulativeDuration + cumulativeDelay) / 1000;
          const end = start + animation.duration / 1000;

          const action = {
            id: index,
            start,
            end,
            events: {
              clicked: false,
              selected: false,
            },
            properties: {
              hotspot: selector,
              prop: prop,
              bgColor,
            },
          };

          cumulativeDuration += animation.duration;
          cumulativeDelay += animation.delay;

          timelineRow.actions.push(action);
        });

        output.push(timelineRow);
      });
    });

    return output;
  };
  const makePositionRelative = (position_keyframes, initial_value) => {
    let copy_keyframes = position_keyframes;
    return copy_keyframes.map((keyframe, index) => {
      const prevValue =
        index == 0 ? initial_value : position_keyframes[index - 1].value;
      const relativeValue = keyframe.value - prevValue;
      return {
        ...keyframe,
        value:
          relativeValue >= 0
            ? `+=${relativeValue}`
            : `-=${Math.abs(relativeValue)}`,
      };
    });
  };
  const finalJSON = (copy_hotspots, properties) => {
    const deepCopyHotspots = JSON.parse(JSON.stringify(copy_hotspots));
    for (const hotspotKey in deepCopyHotspots) {
      let hotspot = deepCopyHotspots[hotspotKey];
      const property = properties[hotspotKey];
      deepCopyHotspots[hotspotKey]["properties"] = property;
      if (hotspot["animation"]["x"] && hotspot["animation"]["y"]) {
        let { x, y } = property;
        hotspot["animation"]["x"] = makePositionRelative(
          hotspot["animation"]["x"],
          x
        );
        hotspot["animation"]["y"] = makePositionRelative(
          hotspot["animation"]["y"],
          y
        );
      }
    }
    return deepCopyHotspots;
  };
  const buildTimeLine = (hotspots, state) => {
    const _timeline = anime.timeline({
      autoplay: false,
    });

    for (const key in hotspots) {
      if (hotspots.hasOwnProperty(key)) {
        let animation = hotspots[key].animation || {};
        animation = cleanUpAnimationKeyFrames(animation);
        _timeline.add(
          {
            targets: state[key],
            ...animation,
            update: () => {
              setState({ ...state, [key]: { ...state[key] } });
            },
          },
          0
        );
      }
    }
    return _timeline;
  };
  const updateDelayAndDuration = (
    keyframes: object[],
    index: number,
    start: number,
    end: number,
    actions: object[]
  ) => {
    let length = keyframes.length;
    // update main action hotspot val
    let duration = end - start;
    let delay;
    if (index > 0) delay = start - actions[index - 1].end;
    else delay = start;

    keyframes[index].duration = duration * 1000;
    keyframes[index].delay = Math.max(delay, 0) * 1000;
    // update next to main action hotspot value
    if (index + 1 < length) {
      let next_delay = actions[index + 1].start - end;
      keyframes[index + 1].delay = Math.max(next_delay, 0) * 1000;
    }
    return keyframes;
  };
  const onActionChange = (params: {
    action: object;
    row: object;
    start: number;
    end: number;
  }) => {
    const { action, start, end, row } = params;
    const { id, properties } = action;
    const { hotspot, prop } = properties;
    let keyframes = hotspots[hotspot]["animation"][prop];
    keyframes = updateDelayAndDuration(
      keyframes,
      id,
      start,
      end,
      row["actions"]
    );
    setHotspots({ ...hotspots });
    setTimer(end);
  };
  const initState = (hotspots, properties) => {
    let initialState = {};

    for (const key in hotspots) {
      if (hotspots.hasOwnProperty(key)) {
        const animation = hotspots[key].animation || {};
        const property = properties[key] || {};
        initialState[key] = {};
        for (const animatable_key in animation) {
          if (animation.hasOwnProperty(animatable_key)) {
            initialState[key][animatable_key] = property[animatable_key]
              ? property[animatable_key]
              : 0;
          }
        }
      }
    }
    return initialState;
  };
  const [state, setState] = useState({});
  useEffect(() => {
    if (Object.keys(hotspots).length > 0 && Object.keys(hotspots).length > 0) {
      const rows = convertHotspotIntoTimelineRow(hotspots);
      setData(rows);
      const initial_state = initState(hotspots, properties);
      const _timeline = buildTimeLine(hotspots, initial_state);
      setTimeline(_timeline);
    } else {
      setData([]);
      setTimeline(null);
      setState({});
    }
    const keyDownHandler = (event) => {
      const key = event.key;
      if (key === " ") {
        event.preventDefault();
        handlePlayOrPause();
      } else if (key === "Delete") {
        if (selectedActionRef.current) {
          const { hotspot, prop, index } = selectedActionRef.current;
          const updatedKeyFrames = deleteElementFromArrayByIndex(
            hotspots[hotspot]["animation"][prop],
            index
          );
          setHotspots((prevHotspots) => {
            return {
              ...prevHotspots,
              [hotspot]: {
                ...prevHotspots[hotspot],
                animation: {
                  ...prevHotspots[hotspot].animation,
                  [prop]: updatedKeyFrames,
                },
              },
            };
          });
        }
      }
    };
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [hotspots, properties]);
  useEffect(() => {
    timelineState.current.setTime(timer);
    if (timeline) timeline.seek(timer * 1000);
  }, [timer]);
  useEffect(() => {
    if (data && currentEl) {
      let new_data = setActionSelectedByCurrentEl(data, currentEl);
      setData(new_data);
    }
  }, [currentEl]);
  const handleChange = (data) => {
    setData(data);
  };
  const onCursorDrag = (time) => {
    setTimer(time);
  };
  const onClickTimeArea = (time) => {
    setTimer(time);
  };
  const { selectedAction, setSelectedAction } = useStore();
  const selectedActionRef = useRef();
  selectedActionRef.current = selectedAction;
  const onClickActionOnly = (e, param) => {
    const { action, row } = param;
    if (action && action.properties) {
      setTimer(action.end);
      const { hotspot, prop } = action.properties;
      setCurrentEl(SVG(hotspot));
      setSelectedAction({ hotspot, prop, index: action.id });
      let new_data = setCurrentActionClick(data, action);
      setData(new_data);
    }
    setValue("2");
  };
  const reRenderState = (state) => {
    for (const selector in state) {
      const element = SVG(selector);
      if (!element) return;
      element.attr(state[selector]);
      if (element && state[selector].strokeDashoffset) {
        element.attr("stroke-dashoffset", state[selector].strokeDashoffset);
      }
    }
  };
  useEffect(() => {
    reRenderState(state);
  }, [state]);
  const [scale, setScale] = useState(1);
  const timeRender = (time: number) => {
    const float = (parseInt((time % 1) * 100 + "") + "").padStart(2, "0");
    const min = (parseInt(time / 60 + "") + "").padStart(2, "0");
    const second = (parseInt((time % 60) + "") + "").padStart(2, "0");
    return <>{`${min}:${second}.${float.replace("0.", "")}`}</>;
  };
  const [isPlaying, setIsPlaying] = useState(false);
  const scaleWidth = 160;
  const startLeft = 20;
  useEffect(() => {
    if (!timelineState.current) return;
    const engine = timelineState.current;
    engine.listener.on("play", () => setIsPlaying(true));
    engine.listener.on("paused", () => setIsPlaying(false));
    engine.listener.on("afterSetTime", ({ time }) => setTimer(time));
    engine.listener.on("setTimeByTick", ({ time }) => {
      setTimer(time);
      const autoScrollFrom = 500;
      const left = time * (scaleWidth / scale) + startLeft - autoScrollFrom;
      timelineState.current.setScrollLeft(left);
    });
  }, []);
  const handlePlayOrPause = () => {
    if (!timelineState.current) return;
    if (timelineState.current.isPlaying) {
      timelineState.current.pause();
    } else {
      timelineState.current.play({ autoEnd: true });
    }
  };
  return (
    <div id="timeline-piece">
      <div className="timeline-player">
        <div style={{ display: "flex" }}>
          <IconButton color="primary" onClick={handlePlayOrPause}>
            {isPlaying ? <PauseCircleIcon /> : <PlayCircleIcon />}
          </IconButton>
          <IconButton color="primary" onClick={() => setTimer(0)}>
            <RestartAltIcon />
          </IconButton>
        </div>
        <Slider
          sx={{ width: "20%" }}
          value={scale}
          aria-label="scale"
          valueLabelDisplay="auto"
          step={1}
          marks
          min={1}
          max={5}
          onChange={(e) => setScale(e.target.value)}
        />
        <Typography style={{ marginRight: "20px" }} variant="h6" gutterBottom>
          {timeRender(timer)}
        </Typography>
      </div>
      <div className="timeline-editor-container" style={{ width: "100%" }}>
        <div
          ref={domRef}
          style={{ overflow: "overlay" }}
          onScroll={(e) => {
            timelineState.current.setScrollTop(e.target.scrollTop);
          }}
          className={"timeline-list"}
        >
          <TimeLineRowView
            data={data}
            currentEl={currentEl}
            setCurrentEl={setCurrentEl}
          />
        </div>
        <Timeline
          ref={timelineState}
          editorData={data}
          scale={scale}
          effects={{}}
          autoScroll={true}
          onChange={(data) => handleChange(data)}
          onScroll={({ scrollTop }) => {
            domRef.current.scrollTop = scrollTop;
          }}
          dragLine={true}
          onActionMoveEnd={onActionChange}
          onActionResizeEnd={onActionChange}
          onCursorDrag={(time) => onCursorDrag(time)}
          onClickActionOnly={onClickActionOnly}
          onClickTimeArea={onClickTimeArea}
          getActionRender={(action, row) => {
            return <CustomAction action={action} row={row} />;
          }}
        />
      </div>
    </div>
  );
};
export default TimelineEditor;
