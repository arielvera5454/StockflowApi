# StockFlow API

API RESTful para gestión de inventario y pedidos, desarrollada con Node.js, Express, TypeScript, Prisma ORM y SQLite.

## Tecnologías

- Node.js + Express 5
- TypeScript 6 (estricto)
- Prisma ORM 7 (SQLite + better-sqlite3)
- Zod 4 (validación)
- JSON Web Token 10 (autenticación)
- bcryptjs 3 (hash de contraseñas)

## Requisitos previos

- Node.js (v18 o superior recomendado)
- npm (incluido con Node.js)
- Herramientas de compilación nativas (para `better-sqlite3`; en Windows suelen estar listas)

## Instalación

1. Clona el repositorio e ingresa al directorio:
   ```bash
   cd stockflow-api

2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Genera el cliente de Prisma (tipos):
```bash
npx prisma generate
```
   Copia el archivo de variables de entorno y edítalo si es necesario:
  ```bash
   cp .env.example .env
   ```
   El contenido por defecto de .env es:

```text
   DATABASE_URL="file:./prisma/dev.db"
   JWT_SECRET="super-secret-key-change-in-production"
   PORT=3000
```
   Cambia JWT_SECRET por una clave segura en producción.

## Base de datos
1. Migraciones
Ejecuta la migración inicial para crear la base de datos SQLite dentro de prisma/:

```bash
 npm run prisma:migrate
```
Esto también genera el cliente de Prisma tipado.

2. Semilla (seed)
Puebla la base de datos con datos de prueba (usuarios, categorías, productos):

```bash
npm run prisma:seed
```
Usuarios por defecto:

Rol	Email	Contraseña
ADMIN	admin@stockflow.com	Admin1234
OPERATOR	operator@stockflow.com	Oper1234

3. Reinicio completo (opcional)
Si necesitas borrar todos los datos y reiniciar los IDs desde 1:

```bash
npm run prisma:reset
```
4. Administración visual (opcional)
```bash
npm run prisma:studio
```
## Scripts disponibles
Comando	Descripción
npm run dev	Inicia el servidor en modo desarrollo (hot reload con tsx)
npm run build	Compila TypeScript a JavaScript en dist/
npm start	Inicia el servidor en producción (previamente compilado)
npm run prisma:generate	Regenera el cliente de Prisma según el schema
npm run prisma:migrate	Ejecuta migraciones pendientes
npm run prisma:seed	Ejecuta el script de semilla
npm run prisma:reset	Borra y recrea la base de datos + seed (usa URL del .env)
npm run prisma:studio	Abre Prisma Studio
## Ejecución
Para desarrollo:

```bash
npm run dev
```
El servidor se iniciará en http://localhost:3000 (o el puerto configurado en .env).

Prueba rápida:

```bash
curl http://localhost:3000/api/health
```
Respuesta esperada:

json
{ "success": true, "data": { "status": "ok" } }

## Pruebas automatizadas (colección HTTP)
Se incluye un archivo tests.http con una colección completa de peticiones que cubren todos los endpoints y casos de error.
Requiere la extensión REST Client para Visual Studio Code.

Simplemente abre el archivo y haz clic en "Send Request" en cada bloque para verificar el comportamiento de la API.

## Endpoints de la API
1. Autenticación (/api/auth)
Método	  Ruta	                              Descripción	                      Autenticación
POST	     /api/auth/register	                  Registrar nuevo usuario	          No
POST	     /api/auth/login	                     Iniciar sesión y obtener JWT	    No
Campos de registro: email, password.
Opcional: role (puede ser "ADMIN" o "OPERATOR", por defecto "OPERATOR").

2. Productos (/api/products)
Método	   Ruta	                               Descripción	                   Autenticación
GET	      /api/products	                      Listar todos los productos	    No
GET	      /api/products?category=Electrónica	 Filtrar por categoría (nombre)	 No
GET	      /api/products/:id	                   Obtener un producto por ID	    No
POST	      /api/products	                      Crear un nuevo producto	       ADMIN
PUT	      /api/products/:id	                   Actualizar un producto	          ADMIN
DELETE	   /api/products/:id	                   Eliminar un producto	          ADMIN

3. Pedidos (/api/orders)
Método	    Ruta	                       Descripción	                                          Autenticación
POST	       /api/orders	              Crear un pedido (descuenta stock transaccionalmente)	Cualquier rol
GET	       /api/orders/:id	           Obtener un pedido por ID (incluye productos)	         Cualquier rol
PATCH	       /api/orders/:id/status	     Actualizar estado del pedido (ADMIN)	                  ADMIN
Estados del pedido: PENDING (inicial) → DISPATCHED o CANCELLED.
Al cancelar un pedido, el stock se reintegra automáticamente.
No se puede cancelar un pedido ya cancelado o despachado (error 409).

4. Reportes (/api/reports)
Método	Ruta	Descripción	Autenticación
GET	/api/reports/low-stock	Productos con stock <= minStock	ADMIN
Autenticación
Incluye el token JWT en la cabecera de las peticiones protegidas:

```text
Authorization: Bearer <token>
```
El token se obtiene al hacer login. Expira en 2 horas.

Roles
ADMIN: acceso total (CRUD de productos, actualizar estado de pedidos, ver reportes).

OPERATOR: puede crear pedidos y consultar pedidos, pero no modificar productos ni cambiar estados de pedidos.

Estructura del proyecto
text
src/
├── app.ts                # Configuración de Express
├── server.ts             # Punto de entrada
├── config/               # Variables de entorno
├── lib/                  # Cliente Prisma (con adaptador better-sqlite3)
├── errors/               # AppError y errorHandler
├── middlewares/          # auth, roleGuard, validateRequest
├── types/                # Tipos globales y extensión de Request
├── features/
│   ├── auth/             # Registro y login
│   ├── products/         # CRUD de productos
│   ├── orders/           # Pedidos con transacciones
│   └── reports/          # Reporte de bajo stock
└── db/
    └── seed.ts           # Script de semilla
Respuestas
Éxito:

json
{
  "success": true,
  "data": { ... }
}
Error:

json
{
  "success": false,
  "message": "Descripción del error"
}
## Comportamiento transaccional
La creación de pedidos y la cancelación se ejecutan dentro de transacciones de Prisma ($transaction). Si ocurre cualquier error (stock insuficiente, producto inexistente), todos los cambios se revierten automáticamente.
Al cancelar un pedido, el stock se reintegra en la misma transacción, garantizando la integridad de los datos.


