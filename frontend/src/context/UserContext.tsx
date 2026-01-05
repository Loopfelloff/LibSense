import {createContext} from 'react'
export type userContext = {
    loggedIn : boolean;
    id : string;
    email : string;
    firstName : string;
    middleName : string;
    lastName : string;
    profilePicLink : string;
}
export const UserContext  = createContext<userContext | null>(null)
