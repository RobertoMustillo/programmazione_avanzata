import User from "../Model/user";
import {Request, Response, NextFunction} from 'express'
import Joi from 'joi'
import {StatusCodes} from 'http-status-codes'


const create = async(request:Request, response:Response, next:NextFunction)=>{
    const userSchema = Joi.object({
        nome_utente: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
        admin: Joi.boolean().required()
            }
        )
    try{
        const {error, value} = userSchema.validate(request.body)
        const MODEL ={
            nome_utente: value.nome_utente,
            email: value.email,
            password: value.password
        }
        try{
         const USER = await User.create(MODEL)
         console.log("Ciao")
         return response.status(StatusCodes.OK).json(USER)
        }catch(error){
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
        }
    }catch(error){
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }


}

const getAll = async(request:Request, response:Response, next:NextFunction)=>{
    try{
        const ALL = await User.findAll()
        return response.status(StatusCodes.OK).json(ALL)
    }catch(error){
        //return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}
const usContr={
    create,
    getAll
}
export default  usContr