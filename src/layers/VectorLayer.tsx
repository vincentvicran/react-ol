import {useContext, useEffect} from 'react'
import OLVectorLayer from 'ol/layer/Vector'
import {Options} from 'ol/layer/VectorTile'
import VectorSource from 'ol/source/Vector'
import {Geometry} from 'ol/geom'

import {MapContext} from '../map/MapContext'

export const VectorLayer = ({
  source,
  style,
  zIndex = 0,
  ...rest
}: //@ts-ignore
Options<VectorSource<Geometry>>): null => {
  const map = useContext(MapContext)

  useEffect(() => {
    if (!map) return () => {}

    let vectorLayer = new OLVectorLayer({
      source,
      style,
      ...rest
    })

    map.addLayer(vectorLayer)
    vectorLayer.setZIndex(zIndex)

    return () => {
      if (map) {
        map.removeLayer(vectorLayer)
      }
    }
  }, [map])

  return null
}
