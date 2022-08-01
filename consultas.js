// TODO - OBJETO CONFIGURACION PARAMETROS BD
const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "admin",
  port: 5432,
  database: "bancosolar",
});

// TODO - METODO PARA PROBAR CONEXION CON BD
const getDate = async () => {
  const result = await pool.query("SELECT NOW()");
  return result;
};

// TODO - AGREGAR USUARIO
const agregarUsuarios = async (datos) => {
  const values = Object.values(datos);
  const consulta = {
    text: "INSERT INTO usuarios (nombre,balance) VALUES ($1,$2)",
    values,
  };
  const result = await pool.query(consulta);
  return result;
};

// TODO - CONSULTAR
const consultaUsuarios = async () => {
  const result = await pool.query("SELECT * FROM usuarios");
  return result;
};

// TODO - ACTUALIZAR
const editarUsuarios = async (id, datos) => {
  const values = Object.values(datos);
  const consulta = {
    text: `UPDATE usuarios SET
    nombre = $1,
    balance = $2
    WHERE id = ${id} RETURNING *`,
    values,
  };
  const result = await pool.query(consulta);
  return result;
};

// TODO - ELIMINAR Y TRANSFERENCIAS
const eliminarUsuario = async (id) => {
  const values = [id];
  const consultaEliminarUsuario = {
    text: `DELETE FROM usuarios WHERE id = $1`,
    values,
  };

  const consultaEliminarTransferencias = {
    text: `DELETE FROM transferencias WHERE emisor = $1 OR receptor = $1`,
    values,
  };

  try {
    await pool.query("BEGIN");
    await pool.query(consultaEliminarTransferencias);
    await pool.query(consultaEliminarUsuario);
    await pool.query("COMMIT");
    return true;
  } catch (error) {
    console.log(error);
    await pool.query("ROLLBACK");
  }

  // const result = await pool.query(`DELETE FROM usuarios WHERE id = '${id}'`);
  // return result;
};

//  * TRANSFERENCIAS

// TODO - AGREGAR TRANSFERENCIA Y MODIFICAR BALANCE EN USUARIOS
const registrarTransferencia = async (transferencia) => {
  const values = Object.values(transferencia);
  console.log(values);
  const consultaRegistrarTransferenciaHistorial = {
    text: "INSERT INTO transferencias (emisor,receptor,monto,fecha) VALUES ($1,$2,$3,CURRENT_TIMESTAMP)",
    values: [Number(values[0]), Number(values[1]), Number(values[2])],
  };

  const consultaTransferenciaUsuarioEmisor = {
    text: "UPDATE usuarios SET balance = balance - $1 WHERE id = $2",
    values: [Number(values[2]), Number(values[0])],
  };

  const consultaTransferenciaUsuarioReceptor = {
    text: "UPDATE usuarios SET balance = balance + $1 WHERE id = $2",
    values: [Number(values[2]), Number(values[1])],
  };

  try {
    await pool.query("BEGIN");
    await pool.query(consultaRegistrarTransferenciaHistorial);
    await pool.query(consultaTransferenciaUsuarioEmisor);
    await pool.query(consultaTransferenciaUsuarioReceptor);
    await pool.query("COMMIT");
    return true;
  } catch (error) {
    console.log(error);
    await pool.query("ROLLBACK");
  }
};

// TODO - CONSULTAR HISTORIAL DE TRANSFERENCIAS
const consultaHistorialTransferencias = async () => {
  const consulta = {
    text: "SELECT emisor.nombre,emisor,receptor.nombre receptor,monto,fecha FROM transferencias as t JOIN usuarios emisor ON t.emisor = emisor.id JOIN usuarios receptor on t.receptor = receptor.id;",
    rowMode: "array",
  };
  const { rows } = await pool.query(consulta);
  return rows;
};

module.exports = {
  getDate,
  agregarUsuarios,
  consultaUsuarios,
  editarUsuarios,
  eliminarUsuario,
  registrarTransferencia,
  consultaHistorialTransferencias,
};
