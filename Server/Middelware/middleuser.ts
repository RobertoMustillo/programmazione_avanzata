import jwt from 'jsonwebtoken'
import {Request, Response, NextFunction} from 'express'
import controllerUser from '../Controller/controllerUser'
import {StatusCodes} from 'http-status-codes'
import prova from '../Factory/FactoryError'

const controllo_token = async (req: any, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null){
        return res.status(StatusCodes.UNAUTHORIZED).json({error:prova.getErrore(401).stampaMex()});
    }else{
        jwt.verify(token, process.env.KEY as string || "ciao", (err: any) => {
        if (err){
            return res.status(StatusCodes.FORBIDDEN).json({error:"Token errato"});   
        }else{
            const check : any = jwt.verify(token, process.env.KEY as string || "ciao");
            (req as any).params.id = check.id
            next();
        } 
        });
    } 
    
  }



const controllo_admin = async (request: Request, response: Response, next: NextFunction) => {
    const USER = await controllerUser.getById(parseInt((request as any).params.id))
    if (USER?.get("admin") === true) {
        next()
    } else {
        response.status(StatusCodes.UNAUTHORIZED).json({error: prova.getErrore(401).stampaMex()})
    }
}



const isProprietario = async (req: Request, res: Response, next: NextFunction) => {
    const USERID = (req as any).query.id
    try {
        const user = await controllerUser.getById(parseInt(USERID))
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Utente non trovato.' })
        }
        const userID = (req as any).params.id
        if ((user as any).id == userID) {
            next()
        } else {
            res.status(StatusCodes.FORBIDDEN).json({
                message: "Non sei il proprietario."
            })
        }
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Ritentare" })
    }
}

// Controllo dei crediti di un'utente  per il caricamento dei files
const controllo_crediti = async (request: Request, response: Response, next: NextFunction) => {
    const crediti = await controllerUser.ottieniCreditoByID((request.params as any).uid)
    if((request.query as any).tipo === 0){
        if (crediti >=11){
            next()
        } else {
            response.status(StatusCodes.UNAUTHORIZED).send({erro: prova.getErrore(401).stampaMex() })
        } 
    }else if((request.query as any).tipo === 1){
        if (crediti >= (0.05*20)){
            next()
        } else {
            response.status(StatusCodes.UNAUTHORIZED).send({ message: 'Crediti non sufficienti.' })
        } 
    }
}

const middlex = {
    controllo_token,
    controllo_admin,
    isProprietario,
    controllo_crediti
}
export default middlex