import jwt from 'jsonwebtoken'
import {Request, Response, NextFunction} from 'express'
import {StatusCodes} from 'http-status-codes'
import allVariable from '../Controller/controllerDataset'
import prova from '../Factory/FactoryError'

const controllo_token = async (req: Request, res: Response, next: NextFunction) => {
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
            (req as any).params.uid = check.id
            next();
        } 
        });
    }  
  }

const isProprietario = async (req: Request, res: Response, next: NextFunction) => {
    const datasetID = (req as any).query.id
    try {
        const dataset = await allVariable.getById(parseInt(datasetID))
        if (!dataset) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Dataset non trovato.' })
        }
        const userID = (req as any).params.uid
        if ((dataset as any).uid == userID) {
            next()
        } else {
            res.status(StatusCodes.FORBIDDEN).json({
                message: 'Non sei il proprietario del dataset.'
            })
        }
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Ritenta" })
    }
}

const middlex = {
    controllo_token,
    isProprietario
}
export default middlex