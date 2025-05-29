# Artiklite rakendus (Frontend + Backend)

See projekt on lihtne artiklite haldamise süsteem, mis võimaldab kasutajatel registreeruda, sisse logida, luua artikleid ja lisada neile kommentaare.

## Tehnoloogiad

- **Frontend:** React, Axios, React Router
- **Backend:** Node.js, Express
- **Andmebaas:** Microsoft SQL Server
- **Autentimine:** JWT (JSON Web Token)

## Funktsionaalsus

### 1. Kasutajate haldus
- Kasutaja saab registreeruda e-posti ja parooliga
- Kasutaja saab sisse logida ja saada JWT tokeni
- Autentitud kasutaja saab luua artikleid ja lisada kommentaare

### 2. Artiklite haldus
- Artiklite loomine (pealkiri ja sisu)
- Artiklite vaatamine
- Artiklite kustutamine (ainult autor)

### 3. Kommentaaride haldus
- Kommentaaride lisamine artiklitele
- Kommentaaride muutmine ja kustutamine (ainult autor)

## Lokaalne käivitamine

### 1. Andmebaas

Andmebaas peab sisaldama järgmisi tabeleid:

```sql
CREATE TABLE Users (
    id INT PRIMARY KEY IDENTITY,
    email NVARCHAR(255) NOT NULL UNIQUE,
    passwordHash NVARCHAR(MAX) NOT NULL
);

CREATE TABLE Articles (
    id INT PRIMARY KEY IDENTITY,
    title NVARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    createdAt DATETIME DEFAULT GETDATE(),
    authorId INT FOREIGN KEY REFERENCES Users(id)
);

CREATE TABLE Comments (
    id INT PRIMARY KEY IDENTITY,
    content NVARCHAR(MAX) NOT NULL,
    createdAt DATETIME DEFAULT GETDATE(),
    articleId INT FOREIGN KEY REFERENCES Articles(id),
    authorId INT FOREIGN KEY REFERENCES Users(id)
);
```

### 2. Backend

1. Mine kausta `articles-backend`
2. Loo fail `.env` ja lisa järgmised väärtused:

```env
PORT=3000
JWT_SECRET=salajane_võti
DB_USER=kasutaja
DB_PASSWORD=parool
DB_SERVER=localhost
DB_DATABASE=artiklid
```

3. Paigalda sõltuvused:

```bash
npm install
```

4. Käivita server:

```bash
node server.js
```

### 3. Frontend

1. Mine kausta `articles-frontend`
2. Paigalda sõltuvused:

```bash
npm install
```

3. Käivita arendusserver:

```bash
npm start
```

Frontend jookseb vaikimisi pordil `3001`.

## Märkused

- CORS on lubatud frontendile localhost:3001
- Autentimiseks kasutatakse JWT tokenit, mis salvestatakse localStorage’i
- Projekti saab kasutada õppematerjalina või lähtekoodibaasina väiksemale rakendusele
