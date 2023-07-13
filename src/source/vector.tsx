import {Vector as VectorSource} from 'ol/source'
import {Options} from 'ol/source/VectorTile'
import {ReadOptions} from 'ol/format/Feature'

function vector(options?: Options) {
  return new VectorSource({
    ...options
  })
}

export default vector
