import React, {useCallback, useContext, useEffect, useState} from 'react'
import jsPDF from 'jspdf'
import OLImageStatic from 'ol/source/ImageStatic'
import * as OLProj from 'ol/proj'

import {Map} from './map'
import {Layers, TileLayer, VectorLayer} from './layers'
import {Style, Icon} from 'ol/style'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import {osm, vector, xyz} from './source'
import {fromLonLat, get} from 'ol/proj'
import GeoJSON from 'ol/format/GeoJSON'
import {Controls, FullScreenControl} from './controls'
import FeatureStyles from './features/Styles'

import mapConfig from './config.json'
import './App.css'
import {MapContext} from 'map/MapContext'
import {ImageLayer} from 'layers/ImageLayer'

const geojsonObject = mapConfig.geojsonObject
const geojsonObject2 = mapConfig.geojsonObject2
const markersLonLat = [mapConfig.kansasCityLonLat, mapConfig.blueSpringsLonLat]

function addMarkers(lonLatArray: number[][]) {
  var iconStyle = new Style({
    image: new Icon({
      anchorXUnits: 'fraction',
      anchorYUnits: 'pixels',
      src: mapConfig.markerImage32,
      crossOrigin: 'anonymous'
    })
  })
  let features = lonLatArray.map((item) => {
    let feature = new Feature({
      geometry: new Point(fromLonLat(item))
    })
    feature.setStyle(iconStyle)
    return feature
  })
  return features
}

const App = () => {
  const map = useContext(MapContext)

  const [center, setCenter] = useState(mapConfig.center)
  const [zoom, setZoom] = useState(1)

  const [showLayer1, setShowLayer1] = useState(true)
  const [showLayer2, setShowLayer2] = useState(true)
  const [showMarker, setShowMarker] = useState(false)

  const [features, setFeatures] = useState(addMarkers(markersLonLat))

  const dims = {
    a0: [1189, 841],
    a1: [841, 594],
    a2: [594, 420],
    a3: [420, 297],
    a4: [297, 210],
    a5: [210, 148]
  }
  const format = 'a4'
  const resolution = 72
  const downloadPDF = useCallback(() => {
    // if (!!map) return
    const dim = dims['a4']
    const width = Math.round((dim[0] * resolution) / 25.4)
    const height = Math.round((dim[1] * resolution) / 25.4)
    const size = map.getSize()
    const viewResolution = map.getView().getResolution()
    console.log('all values', {viewResolution, size})

    // map.once('rendercomplete', function () {
    console.log('rendercomplete')
    const mapCanvas = document.createElement('canvas')
    mapCanvas.width = width
    mapCanvas.height = height
    const mapContext = mapCanvas.getContext('2d')
    Array.prototype.forEach.call(
      document.querySelectorAll('.ol-layer canvas'),
      function (canvas) {
        console.log({canvas})

        if (canvas.width > 0) {
          const opacity = canvas.parentNode.style.opacity
          mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity)
          const transform = canvas.style.transform
          // Get the transform parameters from the style's transform matrix
          const matrix = transform
            .match(/^matrix\(([^\(]*)\)$/)[1]
            .split(',')
            .map(Number)
          // Apply the transform to the export map context
          CanvasRenderingContext2D.prototype.setTransform.apply(
            mapContext,
            matrix
          )
          mapContext.drawImage(canvas, 0, 0)
        }
      }
    )
    mapContext.globalAlpha = 1
    mapContext.setTransform(1, 0, 0, 1, 0, 0)
    const pdf = new jsPDF('landscape', undefined, format)
    pdf.addImage(
      mapCanvas.toDataURL('image/jpeg'),
      'JPEG',
      0,
      0,
      dim[0],
      dim[1]
    )
    pdf.save('map.pdf')
    console.log('pdf save')
    // Reset original map size
    map.setSize(size)
    map.getView().setResolution(viewResolution)
    // })
  }, [map])

  const createPDF = () => {
    const image = require('assets/test-layer.png')

    console.log({image})

    const pdf = new jsPDF(
      image.width > image.height ? 'landscape' : 'portrait',
      undefined,
      format
    )
    pdf.addImage(image, 'JPEG', 0, 0, image.width, image.height)

    //! RECTANGLE
    pdf.setDrawColor(255, 140, 0)
    pdf.setFillColor(255, 140, 0)
    pdf.roundedRect(16, 12, 8, 6, 1, 1, 'FD')

    //! TEXT
    // pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(10)
    pdf.setTextColor(255, 255, 255)
    pdf.text('28', 18, 16, {maxWidth: 40})

    //! CIRCLE
    pdf.setDrawColor(0, 0, 0)
    pdf.setFillColor(0, 0, 0)
    pdf.circle(20, 20, 1, 'FD')

    pdf.save('map.pdf')
  }

  useEffect(() => {
    console.log({map})
  }, [map])

  return (
    <div>
      <button onClick={createPDF}>Create</button>
      <Map center={fromLonLat(center)} zoom={zoom}>
        <Layers>
          <TileLayer
            // source={osm()}
            source={xyz({
              url: 'https://smart-clerk-bucket.s3.ap-south-1.amazonaws.com/projects/11/plans/25/fptiles/{z}/{x}/{y}.png'
            })}
            zIndex={0}
          />
          {/* <ImageLayer
            source={
              new OLImageStatic({
                url: 'images/MAP/DYNAMIC/T_1.png',
                imageSize: [1239, 748],
                imageExtent: [
                  -14483048.34, 2291674.487, -6775420.041, 6947393.399
                ],
                projection: OLProj.get('EPSG:3857')
              })
            }
            zIndex={0}
          /> */}
          {showLayer1 && (
            <VectorLayer
              source={vector({
                //@ts-ignore
                features: new GeoJSON().readFeatures(geojsonObject, {
                  featureProjection: get('EPSG:3857')
                })
              })}
              style={FeatureStyles.MultiPolygon}
            />
          )}
          {showLayer2 && (
            <VectorLayer
              source={vector({
                //@ts-ignore
                features: new GeoJSON().readFeatures(geojsonObject2, {
                  featureProjection: get('EPSG:3857')
                })
              })}
              style={FeatureStyles.MultiPolygon}
            />
          )}
          {showMarker && (
            <VectorLayer
              source={vector(
                //@ts-ignore
                {features}
              )}
            />
          )}
        </Layers>
        <Controls>
          <FullScreenControl />
        </Controls>
      </Map>
      <div>
        <input
          type="checkbox"
          checked={showLayer1}
          onChange={(event) => setShowLayer1(event.target.checked)}
        />{' '}
        Johnson County
      </div>
      <div>
        <input
          type="checkbox"
          checked={showLayer2}
          onChange={(event) => setShowLayer2(event.target.checked)}
        />{' '}
        Wyandotte County
      </div>
      <hr />
      <div>
        <input
          type="checkbox"
          checked={showMarker}
          onChange={(event) => setShowMarker(event.target.checked)}
        />{' '}
        Show markers
      </div>

      <button onClick={downloadPDF}>Download</button>
    </div>
  )
}

export default App
