import React, {useRef, useState, useEffect} from 'react'
import {View, Map as OLMap} from 'ol'
import {MapOptions} from 'ol/Map'
import OLMapType from 'ol/Map'
import {Coordinate} from 'ol/coordinate'

import {MapContext} from './MapContext'

import './Map.css'

interface MapProps extends MapOptions {
  children: React.ReactNode
  zoom: number
  center: Coordinate
}

export const Map = ({children, zoom, center, layers, ...rest}: MapProps) => {
  const mapRef = useRef()
  const [map, setMap] = useState<OLMapType>(null)

  // on component mount
  useEffect(() => {
    let options = {
      view: new View({zoom, center})
    }

    let mapObject = new OLMap(options)
    mapObject.setTarget(mapRef.current)
    setMap(mapObject)

    return () => mapObject.setTarget(undefined)
  }, [])

  // zoom change handler
  useEffect(() => {
    if (!map) return

    map.getView().setZoom(zoom)
  }, [zoom])

  // center change handler
  useEffect(() => {
    if (!map) return

    map.getView().setCenter(center)
  }, [center])

  return (
    <MapContext.Provider value={map}>
      <div ref={mapRef} className="ol-map">
        {children}
      </div>
    </MapContext.Provider>
  )
}
