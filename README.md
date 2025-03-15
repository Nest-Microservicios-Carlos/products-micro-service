<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Products Microservice

## Dev
1. Clonar el repositorio
2. Instalar dependencias
```bash
npm install
```
3. Crear un archivo `.env` basado en el archivo `.env.example`
4. Ejecutar migracion de prisma
```bash
npx prisma migrate dev --name
```
5. Ejecutar el microservicio
```bash
npm run start:dev
```