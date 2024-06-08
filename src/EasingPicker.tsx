import React, { useEffect, useState } from "react";
import BezierEditor from "bezier-easing-editor";
import useStore from "./store";

const presets = [
  { name: "linear", curve: [0, 0, 1, 1] },
  { name: "ease", curve: [0.25, 0.1, 0.25, 1.0] },
  { name: "ease in", curve: [0.42, 0, 1, 1] },
  { name: "ease out", curve: [0, 0, 0.58, 1] },
  { name: "ease in out", curve: [0.42, 0, 0.58, 1] },
];

function EasingPicker({ easing, hotspots, setHotspots, selectedAction }) {
  const [selectedPreset, setSelectedPreset] = useState(null);
  const { setTimer } = useStore();
  const handleDropdownChange = (event) => {
    const selectedIndex = event.target.value;
    setSelectedPreset(presets[selectedIndex]);
  };
  const buildEasingByPoints = (curve) => {
    return `cubicBezier(${curve.join(",")})`;
  };
  const handleSetEasing = () => {
    const { hotspot, prop, index, end } = selectedAction;
    const easing = buildEasingByPoints(selectedPreset.curve);
    const newHotspots = { ...hotspots };
    newHotspots[hotspot]["animation"][prop][index].easing = easing;
    setHotspots(newHotspots);
    setTimer(end);
  };
  function convertCubicBezierStringToArray(cubicBezierString) {
    const trimmedString = cubicBezierString
      .replace("cubicBezier(", "")
      .replace(")", "");
    const bezierArray = trimmedString.split(",").map(parseFloat);
    return bezierArray;
  }
  function filterPresetsByCurve(curveArray) {
    return presets.filter((preset) =>
      preset.curve.every((value, index) => value === curveArray[index])
    );
  }
  useEffect(() => {
    if (easing) {
      let bezierArray = convertCubicBezierStringToArray(easing);
      let selected_ease = filterPresetsByCurve(bezierArray);
      if (selected_ease.length > 0) {
        setSelectedPreset(selected_ease[0]);
      }
    }
  }, [easing]);
  useEffect(() => {
    if (selectedPreset) {
      handleSetEasing();
    }
  }, [selectedPreset]);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        marginTop: "15px",
        justifyContent: "space-evenly",
      }}
    >
      <select onChange={handleDropdownChange} style={{ width: "50%" }}>
        <option value={null}>Select Easing</option>
        {presets.map((preset, index) => (
          <option key={index} value={index}>
            {preset.name}
          </option>
        ))}
      </select>
      {selectedPreset && (
        <BezierEditor
          value={selectedPreset.curve}
          width={150}
          height={150}
          curveColor="#0af"
          handleColor="#0af"
        >
          <text x={50} y={16}>
            {selectedPreset.name}
          </text>
        </BezierEditor>
      )}
    </div>
  );
}

export default EasingPicker;
