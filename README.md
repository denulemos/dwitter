# Dwitter 🐦
⚠️ In Progress ⚠️

## ¿Cómo correr el proyecto?
Este proyecto fue hecho con la version 10 de NodeJS. 
Pararse en la raiz del proyecto `./Dwitter` y en terminal, correr `npm install` y luego `npm start`, luego ir a `localhost:8080` (Ya que apunta por defecto al puerto 8080)

* Si aparece en consola el siguiente error `TextEncoder is not defined` para la dependencia `whatwg-url`, ir a `node_modules/whatwg-url/dist/encoding.js` y agregar la linea `const { TextEncoder, TextDecoder } = require("util");` en la parte de arriba de todo de este archivo. 
## Funcionalidades
* El usuario podrá logearse, registrarse en la plataforma y Twittear. 
* Los twits podrán ser retwitteados, likeados, respondidos y borrados (por el mismo autor). 
* Tambien existirá la opcion de enviar mensajes privados, hacer salas de chat con varios usuarios, y hablar desde ahi. Los chats traeran los mensajes viejos que el usuario no llegó a leer en el momento
* El usuario podrá setear su perfil en el momento que lo desee
* El usuario podrá seguir a otros usuarios para ver sus Twits en el inicio. 
* En este proyecto los Twits pasarán a ser llamados Dwits.

## Tecnology Description
* Se va a usar NodeJS con Express, en conjunto con MongoDB como Base de Datos y Pug como motor de plantillas en frontend.
