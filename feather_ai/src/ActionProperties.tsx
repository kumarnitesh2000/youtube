import React, { useEffect, useState } from "react";
import EasingPicker from "./EasingPicker";
import { Typography, TextField } from "@mui/material";
import { Slider } from "@mui/material";
import ColorPicker from "react-pick-color";
import { SVG } from "@svgdotjs/svg.js";

function ActionProperties({ hotspots, selectedAction, setHotspots }) {
  const [property, setProperty] = useState(null);
  useEffect(() => {
    const { hotspot, prop, index } = selectedAction;
    const selectedData = hotspots[hotspot]?.animation?.[prop]?.[index];
    setProperty(selectedData);
  }, [hotspots, selectedAction]);
  const showKey = (key) => {
    switch (key) {
      case "endDelay":
      case "easing":
        return false;
      default:
        return true;
    }
  };
  const handleChange = (value, key) => {
    const { index, hotspot } = selectedAction;
    let new_hotspots = { ...hotspots };
    new_hotspots[hotspot].animation[key][index]["value"] = value;
    setHotspots((prevHotspots) => {
      return { ...prevHotspots, [hotspot]: new_hotspots[hotspot] };
    });
    // set svg
    const svgEl = SVG(hotspot);
    svgEl.attr({ [key]: value });
  };
  return (
    <div>
      {property ? (
        <React.Fragment>
          {Object.keys(property).map((key, index) => (
            <div key={index}>
              {showKey(key) ? (
                <div key={index}>
                  {key === "value" ? (
                    <>
                      <Typography gutterBottom>
                        {selectedAction["prop"]}
                      </Typography>
                      {selectedAction &&
                      selectedAction["prop"] === "opacity" ? (
                        <Slider
                          id={key}
                          aria-label={selectedAction["prop"]}
                          value={property[key]}
                          valueLabelDisplay="auto"
                          step={0.1}
                          marks
                          min={0}
                          max={1}
                          onChange={(e) =>
                            handleChange(e.target.value, selectedAction["prop"])
                          }
                        />
                      ) : selectedAction["prop"] === "fill" ? (
                        <ColorPicker
                          color={property[key]}
                          onChange={(color) =>
                            handleChange(color.hex, selectedAction["prop"])
                          }
                        />
                      ) : (
                        <TextField
                          id={key}
                          label={selectedAction["prop"]}
                          variant="outlined"
                          value={property[key]}
                          type="number"
                          onChange={(e) =>
                            handleChange(e.target.value, selectedAction["prop"])
                          }
                        />
                      )}
                    </>
                  ) : (
                    <>
                      <Typography gutterBottom>{key}</Typography>
                      <TextField
                        id={key}
                        label={key}
                        variant="outlined"
                        value={property[key]}
                      />
                    </>
                  )}
                </div>
              ) : null}
            </div>
          ))}
          <EasingPicker
            hotspots={hotspots}
            selectedAction={selectedAction}
            easing={property.easing}
            setHotspots={setHotspots}
          />
        </React.Fragment>
      ) : null}
    </div>
  );
}

export default ActionProperties;
