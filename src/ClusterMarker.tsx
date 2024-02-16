import React, { FC, useMemo } from "react";
import { ClusterMarkerProps } from "./types";

const colors = {
  small: ["rgba(181, 226, 140, 0.6)", "rgba(110, 204, 57, 0.7)"],
  medium: ["rgba(241, 211, 87, 0.6)", "rgba(240, 194, 12, 0.7)"],
  big: ["rgba(253, 156, 115, 0.6)", "rgba(241, 128, 23, 0.7)"],
};

const defaultCountToColor = (count: number) => {
  return count > 20 ? colors.big : count > 7 ? colors.medium : colors.small;
};

const ClusterMarker: FC<ClusterMarkerProps> = ({
  pixelOffset,
  count,
  clusterStyleFunction,
  clusterRenderFunction,
}) => {
  const markerStyle = clusterStyleFunction?.(count, pixelOffset) ?? {
    width: 30,
    height: 30,
    borderRadius: "50%",
    borderWidth: 3,
    borderColor: defaultCountToColor(count)[0],
    borderStyle: "solid",
    background: defaultCountToColor(count)[1],
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "default",
    left: pixelOffset?.[0],
    top: pixelOffset?.[1],
    zIndex: 1,
    transform: "translate(-50%, -50%)",
  };

  const Cluster = useMemo(() => {
    if (clusterRenderFunction) return clusterRenderFunction(count, pixelOffset);
    return <div style={markerStyle}>{count}</div>;
  }, [count, pixelOffset, clusterRenderFunction]);

  return Cluster;
};

export default ClusterMarker;
