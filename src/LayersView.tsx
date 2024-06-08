import React, { useEffect, useState } from "react";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ShapeIcon from "./ShapeIcon";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { getSelector, convertTypeToDisplayName } from "./utils";

export default function LayersView({
  svgJSON = {},
  onLayerClick,
  elementStateRecord,
  setElementStateRecord,
}) {
  const [treeData, setTreeData] = useState(null);
  const initElementStateRecord = (selector: string) => {
    let copy = elementStateRecord;
    if (!copy[selector]) copy[selector] = {};
    return copy;
  };
  const isHidden = (el) => {
    const selector = getSelector(el);
    if (selector) {
      let element_state_record = initElementStateRecord(selector);
      let { hidden } = element_state_record[selector];
      return hidden;
    }
    return false;
  };
  const changeHiddenProp = (el) => {
    const selector = getSelector(el);
    if (selector) {
      let element_state_record = initElementStateRecord(selector);
      let { hidden } = element_state_record[selector];
      setElementStateRecord((prevElementStateRecord) => {
        return {
          ...prevElementStateRecord,
          [selector]: { ...prevElementStateRecord[selector], hidden: !hidden },
        };
      });
    }
  };
  const hideEl = (el) => {
    changeHiddenProp(el);
    el.hide();
  };
  const showEl = (el) => {
    changeHiddenProp(el);
    el.show();
  };
  const isEmptyObject = (obj) =>
    obj && Object.keys(obj).length === 0 && obj.constructor === Object;
  const cleanSVGJSON = (svgJSON) => {
    if (isEmptyObject(svgJSON)) return { children: [] };
    if (svgJSON && (svgJSON.name === "switch" || svgJSON.name === "defs")) {
      return null;
    }

    if (svgJSON && svgJSON.children && svgJSON.children.length > 0) {
      svgJSON.children = svgJSON.children
        .map((child) => cleanSVGJSON(child))
        .filter((child) => child !== null);
    }
    return svgJSON;
  };
  useEffect(() => {
    let cleanedSVGJSON = cleanSVGJSON(svgJSON);
    if (cleanedSVGJSON["children"]) setTreeData(cleanedSVGJSON["children"]);
  }, [svgJSON]);
  const getLayerLabel = (item) => {
    if (item && item.attributes && item.attributes.id)
      return item.attributes.id;
    return convertTypeToDisplayName(item.name);
  };
  const handleClick = (item) => {
    onLayerClick(item.element);
  };
  const handleHover = (item) => {
    onLayerClick(item.element);
  };
  const createTreeView = (data) => {
    if (!data || !Array.isArray(data)) return null;

    return (
      <TreeView
        aria-label="file system navigator"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        {data.map((item, index) => (
          <>
            {item.name === "g" && item.children.length > 0 ? (
              <TreeItem
                key={index}
                nodeId={index.toString()}
                label={
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    {/* Label */}
                    {getLayerLabel(item)}
                    {/* Button */}
                    {!isHidden(item.element) ? (
                      <button
                        className="element-controls"
                        onClick={() => hideEl(item.element)}
                      >
                        <VisibilityIcon />
                      </button>
                    ) : (
                      <button
                        className="element-controls"
                        onClick={() => showEl(item.element)}
                      >
                        <VisibilityOffIcon />
                      </button>
                    )}
                  </div>
                }
                onClick={() => handleClick(item)}
                onMouseEnter={() => handleHover(item)}
              >
                {createTreeView(item.children)}
              </TreeItem>
            ) : item.name === "g" && item.children.length === 0 ? null : (
              <TreeItem
                key={index}
                nodeId={index.toString()}
                label={
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    {/* Label */}
                    {getLayerLabel(item)}
                    {/* Button */}
                    {!isHidden(item.element) ? (
                      <button
                        className="element-controls"
                        onClick={() => hideEl(item.element)}
                      >
                        <VisibilityIcon />
                      </button>
                    ) : (
                      <button
                        className="element-controls"
                        onClick={() => showEl(item.element)}
                      >
                        <VisibilityOffIcon />
                      </button>
                    )}
                  </div>
                }
                icon={<ShapeIcon svgElType={item.name} />}
                onClick={() => handleClick(item)}
                onMouseEnter={() => handleHover(item)}
              >
                {item.children &&
                  item.children.length > 0 &&
                  createTreeView(item.children)}
              </TreeItem>
            )}
          </>
        ))}
      </TreeView>
    );
  };
  return <div>{treeData ? createTreeView(treeData) : null}</div>;
}
