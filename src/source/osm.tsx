import * as olSource from 'ol/source'

import {Options} from 'ol/source/OSM'

function osm(options?: Options) {
  return new olSource.OSM({...options})
}

export default osm
