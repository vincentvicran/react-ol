import {useContext, useEffect} from 'react'
import OLTileLayer from 'ol/layer/Tile'

import {MapContext} from '../map/MapContext'

export const TileLayer = ({source, zIndex = 0}: any) => {
  const map = useContext(MapContext)

  useEffect(() => {
    if (!map) return () => {}

    let tileLayer = new OLTileLayer({
      source,
      zIndex
    })

    map.addLayer(tileLayer)
    tileLayer.setZIndex(zIndex)

    return () => {
      if (map) {
        map.removeLayer(tileLayer)
      }
    }
  }, [map])

  return <div />
}
