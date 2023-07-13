import * as olSource from 'ol/source'
import {Options} from 'ol/source/XYZ'

function xyz({url, attributions, maxZoom, ...rest}: Options) {
  return new olSource.XYZ({url, attributions, maxZoom, ...rest})
}

export default xyz
