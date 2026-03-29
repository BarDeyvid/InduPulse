import { DeckGL, ZoomWidget } from '@deck.gl/react';
import { MapView, FirstPersonView } from '@deck.gl/core';
import type { MapViewState, FirstPersonViewState } from '@deck.gl/core';
import { LineLayer } from '@deck.gl/layers';

import { Map } from 'react-map-gl/mapbox'; 
import mapboxgl from 'mapbox-gl'; 
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAP_BOX_TOKEN;

interface MyData {
  from: [number, number];
  to: [number, number];
}

const INITIAL_VIEW_STATE: {
  map: MapViewState;
  'first-person': FirstPersonViewState;
} = {
  map: {
    longitude: -49.09402620245169,
    latitude: -26.478484049936593,
    zoom: 15,
    pitch: 45,
    bearing: 185
  },
  'first-person': {
    longitude: -49.09402620245169,
    latitude: -26.478484049936593,
    position: [0, 0, 50], // Sobe a câmera para 50m
    bearing: 0,
    pitch: 20 // Inclina um pouco para baixo para tentar ver a linha
  }
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
    new MapView({ id: 'map', width: '50%', controller: true }),
    new FirstPersonView({ id: 'first-person', width: '50%', x: '50%', controller: true, fovy: 50 })
  ];

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative' }}>
      <DeckGL
        layers={layers}
        views={views}
        initialViewState={INITIAL_VIEW_STATE}
      >
        <Map 
          mapLib={mapboxgl} 
          mapboxAccessToken={MAPBOX_TOKEN} 
          mapStyle="mapbox://styles/mapbox/dark-v11" 
        />

        <ZoomWidget />
      </DeckGL>
    </div>
  );
}