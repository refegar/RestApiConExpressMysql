create database administrador;
use administrador;

CREATE TABLE usuarios (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE,
    correo VARCHAR(100) UNIQUE,
    contrasena VARCHAR(255),
    token VARCHAR(255) UNIQUE  
);

INSERT INTO usuarios (nombre,correo,contrasena,token) 
values('refegar','marfenox@gmail.com','password','1991');

