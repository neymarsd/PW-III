import { Request, Response } from "express";
import { State } from "../models";

class DistrictController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { city, name } = req.body;
    try {
      const response = await State.updateOne(
        { "cities._id": city },
        {
          $push: {
            // O $ está sendo usado para representar o operador de posição em relação a cities.
            // Ele identifica o elemento específico dentro do array cities que atende à condição de consulta.
            "cities.$.districts": { name },
          },
        },
        { runValidators: true }
      );
      if (response && response.modifiedCount > 0) {
        return res.json({ message: "Bairro adicionado com sucesso" });
      } else {
        console.log(response);
        return res.json({ message: "Não foi possível adicionar o bairro" });
      }
    } catch (error: any) {
      if (error && error.errors["cities.$.districts.name"]) {
        return res.json({
          message: error.errors["cities.$.districts.name"].message,
        });
      }
      return res.json({ message: error });
    }
  }

  public async list(req: Request, res: Response): Promise<Response> {
    const { city } = req.body;
    try {
      const objects = await State.find({
        "cities._id": city,
      }).select("cities._id cities.name cities.districts");
      return res.json(objects);
    } catch (error: any) {
      return res.json({ message: error.message });
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { city, district } = req.body; // _id do registro a ser excluído
    try {
      const response = await State.updateOne(
        { "cities._id": city },
        {
          $pull: {
            "cities.$.districts": { _id: district },
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
    const { city, district, name } = req.body;
    try {
      const response = await State.updateOne(
        { "cities._id": city, "cities.districts._id": district },
        {
          $set: {
            "cities.$[city].districts.$[district].name": name,
          },
        },
        { 
          arrayFilters: [
            { "city._id": city },
            { "district._id": district },
          ],
          runValidators: true 
        }
      );
      if (response && response.modifiedCount > 0) {
        return res.json({ message: "Registro atualizado com sucesso" });
      } else if (response && response.matchedCount == 0) {
        return res.json({ message: "Registro não localizado" });
      } else {
        return res.json({ message: "Não foi possível atualizar o registro" });
      }
    } catch (error: any) {
      console.log(error.message)
      if (error && error.errors) {
        return res.json({
          message: error.errors,
        });
      }
      return res.json({ message: error });
    }
  }
}

export default new DistrictController();
