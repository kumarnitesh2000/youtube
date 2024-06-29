import React from "react";
export default function BasicText({ text, option_id }) {
  return <div key={option_id}>{text}</div>;
}
