const express = require("express");
const path = require('path');
const { connect } = require("mongoose");//Agregado de proyect mongodb
const { success, error }  = require('consola'); //Agregado de proyect mongodb
const { DB } = require('./config/config.js');//Agregado de proyect mongodb
const auth  =  require('./routes/auth');//Agregado de proyect mongodb



const cors = require('cors');
const { getNotes, getNote, createNote, updateNote, updateSession, obtenerUsuario, passChanges,
  viewToken,loginUser,regUser,perfilDescri,proyectsDescri,proyectsImg,getTecnology,presentChange,titlePresent
,updateProyecto,getProyecto,deleteProyecto,newProyecto } = require('./database.js');

const app = express();
const whitelist = ['http://127.0.0.1:8080', 'http://localhost:8080'];

app.use(cors({ origin: whitelist }));
app.use(express.json());
///////parte que se agraga de proyect con mongofb
app.use(express.urlencoded({ extended: true }));


//////////////////////////////////////////////



///Lo tomamos de carpeta route
app.use("/api/auth", auth);

app.get("/", (req, res) => {
	res.send("Servidor base de datos");
});
///////parte que se agraga de proyect con mongofb
// Ruta para obtener detalles de un usuario por su nombre
app.get('/usuario/:nombre', async (req, res) => {
  const nombre = req.params.nombre;

  try {
    // Llamar a la función obtenerUsuario con el nombre obtenido de la URL
    const usuario = await obtenerUsuario(nombre);

    // Verificar si se encontró un usuario
    if (!usuario) {
      // Si el usuario no existe, enviar un error 404 (Not Found)
      return res.status(404).redirect('/ErrorServer');
    }

    // Si el usuario existe, enviar los detalles del usuario como respuesta
    res.json(usuario);
  } catch (error) {
    // Si ocurre algún error al obtener el usuario, enviar un error 500 (Internal Server Error)
    console.error('Error al obtener el usuario:', error);
    res.status(500).send('Error al obtener el usuario');
  }
 
});


// Middleware para manejar errores
app.use((err, req, res, next) => {
  // Si el error no tiene un código de estado, establecer un código de estado 500 (Internal Server Error)
  if (!err.status) {
    err.status = 500;
  }

  // Enviar una respuesta de error con el código de estado y el mensaje del error
  res.status(err.status).json({
    error: {
      status: err.status,
      message: err.message
    }
  });
});
///////Fin verificacion de usuario

// Obtener todas las notas
app.get("/dt-admin", async (req, res) => {
  const notes = await getNotes();
  res.send(notes);
});

// Obtener todas las tecnologias
app.get("/tecnologias", async (req, res) => {
  const notes = await getTecnology();
  res.send(notes);
});

//Obtener perfil descripcion

app.get("/cv/perfil-now", async (req, res) => {
  const notes = await perfilDescri();
  res.send(notes);
});
// Obtener proyectos descripcion
app.get("/proyects-all", async (req, res) => {
  const notes = await proyectsDescri();
  res.send(notes);
});

// Obtener img perfil proyectos
app.get("/proyects-img/:img", async (req, res) => {
  const img = req.params.img;
  const notes = await proyectsImg(img);
  res.send(notes);
});

// Obtener una nota por su ID
app.get("/dt-admin/:id", async (req, res) => {
  const id = req.params.id;
  const note = await getNote(id);
  res.send(note);
});
///////////////////////////////////

app.get("/proyecto-id/:id", async (req, res) => {
  const id = req.params.id;
  const note = await getProyecto(id);
  res.send(note);
});

////////////////////////////////
app.get("/user/password/change/:token", async (req, res) => {
  const token = req.params.token;

  //const { token } = req.body; // Suponiendo que el cuerpo de la solicitud contiene el nuevo valor de la sesión
  try {
    // Llama a la función updateSession para actualizar la sesión del usuario
    const usuario = await viewToken(token); // Aquí pasamos directamente el token, no como parte de un objeto { token }
  
    // Verificar si se encontró un usuario
    if (!usuario) {
      // Si el usuario no existe, enviar un error 404 (Not Found)
      return res.status(404).redirect('/ErrorServer');
    }
    res.json(usuario);
  } catch (error) {
    console.error('Error al verifica token del usuario:', error);
    res.status(500).send('Error al verificar token');
  }
});

///////////////////////////////////////////////////////////////
app.post("/login/user", async (req, res) => {
  const correo = req.body.correo;
  const password = req.body.contrasena
  try {
    // Llamar a la función login user para entrar session
    const usuario = await loginUser(correo,password);

    // Verificar si se encontró contraseña del usuario
    if (!usuario) {
      // Si el usuario no existe, enviar un error 404 (Not Found)
      return res.status(404).redirect('/ErrorServer');
    }
    // Si el usuario existe, enviar los detalles del usuario como respuesta
    res.json(usuario);
  } catch (error) {
    // Si ocurre algún error al obtener el usuario, enviar un error 500 (Internal Server Error)
    console.error('Error al obtener el usuario:', error);
    res.status(500).send('Error al obtener el usuario');
  }
 
});

