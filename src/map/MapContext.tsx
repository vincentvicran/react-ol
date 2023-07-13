import {createContext} from 'react'
import {Map} from 'ol'

const map = new Map()

export const MapContext = createContext(map)
