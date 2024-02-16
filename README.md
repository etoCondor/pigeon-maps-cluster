# Cluster component for pigeon-maps

```
$ npm install pigeon-maps-cluster --save
```

```
import { Map, Marker } from "pigeon-maps";
import { Cluster } from "pigeon-maps-cluster";

const coordinates = [
    [lat,lng],
    [lat,lng],
    [lat,lng]
    ...
]

<Map center={[55.753544, 37.621202]}
     zoom={4}
     width={600}
     height={400}>
    <Cluster>
        {
            coordinates.map(coordinate => <Marker key={coordinate.toString()} anchor={coordinate} />)
        }
    </Cluster>
</Map>
```

## Options

| Option                | Type                                                                        | Default   | Description                                                                           |
| --------------------- | --------------------------------------------------------------------------- | --------- | ------------------------------------------------------------------------------------- |
| minZoom               | number                                                                      | 0         | Minimum zoom level at which clusters are generated.                                   |
| maxZoom               | number                                                                      | 16        | Maximum zoom level at which clusters are generated.                                   |
| minPoints             | number                                                                      | 2         | Minimum number of points to form a cluster.                                           |
| clusterMarkerRadius   | number                                                                      | 40        | Cluster radius, in pixels.                                                            |
| clusterStyleFunction  | (pointCount: number, markerPixelOffset?: [number, number]) => CSSProperties | undefined | Function that can help you to modify default cluster view.                            |
| clusterRenderFunction | (pointCount: number, markerPixelOffset?: [number, number]) => ReactElement  | undefined | Function that can help you to create your own cluster (ignores clusterStyleFunction). |
| className             | string                                                                      | undefined | Cluster container className.                                                          |