///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////
app.post("/login/registrar", async (req, res) => {
  const nombre = req.body.nombre;
  const correo = req.body.correo;
  const password = req.body.contrasena;
  const token = req.body.token;
  try {
    // Llamar a la función registrar user para entrar subir usuario
    const registro = await regUser(nombre,correo,password,token);
    // Si el usuario existe, enviar los detalles del usuario como respuesta
    res.json(registro);
  } catch (error) {
    // Si ocurre algún error registro del usuario, enviar un error 500 (Internal Server Error)
    console.error('Error al obtener el usuario:', error);
    res.status(500).send('Error al crear el usuario');
  }
 
});

///////////////////////////////////////////////////////////

app.put("/actualizar/presentacion", async (req, res) => {
  const sobremi = req.body.sobremi

  try {
    await presentChange(sobremi); 
    res.status(200).send({ mensaje: 'Presentacion actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar la presentacion del usuario:', error);
    res.status(500).send('Error al actualizar la presentacion del usuario');
  }
})

///////////////////////////////////////////////////////////

app.put("/actualizar/titulo", async (req, res) => {
  const title = req.body.titulo
  const descripcion = req.body.descripcion
  const linkedin = req.body.linkedin
  const github = req.body.github
  const cv = req.body.cv

  try {
    await titlePresent(title,descripcion,linkedin,github,cv); 
    res.status(200).send({ mensaje: 'Titulo de la presentacion esta actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el titulo de la presentacion del usuario:', error);
    res.status(500).send('Error al actualizar el titulo de la presentacion del usuario');
  }
})


//////////////////////////////////////////////////////////
app.put("/dt-admin/user/password/change/:token", async (req, res) => {
  const token = req.params.token;
  const passChange = req.body
  //const { token } = req.body; // Suponiendo que el cuerpo de la solicitud contiene el nuevo valor de la sesión
  try {
    // Llama a la función updateSession para actualizar la sesión del usuario
    await passChanges(token,passChange); // Aquí pasamos directamente el token, no como parte de un objeto { token }
    res.status(200).send({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar la contraseña del usuario:', error);
    res.status(500).send('Error al actualizar la contraseña del usuario');
  }
});
/////////////////////////

// Actualizar una nota por su ID
app.put("/dt-admin/:id", async (req, res) => {
  const id = req.params.id;
  const { nombre, correo,contrasena } = req.body;

  try {
    await updateNote(id, { nombre,correo,contrasena });
    res.status(200).send({ mensaje: 'Nota actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar la nota:', error);
    res.status(500).send('Error al actualizar la nota');
  }
});

// Actualizar Proyecto con ID
app.put("/updateProyecto/:id", async (req, res) => {
  const id = req.params.id;
  const { img, titulo, descripcion, github, enlinea, madewith } = req.body;

  try {
    await updateProyecto(id, { img, titulo, descripcion, github, enlinea, madewith });
    res.status(200).send({ mensaje: 'Proyecto actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el proyecto:', error);
    res.status(500).send('Error al actualizar el proyecto');
  }
});

// Actualizar Proyecto con ID
app.put("/newProyecto/", async (req, res) => {

  const { img, titulo, descripcion, github, enlinea, madewith } = req.body;

  try {
    await newProyecto( img, titulo, descripcion, github, enlinea, madewith );
    res.status(200).send({ mensaje: 'Proyecto se creo correctamente' });
  } catch (error) {
    console.error('Error al crear el proyecto:', error);
    res.status(500).send('Error al crear el proyecto');
  }
});

// Borrar Proyecto con ID
app.put("/deleteProyecto/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await deleteProyecto(id);
    res.status(200).send({ mensaje: 'Proyecto borrado correctamente' });
  } catch (error) {
    console.error('Error al borrar el proyecto:', error);
    res.status(500).send('Error al borrar el proyecto');
  }
});

//Actualizar session
app.put("/dt-admin/session/:id", async (req, res) => {
  const id = req.params.id;
  const { token } = req.body; // Suponiendo que el cuerpo de la solicitud contiene el nuevo valor de la sesión

  try {
    // Llama a la función updateSession para actualizar la sesión del usuario
    await updateSession(id, token); // Aquí pasamos directamente el token, no como parte de un objeto { token }
    res.status(200).send({ mensaje: 'Sesión actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar la sesión del usuario:', error);
    res.status(500).send('Error al actualizar la sesión del usuario');
  }
});


// Manejar errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Error interno del servidor Conexion rota 💩');
});



// Iniciar el servidor
app.listen(5500, () => {
  console.log('El servidor está en el puerto 5500');
});
///////////////////////////////////////////////////////////////
//////////////////////Configuracion con nodemaiter

const startApp = async () => {
	try {
		await connect(DB, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			serverSelectionTimeoutMS: 5000,
			dbName: "nodemailer",
		});

		success({
			message: `Successfully connected with database\n${DB}`,
			badge: true,
		});

		app.listen(5000, async () => {
			success({
				message: `Server started on PORT 5000`,
				badge: true,
			});
		});
    } catch(err) {
        
        error({
            message: `Unable to connect with database\n ${err}`,
            badge: true,
        });
        startApp();
    }
};

startApp();

