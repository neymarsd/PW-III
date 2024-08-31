import mongoose from "mongoose";
const { Schema } = mongoose;

// define os schemas
const DistrictSchema = new Schema({
  name: {
   type: String,
   maxlength: [30, "O nome pode ter no máximo 30 caracteres"],
   required: [true, "O nome é obrigatório"]    
 }
});

const CitySchema = new Schema({
  name: {
   type: String,
   maxlength: [30, "O nome pode ter no máximo 30 caracteres"],
   required: [true, "O nome é obrigatório"]    
 },
 districts: [ DistrictSchema]
});

const StateSchema = new Schema({
   name: {
    type: String,
    maxlength: [20, "O nome pode ter no máximo 20 caracteres"],
    unique: true,
    required: [true, "O nome é obrigatório"]    
  },
  cities: [CitySchema]
});

// mongoose.model compila o modelo
const State = mongoose.model("State", StateSchema);
const City = mongoose.model("City", CitySchema);
const District = mongoose.model("District", DistrictSchema);

export { State, City, District };
