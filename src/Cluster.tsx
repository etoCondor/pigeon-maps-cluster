import supercluster from "supercluster";
import DefaultClusterMarker from "./DefaultClusterMarker";
import React, { FC, useCallback, useEffect, useState, cloneElement } from "react";
import { Point, ClustererProps } from "./types";

export const Cluster: FC<ClustererProps> = (props) => {
  const {
    renderFunction,
    latLngToPixel,
    pixelToLatLng,
    mapState,
    className,
    clusterMarkerRadius = 40,
    maxZoom = 16,
    minZoom = 0,
    minPoints = 2,
    children,
  } = props;
  const [state, setState] = useState<{ pointsMap?: Record<string, any>; index?: supercluster }>({});

  const generatePointsMap = useCallback(
    (children) => {
      const childrenArray = Array.isArray(children) ? children : [children];
      const pointsMap = {};

      childrenArray.forEach((child) => {
        if (!child) return;
        const { key } = child;
        if (!key) {
          throw new Error("Markers must have a key property");
        }
        if (!child.props.anchor) {
          throw new Error("Markers must have an anchor property");
        }
        pointsMap[key] = {
          vNode: cloneElement(child, {
            latLngToPixel,
            pixelToLatLng,
          }),
          geometry: {
            coordinates: child.props.anchor,
          },
          id: key,
        };
      });

      return pointsMap;
    },
    [latLngToPixel, pixelToLatLng],
  );

  const loadPoints = useCallback(
    (pointsMap) => {
      const index = new supercluster({
        radius: clusterMarkerRadius || 40,
        maxZoom,
        minZoom,
        minPoints,
      });
      index.load(Object.keys(pointsMap).map((id) => pointsMap[id]));
      return index;
    },
    [clusterMarkerRadius, maxZoom, minPoints, minZoom],
  );

  const rebuildData = useCallback(
    (props) => {
      const pointsMap = generatePointsMap(children);
      const index = loadPoints(pointsMap);

      setState({
        pointsMap,
        index,
      });
    },
    [children, generatePointsMap, loadPoints],
  );

  useEffect(() => {
    rebuildData(props);
  }, [props, rebuildData]);

  const ne = mapState?.bounds.ne ?? [0, 0];
  const sw = mapState?.bounds.sw ?? [0, 0];
  const [westLng, southLat, eastLng, northLat] = [sw[0], sw[1], ne[0], ne[1]];

  const markersAndClusters = state.index?.getClusters(
    [westLng, southLat, eastLng, northLat],
    Math.floor(mapState?.zoom ?? 0),
  );

  const displayElements = (markersAndClusters || []).map((markerOrCluster) => {
    let displayElement;
    const isCluster = markerOrCluster?.properties?.cluster;
    const pixelOffset = latLngToPixel?.(markerOrCluster.geometry.coordinates as Point);
    if (isCluster) {
      const clusterElementKey = markerOrCluster.geometry.coordinates.toString();
      displayElement = (
        <DefaultClusterMarker
          key={clusterElementKey}
          count={markerOrCluster.properties.point_count}
          pixelOffset={pixelOffset}
          renderFunction={renderFunction}
        />
      );
    } else {
      displayElement = cloneElement(state.pointsMap?.[markerOrCluster.id!].vNode, {
        left: pixelOffset?.[0],
        top: pixelOffset?.[1],
      });
    }
    return displayElement;
  });

  return (
    <div
      className={className}
      style={{ position: "absolute", height: mapState?.height, width: mapState?.width }}
    >
      {displayElements}
    </div>
  );
};
