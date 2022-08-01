// TODO - IMPORTACION Y CREACION DE SERVIDOR NODE CON EXPRESS
const express = require("express");
const app = express();
app.listen(3000, () => {
  console.log("Server On");
});

// TODO - IMPORTACION DE MODULO/FUNCIONES
const {
  getDate,
  agregarUsuarios,
  consultaUsuarios,
  editarUsuarios,
  eliminarUsuario,
  registrarTransferencia,
  consultaHistorialTransferencias,
} = require("./consultas");

// TODO - Middleware que permita recibir payloads en las rutas del servidor
app.use(express.json());

// TODO - RUTA DE PRUEBA PARA VERIFICAR CONEXION CON LA BD
app.get("/prueba", async (req, res) => {
  const result = await getDate();
  res.send(result.rows[0].now);
});

// TODO - RUTA INICIAL PARA DISPONIBILIZAR HTML A UTILIZAR
app.get("/", (req, res) => {
  res.status(200).sendFile(__dirname + "/index.html");
});

// TODO - INSERT
app.post("/usuario", async (req, res) => {
  try {
    const datos = req.body;
    const respuesta = await agregarUsuarios(datos);
    res.status(201).send(respuesta);
  } catch (error) {
    console.log(error);
    res.status(500).send("Algo salió mal :/ ...");
  }
});

// TODO - SELECT
app.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await consultaUsuarios();
    res.status(200).json(usuarios.rows);
  } catch (error) {
    res.status(500).send("Algo salió mal :/ ...");
  }
});

// TODO - UPDATE
app.put("/usuario", async (req, res) => {
  try {
    const datos = req.body;
    const id = req.query;
    const respuesta = await editarUsuarios(id, datos);
    res.status(201).send(respuesta);
  } catch (error) {
    console.log(error);
    res.status(500).send("Algo salió mal :/ ...");
  }
});

// TODO - DELETE
app.delete("/usuario", async (req, res) => {
  try {
    const { id } = req.query;
    const respuesta = await eliminarUsuario(id);
    res.status(200).json(respuesta);
  } catch (error) {
    console.log(error);
    res.status(500).send("Algo salió mal :/ ..." + error);
  }
});

// TODO - TRANSFERENCIAS

// TODO - POST TRANSFERENCIA + UPDATE BALANCE USUARIOS
app.post("/transferencia", async (req, res) => {
  try {
    const transferencia = req.body;
    console.log(transferencia);
    const respuesta = await registrarTransferencia(transferencia);
    res.status(201).send(respuesta);
  } catch (error) {
    console.log(error);
    res.status(500).send("Algo salió mal :/ ..." + error);
  }
});

// TODO - SELECT TRANSFERENCIAS
app.get("/transferencias", async (req, res) => {
  try {
    const historial = await consultaHistorialTransferencias();
    res.status(200).json(historial);
  } catch (error) {
    res.status(500).send("Algo salió mal :/ ..." + error);
  }
});
