# EcoSwap Backend 🌿

> API REST para la plataforma de economía circular EcoSwap.

---

## Deploy

🚀 **Backend:** https://ecoswap-v0cz.onrender.com

---

## Stack Tecnológico

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

---

## Arquitectura de Datos

La base de datos se fundamenta en 4 colecciones interconectadas:

| Modelo | Relación | Descripción |
| :--- | :--- | :--- |
| **User** | 1:N con Product | Gestiona perfiles, roles (Admin/User) y credenciales. |
| **Category** | 1:N con Product | Define los tipos de artículos y su valor de CO2 predefinido. |
| **Product** | N:1 con Category | Contiene los detalles, imagen, precio y estado de disponibilidad. |
| **Transaction** | N:1 con Product/User | Registra el flujo de compraventa entre usuarios. |

---

## Seguridad

- Autenticación mediante **JWT** y **Bcrypt**
- Roles de usuario: `admin` y `user`
- Subida de imágenes con **Cloudinary** y **Multer**

---

## Instalación

```bash
git clone https://github.com/anarmb/ecoswap.git
cd backend
npm install
```

Crea un archivo `.env` en la raíz del backend

Carga los datos de prueba

```bash
npm run seed
```

Arranca el servidor:

```bash
npm run dev
```

---


## Autora

Anabel Ramírez Borrego — Desarrollo Full Stack — https://github.com/anarmb