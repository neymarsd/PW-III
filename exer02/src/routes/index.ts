import { Router, Request, Response } from "express";
import state from "./state";
import city from "./city";
import district from "./district";

const routes = Router();

routes.use("/estado", state);
routes.use("/cidade", city);
routes.use("/bairro", district);

//aceita qualquer método HTTP ou URL
routes.use( (_:Request,res:Response) => res.json({error:"Requisição desconhecida"}) );

export default routes;
