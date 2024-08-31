import { Request, Response } from "express";
import { State } from "../models";

class StateController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { state: _id, name } = req.body;
    try {
      const response = await State.updateOne(
        { _id },
        {
          $push: {
            cities: { name },
          },
        },
        { runValidators: true }
      );
      console.log("response", response)
      if (response && response.modifiedCount > 0) {
        return res.json({ message: "Cidade adicionada com sucesso" });
      } else {
        return res.json({ message: "Não foi possível adicionar a cidade" });
      }
    } catch (error: any) {
      if (error && error.errors["cities.name"]) {
        return res.json({
          message: error.errors["cities.name"].message,
        });
      }
      return res.json({ message: error });
    }
  }

  public async list(req: Request, res: Response): Promise<Response> {
    const { state: _id } = req.body;
    try {
      const objects = await State.find({ _id }).select("cities._id cities.name");
      return res.json(objects);
    } catch (error: any) {
      return res.json({ message: error.message });
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { state, city } = req.body; // _id do registro a ser excluído
    try {
      const response = await State.updateOne(
        { _id: state },
        {
          $pull: {
            cities: { _id: city },
          },
        }
      );
      if (response && response.modifiedCount > 0) {
        return res.json({ message: "Registro excluído com sucesso" });
      } else {
        return res.json({ message: "Registro inexistente" });
      }
    } catch (error: any) {
      return res.json({ message: error.message });
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { city, name } = req.body;
    try {
      const response = await State.updateOne(
        { "cities._id": city },
        {
          $set: {
            // o $ refere-se ao operador de posição no array
            "cities.$.name": name,
          },
        },
        { runValidators: true }
      );
      if (response && response.modifiedCount > 0) {
        return res.json({ message: "Registro atualizado com sucesso" });
      } else {
        return res.json({ message: "Não foi possível atualizar o registro" });
      }
    } catch (error: any) {
      if (error && error.errors["cities.0.name"]) {
        return res.json({
          message: error.errors["cities.0.name"].message,
        });
      }
      return res.json({ message: error });
    }
  }
}

export default new StateController();
