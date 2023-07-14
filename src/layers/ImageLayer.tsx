import {useContext, useEffect} from 'react'
import OLImageLayer from 'ol/layer/Image'

import {MapContext} from '../map/MapContext'

export const ImageLayer = ({source, zIndex = 0}: any) => {
  const map = useContext(MapContext)

  useEffect(() => {
    if (!map) return () => {}

    let imageLayer = new OLImageLayer({
      source,
      zIndex
    })

    map.addLayer(imageLayer)
    imageLayer.setZIndex(zIndex)

    return () => {
      if (map) {
        map.removeLayer(imageLayer)
      }
    }
  }, [map])

  return <div />
}
