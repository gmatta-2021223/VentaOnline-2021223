# VentaOnline-2021223
## PROYECTO FINAL I BIMESTRE
### Descripción:
> El proyecto consiste en una API web creada con NodeJs que se encarga de llevar el registro de las ventas, productos en línea, etc. de una empresa. La aplicación estará compuesta por dos secciones, la primera es la sección de administrador, la cual tiene las siguientes funciones:
#### Administrador:
* Gestión de productos: esta función consiste en agregar un nuevo producto en la base de datos, en poder visualizar el y los productos, editar ese mismo producto, llevar el control del stock, visualizar los productos agotados, visualizar los productos más vendidos, editar el producto y por último eliminarlo.
* Gestión de categorías: consiste en agregar una nueva categoría en la base de datos, poder visualizar todas las categorías ingresadas, editar una categoría y eliminarla. "Si algún producto pertenece a una categoría y es necesario eliminar dicha categoría, el producto debe pasar automáticamente a una categoría por defecto."
* Gestión de usuarios: consiste en agregar un nuevo usuario y poder modificar el rol al que pertenece (Administrador[ADMIN] o
Cliente[CLIENT]), también editar los datos de un usuario pero solamente si el usuario a modificar es rol cliente, lo mismo para el eliminar.
* Gestión de facturas: consiste en editar una factura, validando el stock, para que se pueda actualizar.
* Poder visualizar las facturas que tiene sus usuarios (por usuario).
* Poder visualizar los productos de una factura.
#### Cliente:
* Podrá tener la opción de iniciar sesión y de registrarse. El cual si se registra, el rol automáticamente deberá tomarse como cliente.
* Ver el catálogo de productos más vendidos.
* Buscar los productos por su nombre.
* Ver las categorías existentes y poder ver el catálogo de productos por categoría. (Buscar por categoría)
* Agregar al carrito de compras.
* Comprar lo cual mostraría la factura de su compra de forma detallada.
* Al iniciar sesión, podrá ver todas sus compras realizadas.
* Editar su perfil
* Eliminar su cuenta.

**Las funciones descritas de cada rol. Solo podrán ser accedidas por medio una autenticación de usuario y contraseña.  
La información será almacenada en una base de datos de MongoDB.  
Con la tecnología de NodeJs.**  
