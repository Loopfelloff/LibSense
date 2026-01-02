import {createContext} from 'react'
import type { userContext } from './AuthContext'
export const UserContext  = createContext<userContext | null>(null)
