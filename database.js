// SINGLETON para reutilizar la conexion
const mongoose = require("mongoose");

class Database {

  constructor(){
    this.connect();
  }

  connect() {
    mongoose
      .connect(
        "mongodb+srv://admin:dwitteradmin@dwittercluster.hoqbb.mongodb.net/DwitterDB?retryWrites=true&w=majority"
      )
      .then(() => console.log("Conectado a MongoDB"))
      .catch(() => console.log("Error en MongoDB"));
  }
}

module.exports = new Database();
