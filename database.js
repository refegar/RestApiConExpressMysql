const mysql = require('mysql2')
const dotenv = require('dotenv')
const bcrypt = require('bcrypt')
dotenv.config()

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
}).promise()

async function getNotes(){
const [rows] = await pool.query("SELECT * FROM usuarios")
return rows
}
async function getTecnology(){
  const [rows] = await pool.query("SELECT * FROM tecnologias")
  return rows 
}
async function perfilDescri(){
  const [rows] = await pool.query("SELECT * FROM perfilcv")
  return rows 
}

async function proyectsDescri(){
  const [rows] = await pool.query("SELECT * FROM proyectos order by id desc")
  return rows 
}
async function getSession(id){
  const [rows] = await pool.query(`SELECT token from usuarios where  id = ?`
  ,[id])
  return rows[0]
  }

 async function getNote(id){
  const [rows] = await pool.query(`
  SELECT * FROM usuarios
  WHERE id = ?
  `, [id])
  return rows[0]
}

async function getProyect(id){
  const [rows] = await pool.query(`
  SELECT * FROM proyectos
  WHERE id = ?
  `, [id])
  return rows[0]
}

 async function createNote(nombre,correo,contrasena) {
  const [result] = await pool.query(`
  INSERT INTO usuarios (nombre,correo,contrasena)
  VALUES (?, ?, ?)
  `, [nombre,correo,contrasena])
  const id = result.insertId
  return getNote(id)
}
////////////////////////////////////////////////////////////

async function getProyecto(id){
  const [rows] = await pool.query(`
  SELECT * FROM proyectos
  WHERE id = ?
  `, [id])
  return rows[0]
}
//////////////////////////////////////////////////////////

async function updateProyecto(id, { img, titulo, descripcion, github, enlinea, madewith }) {
  try {
    const [result] = await pool.query(`
      UPDATE proyectos
      SET img = ?, titulo = ?, descripcion = ?, github = ?, enlinea = ?, madewith = ?
      WHERE id = ?
    `, [img, titulo, descripcion, github, enlinea, madewith, id]);

    // Verificar si se actualizó correctamente el usuario
    if (result.affectedRows === 0) {
      throw new Error(`No se encontró ningún proyecto con el ID ${id}`);
    }

    // Obtener el proyecto actualizado
    return await getProyect(id);
  } catch (error) {
    console.error('Error al actualizar el proyecto:', error);
    throw error;
  }
}

//////////////////////////////////////////////////////////

async function newProyecto( img, titulo, descripcion, github, enlinea, madewith ) {
  try {
    const [result] = await pool.query(`
      insert into proyectos (img,titulo,descripcion,github,enlinea,madewith)
      values (?, ?, ?, ?, ?,  ?)
    `, [img, titulo, descripcion, github, enlinea, madewith]);

    // Verificar si se creo correctamente el usuario
    /*
    if (result.affectedRows === 0) {
      throw new Error(`No se encontró ningún proyecto recien creado con la ID ${id}`);
    }*/

    // Obtener el proyecto actualizado
    return result
  } catch (error) {
    console.error('Error al crear el proyecto:', error);
    throw error;
  }
}

//////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////
/////Sistema de borrado

async function deleteProyecto(id) {
  try {
    const [result] = await pool.query(`
      DELETE FROM proyectos WHERE id = ?

    `, [id]);

    // Verificar si se actualizó correctamente el usuario
    if (result.affectedRows === 0) {
      throw new Error(`No se encontró ningún proyecto con el ID ${id}`);
    }

     // Ajustar el valor de AUTO_INCREMENT
     await pool.query(`
      ALTER TABLE proyectos AUTO_INCREMENT = ${id};
    `);

    // Obtener el proyecto actualizado
    return { success: true, message: `Proyecto con ID ${id} eliminado correctamente` };
  } catch (error) {
    console.error('Error al borrar el proyecto:', error);
    throw error;
  }
}

