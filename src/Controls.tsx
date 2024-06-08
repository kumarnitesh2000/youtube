import React, { useEffect, useState } from "react";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import CallReceivedIcon from "@mui/icons-material/CallReceived";
import { Button } from "@mui/material";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";

export default function Controls({
  hotspots,
  properties,
  setProperties,
  setHotspots,
}) {
  const [importedJSON, setImportedJSON] = useState({});
  const exportAsset = () => {
    const deepCopyHotspots = JSON.parse(JSON.stringify(hotspots));
    for (const hotspotKey in deepCopyHotspots) {
      const property = properties[hotspotKey];
      deepCopyHotspots[hotspotKey]["properties"] = property;
    }

    const jsonString = JSON.stringify(deepCopyHotspots, null, 2);
    const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
    const fileName = `${timestamp}.xpb.json`;

    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  const importAsset = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        setImportedJSON(importedData);
      } catch (error) {
        console.error("Error while parsing JSON:", error);
      }
    };
    reader.readAsText(file);
  };
  useEffect(() => {
    let _properties = {};
    let _hotspots = {};
    for (const hotspotKey in importedJSON) {
      const { animation, properties } = importedJSON[hotspotKey];
      _properties[hotspotKey] = { ...properties };
      _hotspots[hotspotKey] = { animation };
    }
    setHotspots(_hotspots);
    setProperties(_properties);
  }, [importedJSON]);
  return (
    <div
      style={{
        marginBottom: "10px",
        padding: "10px",
        backgroundColor: "#f8f8f8",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Button
        endIcon={<SettingsSuggestIcon />}
        variant="contained"
        size="small"
      >
        Settings
      </Button>
      <div style={{ display: "flex" }}>
        <input
          type="file"
          accept=".json"
          id="importInput"
          style={{ display: "none" }}
          onChange={importAsset}
        />
        <label htmlFor="importInput">
          <Button
            style={{ marginRight: "10px" }}
            endIcon={<CallReceivedIcon />}
            variant="contained"
            component="span"
            size="small"
          >
            Import
          </Button>
        </label>
        <Button
          endIcon={<ArrowOutwardIcon />}
          onClick={exportAsset}
          variant="contained"
          size="small"
        >
          Export
        </Button>
      </div>
    </div>
  );
}
