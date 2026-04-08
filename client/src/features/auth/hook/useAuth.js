import { useDispatch } from "react-redux";
import {register,login,getMe} from '../services/auth.api'
import {setUser,setLoading,setError} from '../auth.slice'

function getErrorMessage(err, fallbackMessage) {
    const validationMessage = err.response?.data?.errors?.[0]?.msg
    return validationMessage || err.response?.data?.message || fallbackMessage
}

export function useAuth(){
    const dispatch=useDispatch()


    async function handleRegister({username,email,password}){
        try{
            dispatch(setLoading(true))
            dispatch(setError(null))
            const data=await register({username,email,password})
            return data
        }catch(err){
            const message = getErrorMessage(err, "Registration failed")
            dispatch(setError(message))
            throw new Error(message)
        }finally{
            dispatch(setLoading(false))
        }
    }
    

    async function handleLogin({email,password}){
        try{
            dispatch(setLoading(true))
            dispatch(setError(null))
            const data=await login({email,password})
            dispatch(setUser(data.user))
            return data
        }
        catch(err){
            const message = getErrorMessage(err, "Login failed")
            dispatch(setError(message))
            throw new Error(message)
        }finally{
            dispatch(setLoading(false))
        }
    }

    async function handlegetMe()
    {
        try{
            dispatch(setLoading(true))
            dispatch(setError(null))
            const data=await getMe()
            dispatch(setUser(data.user))
            return data
        }
           catch(err){
            const message = getErrorMessage(err, "Failed to fetch user")
            dispatch(setError(message))
            throw new Error(message)
        }finally{
            dispatch(setLoading(false))
        }
    }
    return {handleLogin,handleRegister,handlegetMe}
}