//////////////////////////////////////////////////////////



 async function updateNote(id, nombre, correo, contrasena) {
  try {
    // Ejecutar la consulta SQL para actualizar el usuario
    const [result] = await pool.query(`
      UPDATE usuarios
      SET nombre = ?, correo = ?, contrasena = ?
      WHERE id = ?
    `, [nombre, correo, contrasena, id]);

    // Verificar si se actualizó correctamente el usuario
    if (result.affectedRows === 0) {
      throw new Error(`No se encontró ningún usuario con el ID ${id}`);
    }

    // Obtener el usuario actualizado
    return await getNote(id);
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    throw error;
  }
}
 async function updateSession(id,token) {
  try {
    // Ejecutar la consulta SQL para actualizar la sesión del usuario
    const [result] = await pool.query(`
      UPDATE usuarios
      SET token = ?
      WHERE id = ?
    `, [token, id]);

    // Verificar si se actualizó correctamente la sesión del usuario
    if (result.affectedRows === 0) {
      throw new Error(`No se encontró ningún usuario con el ID ${id}`);
    }
    // Devolver éxito
    return getSession(id)
  } catch (error) {
    console.error('Error al actualizar la sesión del usuario:', error);
    throw error;
  }
}
async function passChanges(token, passChange) {
  // Extraer la contraseña del objeto passChange
  const newPassword = passChange.contrasena;

  // Generar el hash de la nueva contraseña
  bcrypt.hash(newPassword, 10, async (err, hash) => {
    if (err) {
      console.error('Error al generar el hash de la contraseña:', err);
    } else {
      try {
        // Actualizar la contraseña en la base de datos con el hash generado
        const [rows] = await pool.query(`SELECT id FROM usuarios WHERE token = ?`, [token]);
        const [changePass] = await pool.query(`UPDATE usuarios SET contrasena = ? WHERE id = ?`, [hash, rows[0].id]);
        return changePass;
      } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        throw error;
      }
    }
  });
}

/////////////////////////////////////////////////
///Buscar la existencia de ulr imagen de proyects card

async function proyectsImg(img) {
  try {
    const [rows] = await pool.query(`SELECT img FROM proyectos where img in ('${img}')`);
    return rows;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error; // Relanza el error para que pueda ser manejado por el código que llama a esta función
  }
}

///////////////////////////////////////////
//Buscar existencia de nombre
 async function obtenerUsuario(nombre) {
  try {
    const [rows] = await pool.query(`SELECT nombre FROM usuarios where nombre in ('${nombre}')`);
    const usuarioEncontrado = rows.some(usuario => usuario.nombre === nombre);
    return usuarioEncontrado;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error; // Relanza el error para que pueda ser manejado por el código que llama a esta función
  }
}
async function viewToken(token) {
  try {
    const [rows] = await pool.query(`SELECT token FROM usuarios where token in ('${token}')`);
    const tokenEncontrado = rows.some(usuario => usuario.token === token);
    return tokenEncontrado;
  } catch (error) {
    console.error('Error al obtener token:', error);
    throw error; // Relanza el error para que pueda ser manejado por el código que llama a esta función
  }
}
async function loginUser(correo, password) {

 
  // Obtener el hash almacenado en la base de datos para el usuario con el correo electrónico proporcionado
  const [rows] = await pool.query('SELECT id, contrasena FROM usuarios WHERE correo = ?', [correo]);
  if (rows.length === 0) {
    // El usuario no existe en la base de datos
    return false;
  }
  // Comparar el hash almacenado con el hash de la contraseña proporcionada por el usuario
  const storedPassword = rows[0].contrasena;
  const passwordsMatch = await bcrypt.compare(password, storedPassword);
  if (passwordsMatch) {
    // La contraseña es correcta
    console.log('La contraseña es correcta')
    return true;
  } else {
    // La contraseña es incorrecta
    console.log('La contraseña es incorrecta')
    return false;
  }
}


async function presentChange(presentacion) {
  try {
    const [rows] = await pool.query('UPDATE perfilcv SET sobremi = ? WHERE id = 1', [presentacion]);
    return rows;
  } catch (error) {
    console.error("Error en la solicitud de actualización de sobre mi:", error);
    throw error; // Lanzar el error para que la función que llama pueda manejarlo
  }
}



async function titlePresent(title,descripcion,linkedin,github,cv) {
  try {
    const [rows] = await pool.query('UPDATE perfilcv SET titulo = ?, descripcion = ?, linkedin = ?, github = ?, CV = ?  WHERE id = 1',
       [title,descripcion,linkedin,github,cv]);
    return rows;
  } catch (error) {
    console.error("Error en la solicitud de actualización de entrada:", error);
    throw error; // Lanzar el error para que la función que llama pueda manejarlo
  }
}


async function regUser(nombre,correo,password,token) {
  try{
  // Generar hash de la contraseña proporcionada por el usuario
  const hashedPassword = await bcrypt.hash(password, 10);
  // Guardar el hash de la contraseña en la base de datos junto con el correo electrónico del usuario
 const [rows] = await pool.query('INSERT INTO usuarios (nombre,correo,contrasena,token) VALUES (?, ?, ?, ?)', [nombre,correo, hashedPassword,token]);
return rows
}
catch(error){
console.log("Error en solicitud crear usuario"+ error)
}
}
module.exports = {
  getNotes,
  getProyect,
  getNote,
  getSession,
  createNote,
  updateNote,
  updateSession,
  passChanges,
  obtenerUsuario,
  viewToken,
  loginUser,
  regUser,
  perfilDescri,
  proyectsDescri,
  proyectsImg,
  getTecnology,
  presentChange,
  titlePresent,
  updateProyecto,
  getProyecto,
  deleteProyecto,
  newProyecto
};