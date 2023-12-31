import express, { NextFunction, Request, Response } from 'express';
import user from './Server/Router/routerUsers';
import dataset from './Server/Router/routerDataset'
import model from './Server/Router/routerModel'
import {DatabaseSingleton}  from './Server/Singleton/databaseSingleton';
//import sequelize from './utils/database'

// Constants
//const PORT = 8080;
//const HOST = '0.0.0.0';

// App
const app = express();

app.use(express.json())

app.use(express.urlencoded({extended: true}))

/*app.use((req:Request, res:Response, next:NextFunction)=>{
  //res.set('Acces-Control-Allow-Origin', '*')
  //res.set('Acces-Control-Allow-Origin','GET, POST, PUT, DELETE')
})*/


app.get('/', (req: Request, res: Response) => {
  res.send('Hello World')
});

app.use('/user', user)
app.use('/dataset', dataset);
app.use('/model', model);


(async()=>{
  try{
    const sequelize = DatabaseSingleton.getIstanza().getConnessione()

    await sequelize.sync({alter: true})

    app.listen(8080, () => {
      console.log(`Server running on`);
      /*sequelize.authenticate().then(()=>{
        console.log("database connected")
      })*/
    
    });
  }catch(error){
    console.log(error)
  }
})()