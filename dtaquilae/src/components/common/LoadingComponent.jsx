import React from "react";

const LoadingComponent = ({hidden = true}) => {
  const classLoading = hidden ? "loading absolute left-2/4 left top-2/4 z-50 hidden" : "loading absolute left-2/4 left top-2/4 z-50";
  return (
    <div id="loading" className={classLoading}></div>
  );
};

export default LoadingComponent;
