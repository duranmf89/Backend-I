Comentarios Entrega Final:

Ejecucion: 
/EntregaFinal-Duran
node src/app.js

Postman de carritos: En la carpeta de Entrega final tambien hay un json con la coleccion de postman, hay que 
usar la carpeta "Entrega Final - Carritos".

Compass:
Connection String: mongodb+srv://franciscoSCluster:Abc12345@franciscos-cluster-oct2.7gnai.mongodb.net/

Atlas: 
Proyect ID: 6705bcc87300717d21ddda49
Proyect name: PRU-OCT-24
(No creo que con esos datos pueda entrar en atlas pero esta connectado en Atlas el proyecto tmb junto con Compass)

Indexes: 
- Category (Creado en Atlas para buscar a traves de la Url con query)
- Code (creado a traves del atributo unique (code: { type: String, required: true, unique: true }, )
- Id (creado por mongo)
- Search Index para title (creado en Atlas para hacer fuzzy search desde el front end en la barra de busqueda)

Routes:
Productos : en el js de las rutas de producto esta comentado lo que hace cada ruta.
Carritos : la ruta get se paso a render para mostrar la vista carrito.handlebars

Controllers:
Estan comentados los dos controllers detalladamente lo que hace cada funcion controladora.
En el caso del productController se usa un productManager que se comunica con el modelo, a diferencia del cartController
que no usa un cartManager. El cartController se comunica directamente con el modelo. 

Manager de carritos: NO hay.
Manager de productos: Metodos detallados.

El realTimeProducts.handlebars (/register) en viewsRouter.js esta modificado a mi entrega anterior. Este solo muestra los
productos añadidos en el momento, se agregan en MongoDB (socket.js). No se muestran productos al recargar la pagina. 
Tambien se pueden eliminar los productos (icono tacho rojo) recientemente creados con mongoose a traves del socket.js donde
importamos el modelo de productos tambien para poder gestionar estos productos en tiempo real y desde la base de datos de mongo. 
Logre hacer edicion de productos cuando entras desde el producto.handlebars (router.get('/products/:pid', getProductById);
en el icono de edicion, donde aparece el formulario en editProduct.handlebars (con validaciones, usan el mismo validador que el 
registro de productos) (router.get('/products/:pid/edit', editProduct);)
Se puede verificar que si se crea un producto aparece en la base de datos de mongo, si lo desea eliminar debe hacerse en el mismo
momento y tambien usa mongoose para eliminarlo (por socket.js).

