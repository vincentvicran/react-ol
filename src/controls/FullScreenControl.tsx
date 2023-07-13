import React, {useContext, useEffect, useState} from 'react'
import {FullScreen} from 'ol/control'
import {MapContext} from '../map/MapContext'

export const FullScreenControl = () => {
  const map = useContext(MapContext)

  useEffect(() => {
    if (!map) return () => {}

    let fullScreenControl = new FullScreen({})

    //@ts-ignore
    map.controls.push(fullScreenControl)

    //@ts-ignore
    return () => map.controls.remove(fullScreenControl)
  }, [map])

  return <div />
}
