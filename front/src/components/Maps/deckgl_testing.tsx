import { DeckGL, ZoomWidget } from '@deck.gl/react';
import { MapView } from '@deck.gl/core'; 
import type { MapViewState } from '@deck.gl/core'; 
import { LineLayer } from '@deck.gl/layers';

import { Map, Layer } from 'react-map-gl/mapbox'; 
import mapboxgl from 'mapbox-gl'; 
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAP_BOX_TOKEN;

interface MyData {
  from: [number, number];
  to: [number, number];
}

const INITIAL_VIEW_STATE: MapViewState = {
  longitude: -49.09402620245169,
  latitude: -26.478484049936593,
  zoom: 17.5,
  pitch: 65, 
  bearing: 185
};

export default function DGMap() {
  const layers = [
    new LineLayer<MyData>({
      id: 'line-layer',
      data: [{ from: [-49.09402620245169, -26.478484049936593], to: [-49.09076828784966, -26.478437091453106] }],
      getSourcePosition: (d: MyData) => d.from,
      getTargetPosition: (d: MyData) => d.to,
      getColor: [0, 255, 255],
      getWidth: 5
    })
  ];

  const views = [
    new MapView({ id: 'map', width: '100%', controller: true })
  ];

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative' }}>
      <DeckGL
        layers={layers}
        views={views}
        initialViewState={{ map: INITIAL_VIEW_STATE }}
      >
        <Map 
          mapLib={mapboxgl} 
          mapboxAccessToken={MAPBOX_TOKEN} 
          mapStyle="mapbox://styles/mapbox/dark-v11" 
        >
          <Layer 
            id="3d-buildings"
            source="composite"
            source-layer="building"
            filter={['==', 'extrude', 'true']}
            type="fill-extrusion"
            minzoom={15}
            paint={{
              'fill-extrusion-color': '#444444', 
              'fill-extrusion-height': ['get', 'height'],
              'fill-extrusion-base': ['get', 'min_height'],
              'fill-extrusion-opacity': 0.6
            }}
          />
        </Map>

        <ZoomWidget />
      </DeckGL>
    </div>
  );
}