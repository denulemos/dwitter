# Dwitter 🐦
⚠️ In Progress ⚠️

## ¿Cómo correr el proyecto? 👀
Pararse en la raiz del proyecto `./Dwitter` y en terminal, correr `npm install` y luego `npm start`, luego ir a `localhost:8080` (Ya que apunta por defecto al puerto 8080)

* Si aparece en consola el siguiente error `TextEncoder is not defined` para la dependencia `whatwg-url`, ir a `node_modules/whatwg-url/dist/encoding.js` y agregar la linea `const { TextEncoder, TextDecoder } = require("util");` en la parte de arriba de todo de este archivo. 
* Este proyecto fue hecho con la version 10 de NodeJS. 

## Funcionalidades (TODOs) 📖
* El usuario podrá logearse, registrarse en la plataforma y Twittear. **DONE**
* Implementar nvm para mantener la version de Node actualmente utilizada.
* Los twits podrán ser retwitteados, likeados, respondidos y borrados (por el mismo autor). 
* Tambien existirá la opcion de enviar mensajes privados, hacer salas de chat con varios usuarios, y hablar desde ahi (Hecho con la magia de `Socket.io`). Los chats traeran los mensajes viejos que el usuario no llegó a leer en el momento
* El usuario podrá setear su perfil en el momento que lo desee, para, por ejemplo, cambiar la foto de perfil
* Habrán notificaciones en Real-Time
* Se mantendrá una sesion de usuario **DONE**
* El usuario podrá seguir a otros usuarios para ver sus Twits en el inicio. 
* En este proyecto los Twits pasarán a ser llamados Dwits. **DONE**
