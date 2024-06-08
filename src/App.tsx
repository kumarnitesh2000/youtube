import React, { useState, useEffect, useRef } from "react";
import { SVG } from "@svgdotjs/svg.js";
import "@svgdotjs/svg.draggable.js";
import { getSelector } from "./utils";
import ColorPicker from "react-pick-color";
import SplitPane, { Pane } from "split-pane-react";
import "split-pane-react/esm/themes/default.css";
import TimeLineEditor from "./TimeLineEditor";
import AnimationIcon from "@mui/icons-material/Animation";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import useStore from "./store";
import ActionProperties from "./ActionProperties";
import LayersView from "./LayersView";
import Accordion from "@mui/material/Accordion";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import { Slider } from "@mui/material";
import TabList from "@mui/lab/TabList";
import Typography from "@mui/material/Typography";
import TabPanel from "@mui/lab/TabPanel";
import { Box, TextField } from "@mui/material";
import InsightsIcon from "@mui/icons-material/Insights";
import ArchitectureIcon from "@mui/icons-material/Architecture";
import Drawer from "@mui/material/Drawer";
import InitialProperties from "./PropertiesViewer";
import Controls from "./Controls";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Button } from "@mui/material";
import SelectionArea from "@viselect/react";
import "./style.css";

const default_easing = "cubicBezier(0.25,0.1,0.25,1)";
const App: React.FC = () => {
  const { timer, setTimer, selectedAction, inc } = useStore();
  const [elementStateRecord, setElementStateRecord] = useState({});
  const timerRef = useRef();
  timerRef.current = timer;
  const [currentEl, setCurrentEl] = useState(null);
  const [svgString, setSvgString] = useState<string | null>(null);
  const svgContainerRef = useRef<SVGSVGElement | null>(null);
  const [hotspots, setHotspots] = useState({});
  const hotspotsRef = useRef();
  hotspotsRef.current = hotspots;
  const [properties, setProperties] = useState({});
  const propertiesRef = useRef();
  propertiesRef.current = properties;
  const [layers, setLayers] = useState([]);
  const [sizes, setSizes] = useState(["70%", "30%"]);
  const addHighLighter = (element, draw) => {};
  useEffect(() => {}, [timer]);
  const getDelayValue = (keyframes) => {
    const _timer = timerRef.current;
    const totalDuration = keyframes.reduce(
      (sum, keyframe) => sum + keyframe.duration,
      0
    );
    const totalDelay = keyframes.reduce(
      (sum, keyframe) => sum + keyframe.delay,
      0
    );
    const delayValue = _timer * 1000 - totalDuration - totalDelay;
    return Math.max(0, delayValue);
  };
  const initHotspot = (selector: string) => {
    let copy = hotspotsRef.current;
    if (!copy[selector]) {
      copy[selector] = { animation: {} };
    }
    return copy;
  };
  const initProperty = (selector: string) => {
    let copy = propertiesRef.current;
    if (!copy[selector]) copy[selector] = {};
    return copy;
  };
  const initElementStateRecord = (selector: string) => {
    let copy = elementStateRecord;
    if (!copy[selector]) copy[selector] = {};
    return copy;
  };
  const addPositionToTimeline = (
    selector,
    box,
    initial_position = false,
    el
  ) => {
    const new_properties = initProperty(selector);
    let { x: x_box, y: y_box } = box;
    if (initial_position) {
      let { x, y } = new_properties[selector];
      if (x && y) return;
      const elprop = getPropertiesOfElement(el);
      if (elprop.x && elprop.y) {
        x_box = elprop.x;
        y_box = elprop.y;
      }
      new_properties[selector] = {
        ...new_properties[selector],
        x: x_box,
        y: y_box,
        height: getDefaultSize(el).height,
        width: getDefaultSize(el).width,
        opacity: getPropertiesOfElement(el).opacity
          ? getPropertiesOfElement(el).opacity
          : 1,
        fill: getPropertiesOfElement(el).fill
          ? getPropertiesOfElement(el).fill
          : getDefaultFillValue(el),
      };
      setProperties((prevProperties) => {
        return { ...prevProperties, [selector]: new_properties[selector] };
      });
      return;
    }
    const new_hotspots = initHotspot(selector);
    if (!new_hotspots[selector]["animation"].x) {
      new_hotspots[selector]["animation"]["x"] = [];
      new_hotspots[selector]["animation"]["y"] = [];
    }
    const delayX = getDelayValue(new_hotspots[selector]["animation"]["x"]);
    const delayY = getDelayValue(new_hotspots[selector]["animation"]["y"]);
    new_hotspots[selector]["animation"].x.push({
      value: x_box,
      duration: 1000,
      delay: delayX,
      easing: default_easing,
    });
    new_hotspots[selector]["animation"].y.push({
      value: y_box,
      duration: 1000,
      delay: delayY,
      easing: default_easing,
    });
    setHotspots((prevHotspots) => {
      return { ...prevHotspots, [selector]: new_hotspots[selector] };
    });
    inc();
  };
  const onElementAdded = (selector) => {
    const element = SVG(selector);
    const { x, y } = element.bbox();
    addPositionToTimeline(selector, { x, y }, true, element);
    setCurrentEl(element);
    setValue("1");
  };
  const applyProperties = (element, draw) => {
    const selector = getSelector(element);
    if (selector) element.addClass("selectable").data("selector", selector);
    element.on("dragend.namespace", (e) => {
      const { box } = e.detail;
      if (selector) {
        addPositionToTimeline(selector, box);
      }
    });
  };
  const allowed_draggable_elements = [
    "rect",
    "text",
    "ellipse",
    "path",
    "image",
    "circle",
    "polyline",
    "polygon",
    "line",
  ];
  const makeSvgElementsDraggable = (element, draw) => {
    if (allowed_draggable_elements.includes(element?.type)) {
      applyProperties(element, draw);
      setLayers((prevLayers) => [
        ...prevLayers,
        { type: element?.type, element },
      ]);
    }
    if (element && element?.children()) {
      element.children().forEach((child) => {
        makeSvgElementsDraggable(child, draw);
      });
    }
  };
  const [svgJson, setSvgJson] = useState(null);
  const [draw, setDraw] = useState(null);
  const upper_height = "400px";
  const drawSvgWithControls = (): void => {
    if (svgContainerRef && svgString) {
      if (!draw) {
        let draw = SVG().addTo(svgContainerRef.current).size("100%", "100%");
        setDraw(draw);
        let svg = draw.svg(svgString).children()[0];
        svg.attr("width", null);
        svg.attr("height", null);
        // Function to convert SVG element to JSON format
        const svgElementToJSON = (element) => {
          const json = {
            name: element.node.nodeName,
            type: "element",
            value: "",
            element,
            attributes: {},
            children: [],
          };
          // Adding attributes
          for (let i = 0; i < element.node.attributes.length; i++) {
            const attr = element.node.attributes[i];
            json.attributes[attr.name] = attr.value;
          }
          // Adding children
          element.children().forEach((child) => {
            json.children.push(svgElementToJSON(child));
          });
          return json;
        };

        // Convert root SVG to JSON
        const svgJSON = svgElementToJSON(svg);
        setSvgJson(svgJSON);
        makeSvgElementsDraggable(svg, draw);
      } else {
        draw.clear(); // clear previous svg
        let svg = draw.svg(svgString).children()[0];
        // Function to convert SVG element to JSON format
        const svgElementToJSON = (element) => {
          const json = {
            name: element.node.nodeName,
            type: "element",
            value: "",
            element,
            attributes: {},
            children: [],
          };
          // Adding attributes
          for (let i = 0; i < element.node.attributes.length; i++) {
            const attr = element.node.attributes[i];
            json.attributes[attr.name] = attr.value;
          }
          // Adding children
          element.children().forEach((child) => {
            json.children.push(svgElementToJSON(child));
          });
          return json;
        };

        // Convert root SVG to JSON
        const svgJSON = svgElementToJSON(svg);
        setSvgJson(svgJSON);
        makeSvgElementsDraggable(svg, draw);
      }
    }
  };
  useEffect(() => {
    setProperties({});
    setHotspots({});
    setTimer(0);
    setLayers([]);
    setCurrentEl(null);
    drawSvgWithControls();
  }, [svgString]);
  const handleButtonClick = (element) => {
    setCurrentEl(element);
    if (getSelector(element))
      addPositionToTimeline(
        getSelector(element),
        element.bbox(),
        true,
        element
      );
  };
  const getPropertiesOfElement = (el) => {
    return el.attr();
  };
  const updateFillProperty = (el, value) => {
    el.data("fill", { value });
    const selector = getSelector(el);
    if (selector) {
      const new_properties = initProperty(selector);
      let { fill } = new_properties[selector];
      if (fill) return;
      new_properties[selector] = {
        ...new_properties[selector],
        fill: getPropertiesOfElement(el).fill
          ? getPropertiesOfElement(el).fill
          : getDefaultFillValue(el),
      };
      setProperties((prevProperties) => {
        return { ...prevProperties, [selector]: new_properties[selector] };
      });
    }
  };
  const addFillPropertyToTimeLine = (el) => {
    const { value } = el.data("fill");
    el.attr("fill", value);
    const selector = getSelector(el);
    if (selector) {
      let new_hotspots = initHotspot(selector);
      if (!new_hotspots[selector]["animation"].fill) {
        new_hotspots[selector]["animation"]["fill"] = [];
      }
      // console.log(new_hotspots);
      const delay = getDelayValue(new_hotspots[selector]["animation"]["fill"]);
      new_hotspots[selector]["animation"]["fill"].push({
        value: value,
        duration: 1000,
        delay: delay,
        easing: default_easing,
      });
      setHotspots((prevHotspots) => {
        return { ...prevHotspots, [selector]: new_hotspots[selector] };
      });
      inc();
    }
  };
  const updateOpacity = (el, value) => {
    if (value) el.data("opacity", { value });
  };
  const updateSize = (el, value, type) => {
    if (value) el.data(type, { value });
  };
  const updateStrokeDashOffset = (el, value) => {
    el.data("strokeDashoffset", { value });
    const selector = getSelector(el);
    if (selector) {
      const new_properties = initProperty(selector);
      let { strokeDashoffset } = new_properties[selector];
      if (strokeDashoffset) return;
      new_properties[selector] = {
        ...new_properties[selector],
        strokeDashoffset: getPropertiesOfElement(el)["stroke-dashoffset"]
          ? getPropertiesOfElement(el)["stroke-dashoffset"]
          : 0,
      };
      setProperties((prevProperties) => {
        return { ...prevProperties, [selector]: new_properties[selector] };
      });
    }
  };
  const addStrokeDashOffsetToTimeline = (el) => {
    const { value } = el.data("strokeDashoffset")
      ? el.data("strokeDashoffset")
      : { value: 0 };
    el.attr("stroke-dashoffset", value);
    const selector = getSelector(el);
    if (selector) {
      let new_hotspots = initHotspot(selector);
      if (!new_hotspots[selector]["animation"].strokeDashoffset) {
        new_hotspots[selector]["animation"]["strokeDashoffset"] = [];
      }
      const delay = getDelayValue(
        new_hotspots[selector]["animation"]["strokeDashoffset"]
      );
      new_hotspots[selector]["animation"]["strokeDashoffset"].push({
        value: value,
        duration: 1000,
        delay: delay,
        easing: default_easing,
      });
      setHotspots((prevHotspots) => {
        return { ...prevHotspots, [selector]: new_hotspots[selector] };
      });
      inc();
    }
  };
  const addOpacityPropertyToTimeline = (el) => {
    const opacityData = el.data("opacity");
    const value =
      opacityData && opacityData.value !== undefined
        ? opacityData.value
        : getPropertiesOfElement(el).opacity !== undefined
        ? getPropertiesOfElement(el).opacity
        : 1;
    let updatedHotspots = { ...hotspots };
    for (const selector of selected) {
      if (!selector) continue;
      if (!updatedHotspots[selector])
        updatedHotspots[selector] = { animation: {} };
      if (!updatedHotspots[selector]["animation"].opacity) {
        updatedHotspots[selector]["animation"]["opacity"] = [];
      }
      const delay = getDelayValue(
        updatedHotspots[selector]["animation"]["opacity"]
      );
      updatedHotspots[selector]["animation"]["opacity"].push({
        value: value,
        duration: 1000,
        delay: delay,
        easing: default_easing,
      });
    }
    setHotspots(updatedHotspots);
    inc();
  };
  const uploadSVG = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        setSvgString(content);
      };
      reader.readAsText(file);
    }
  };
  const addSizePropertyToTimeline = (el) => {
    // calculate height and width
    let height = el.data("height");
    let width = el.data("width");
    if (height && height.value) height = height.value;
    else height = getDefaultSize(el).height;
    if (width && width.value) width = width.value;
    else width = getDefaultSize(el).width;
    // set in canvas
    el.attr("height", height);
    el.attr("width", width);
    const selector = getSelector(el);
    if (selector) {
      let new_hotspots = initHotspot(selector);
      if (!new_hotspots[selector]["animation"].height) {
        new_hotspots[selector]["animation"]["height"] = [];
      }
      if (!new_hotspots[selector]["animation"].width) {
        new_hotspots[selector]["animation"]["width"] = [];
      }
      const delayHeight = getDelayValue(
        new_hotspots[selector]["animation"]["height"]
      );
      const delayWidth = getDelayValue(
        new_hotspots[selector]["animation"]["width"]
      );
      new_hotspots[selector]["animation"]["height"].push({
        value: height,
        duration: 1000,
        delay: delayHeight,
        easing: default_easing,
      });
      new_hotspots[selector]["animation"]["width"].push({
        value: width,
        duration: 1000,
        delay: delayWidth,
        easing: default_easing,
      });
      setHotspots((prevHotspots) => {
        return { ...prevHotspots, [selector]: new_hotspots[selector] };
      });
      inc();
    }
  };
  const getPathProperties = (el) => {
    return { length: el.length() };
  };
  const getDefaultFillValue = (el) => {
    const parentEl = SVG(el.node.parentElement);
    let { fill } = parentEl ? parentEl.attr() : { fill: "#ffffff" };
    return fill;
  };
  const getDefaultSize = (el) => {
    let { height, width } = el.attr();
    if (!height) {
      height = el.bbox().height;
    }
    if (!width) {
      width = el.bbox().width;
    }
    return { height, width };
  };
  const getPosition = (el) => {
    let { x, y } = el.attr();
    if (!x) {
      x = el.bbox().x;
    }
    if (!y) {
      y = el.bbox().y;
    }
    return { x, y };
  };
  const [value, setValue] = React.useState("1");

  const [selected, setSelected] = useState(() => new Set());
  const extractSectedElSelectors = (els) => {
    return els.map((v) => SVG(v).data("selector"));
  };

  const onStart = ({ event, selection }) => {
    if (!event?.ctrlKey && !event?.metaKey) {
      selection.clearSelection();
      setSelected(() => new Set());
    }
  };

  const onMove = ({
    store: {
      changed: { added, removed },
    },
  }) => {
    setSelected((prev) => {
      const next = new Set(prev);
      extractSectedElSelectors(added).forEach((selector) => {
        onElementAdded(selector);
        SVG(selector).css("outline", "3px solid #6e6ed6");
        next.add(selector);
      });
      extractSectedElSelectors(removed).forEach((selector) => {
        SVG(selector).css("outline", null);
        next.delete(selector);
      });
      return next;
    });
  };
  const makeElDraggable = (el) => {
    const selector = getSelector(el);
    if (selector) {
      let element_state_record = initElementStateRecord(selector);
      let { draggable } = element_state_record[selector];
      setElementStateRecord((prevElementStateRecord) => {
        return {
          ...prevElementStateRecord,
          [selector]: { draggable: !draggable },
        };
      });
      if (draggable) {
        el.draggable(false);
      } else {
        el.draggable();
      }
    }
  };
  const isDraggable = (el) => {
    const selector = getSelector(el);
    if (selector) {
      let element_state_record = initElementStateRecord(selector);
      let { draggable } = element_state_record[selector];
      return draggable;
    }
    return false;
  };
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const drawerWidth = 300;
  return (
    <div className="App">
      <Controls
        hotspots={hotspots}
        properties={properties}
        setProperties={setProperties}
        setHotspots={setHotspots}
      />
      <SplitPane split="horizontal" sizes={sizes} onChange={setSizes}>
        <Pane>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              height: "100%",
            }}
          >
            <Drawer
              sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                  width: drawerWidth,
                  boxSizing: "border-box",
                  height: upper_height,
                  position: "relative",
                },
              }}
              variant="permanent"
              anchor="left"
            >
              {svgJson ? (
                <LayersView
                  svgJSON={svgJson}
                  onLayerClick={handleButtonClick}
                  elementStateRecord={elementStateRecord}
                  setElementStateRecord={setElementStateRecord}
                />
              ) : null}
            </Drawer>
            <SelectionArea
              onStart={onStart}
              onMove={onMove}
              selectables=".selectable"
              id="svg-wrapper"
            >
              <div
                style={{ height: "100%", width: "100%" }}
                ref={svgContainerRef}
              ></div>
            </SelectionArea>
            <div>
              {!svgString ? (
                <div style={{ marginRight: "280px", marginTop: "200px" }}>
                  <label htmlFor="uploadInput">
                    <Button
                      endIcon={<UploadFileIcon />}
                      style={{ marginRight: "10px", marginTop: "10px" }}
                      variant="contained"
                      component="span"
                    >
                      Upload SVG
                    </Button>
                  </label>
                  <input
                    type="file"
                    accept=".svg"
                    id="uploadInput"
                    style={{ display: "none" }}
                    onChange={uploadSVG}
                  />
                </div>
              ) : null}
            </div>
            <div
              style={{
                borderLeft: "2px solid #8c8b8a",
                height: upper_height,
                overflow: "auto",
                width: "400px",
              }}
            >
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList
                    onChange={handleChange}
                    aria-label="lab API tabs example"
                  >
                    <Tab
                      icon={<ArchitectureIcon />}
                      // label="animate properties"
                      value="1"
                    />
                    <Tab
                      icon={<InsightsIcon />}
                      // label="edit action"
                      value="2"
                    />
                  </TabList>
                </Box>

                <TabPanel value="1">
                  <div>
                    {/* animate properties*/}
                    <Accordion defaultExpanded>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="animate-properties-controls"
                        id="animate-properties"
                      >
                        <Typography>Animate Properties</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {currentEl ? (
                          <Button
                            variant="contained"
                            onClick={() => makeElDraggable(currentEl)}
                            endIcon={<AnimationIcon />}
                            style={{
                              opacity: isDraggable(currentEl) ? 0.5 : 1,
                            }}
                          >
                            {!isDraggable(currentEl)
                              ? "Start Dragging"
                              : "Stop Dragging"}
                          </Button>
                        ) : null}
                        {currentEl && currentEl.type === "path" ? (
                          <div>
                            {" "}
                            <Typography gutterBottom>
                              stroke-dashoffset
                            </Typography>{" "}
                            <Slider
                              aria-label={"strokeDashoffset"}
                              valueLabelDisplay="auto"
                              size="small"
                              marks
                              min={0}
                              max={getPathProperties(currentEl).length}
                              onChange={(e) =>
                                updateStrokeDashOffset(
                                  currentEl,
                                  e.target.value
                                )
                              }
                              style={{ width: "50%" }}
                            />{" "}
                            <br />{" "}
                            <Button
                              variant="contained"
                              endIcon={<AddCircleOutlineIcon />}
                              onClick={() =>
                                addStrokeDashOffsetToTimeline(currentEl)
                              }
                              sx={{ marginTop: "10px" }}
                              size="small"
                            >
                              {" "}
                              Add to Timeline{" "}
                            </Button>{" "}
                          </div>
                        ) : null}{" "}
                        {currentEl && getPropertiesOfElement(currentEl) ? (
                          <div style={{ marginTop: "10px" }}>
                            {" "}
                            <Typography gutterBottom>Fill</Typography>{" "}
                            <ColorPicker
                              color={
                                getPropertiesOfElement(currentEl).fill
                                  ? getPropertiesOfElement(currentEl).fill
                                  : getDefaultFillValue(currentEl)
                              }
                              theme={{ width: "150px" }}
                              onChange={(color) =>
                                updateFillProperty(currentEl, color.hex)
                              }
                            />{" "}
                            <Button
                              variant="contained"
                              endIcon={<AddCircleOutlineIcon />}
                              onClick={() =>
                                addFillPropertyToTimeLine(currentEl)
                              }
                              sx={{ marginTop: "10px" }}
                              size="small"
                            >
                              {" "}
                              Add to Timeline{" "}
                            </Button>{" "}
                          </div>
                        ) : null}{" "}
                        {currentEl && getPropertiesOfElement(currentEl) ? (
                          <div style={{ marginTop: "10px" }}>
                            {" "}
                            <Typography gutterBottom>Opacity</Typography>{" "}
                            <Slider
                              aria-label={"opacity"}
                              valueLabelDisplay="auto"
                              step={0.1}
                              size="small"
                              marks
                              min={0}
                              max={1}
                              onChange={(e) =>
                                updateOpacity(currentEl, e.target.value)
                              }
                              style={{ width: "50%" }}
                            />{" "}
                            <br />{" "}
                            <Button
                              variant="contained"
                              endIcon={<AddCircleOutlineIcon />}
                              onClick={() =>
                                addOpacityPropertyToTimeline(currentEl)
                              }
                              size="small"
                            >
                              {" "}
                              Add to Timeline{" "}
                            </Button>{" "}
                          </div>
                        ) : null}{" "}
                        {currentEl ? (
                          <div style={{ marginTop: "10px" }}>
                            {" "}
                            <Typography gutterBottom>Resize</Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: "10px",
                              }}
                            >
                              <TextField
                                id={"height"}
                                label={"height"}
                                variant="outlined"
                                placeholder={
                                  getDefaultSize(currentEl)["height"]
                                }
                                onChange={(e) => {
                                  updateSize(
                                    currentEl,
                                    e.target.value,
                                    "height"
                                  );
                                }}
                              />
                              <TextField
                                id={"width"}
                                label={"width"}
                                variant="outlined"
                                placeholder={getDefaultSize(currentEl)["width"]}
                                onChange={(e) => {
                                  updateSize(
                                    currentEl,
                                    e.target.value,
                                    "width"
                                  );
                                }}
                              />
                            </Box>
                            <Button
                              variant="contained"
                              endIcon={<AddCircleOutlineIcon />}
                              size="small"
                              onClick={() =>
                                addSizePropertyToTimeline(currentEl)
                              }
                            >
                              {" "}
                              Add to Timeline{" "}
                            </Button>{" "}
                          </div>
                        ) : null}
                      </AccordionDetails>
                    </Accordion>
                    {/* init properties */}
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="init-properties-controls"
                        id="init-properties"
                      >
                        <Typography>Initial Properties</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {currentEl && getSelector(currentEl) ? (
                          <React.Fragment>
                            <InitialProperties
                              properties={properties}
                              selector={getSelector(currentEl)}
                              setProperties={setProperties}
                              selected={selected}
                            />
                          </React.Fragment>
                        ) : null}
                      </AccordionDetails>
                    </Accordion>
                  </div>
                </TabPanel>
                <TabPanel value="2">
                  {hotspots && selectedAction ? (
                    <ActionProperties
                      hotspots={hotspots}
                      selectedAction={selectedAction}
                      setHotspots={setHotspots}
                    />
                  ) : null}
                </TabPanel>
              </TabContext>
            </div>
          </div>
        </Pane>
        <Pane minSize={"20%"} maxSize="70%">
          <TimeLineEditor
            hotspots={hotspots}
            properties={properties}
            currentEl={currentEl}
            setCurrentEl={setCurrentEl}
            setHotspots={setHotspots}
            setValue={setValue}
          />
        </Pane>
      </SplitPane>
    </div>
  );
};

export default App;
