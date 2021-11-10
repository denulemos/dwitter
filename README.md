# Dwitter 🐦
⚠️ In Progress ⚠️

## ¿Cómo correr el proyecto? 👀
Pararse en la raiz del proyecto `./Dwitter` y en terminal, correr `npm install` y luego `npm start`, luego ir a `localhost:8080` (Ya que apunta por defecto al puerto 8080)

* Si aparece en consola el siguiente error `TextEncoder is not defined` para la dependencia `whatwg-url`, ir a `node_modules/whatwg-url/dist/encoding.js` y agregar la linea `const { TextEncoder, TextDecoder } = require("util");` en la parte de arriba de todo de este archivo. 
* Este proyecto fue hecho con la version 10 de NodeJS. 

## Tecnologias
* Se eligio NodeJS con Express para el backend por la rapidez de desarrollo que brinda. Tambien porque su integracion con Socket.IO es muy simple. ✔️
* Se eligio Pug como frontend engine ya que esta basado en Javascript y brinda una sintaxis muy sencilla para HTML, acelerando asi el desarrollo de este proyecto para que nos podamos concentrar puramente en el funcionamiento del backend ✔️
* Se eligio MongoDB como Base de Datos. Al ser una base de datos no relacional, se brindaran los Schemas como documentacion. ✔️
* Las llamadas a las API se haran con Axios y los Scripts del lado del cliente con JQuery o Javascript Vanilla. Algunas llamadas se harán usando AJAX. ✔️
* El frontend se complementará con Bootstrap ✔️

## Endpoints (Todavia en definicion ⚠️)
* `api/posts` => Enviar dwit 
## Schemas
Los mismos pueden variar a medida que se va desarrollando el proyecto
### User
```javascript
    usuario : {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password : {
        type: String,
        required: true,
        trim: false,
    },
    email : {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    foto : {
        type: String,
        default: '/images/profileDefault.png'
    },
    fotoPortada: { type: String },
    likes: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    redweets: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    siguiendo: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    seguidores: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, {timestamps: true});
``` 
* Se esta evaluando agregar Nombre o una especie de ShowName para simular el funcionamiento de Twitter, donde el usuario puede modificar su nombre que aparece al lado de su nombre de usuario.

### Chat 

```javascript
    nombreChat: { type: String, trim: true },
    esChatGrupal: { type: Boolean, default: false },
    usuarios: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    ultimoMensaje: { type: Schema.Types.ObjectId, ref: 'Message' }
}, { timestamps: true });
```
### Message 

```javascript
 emisor: { type: Schema.Types.ObjectId, ref: 'User' },
    contenido: { type: String, trim: true },
    chat: { type: Schema.Types.ObjectId, ref: 'Chat' },
    leidoPor: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });
```

### Notification

```javascript
 receptor: { type: Schema.Types.ObjectId, ref: 'User' },
    emisor: { type: Schema.Types.ObjectId, ref: 'User' },
    tipoNotificacion: String,
    visto: { type: Boolean, default: false },
    entityId: Schema.Types.ObjectId
}, { timestamps: true });
```

### Post (O Dwit)

```javascript
    contenido: { type: String, trim: true },
    autor: { type: Schema.Types.ObjectId, ref: 'User' },
    pinned: Boolean,
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    redweetsUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    redweetData: { type: Schema.Types.ObjectId, ref: 'Post' },
    respondeA: { type: Schema.Types.ObjectId, ref: 'Post' },
}, { timestamps: true });
```

![UML](./assets/UML.jpg)
