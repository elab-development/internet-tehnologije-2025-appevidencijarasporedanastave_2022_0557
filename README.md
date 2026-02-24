# Veb aplikacija za evidenciju rasporeda nastave studenata

## Opis aplikacije

Ova aplikacija služi za upravljanje fakultetskim rasporedom i evidencijom prisustva studenata.  
Omogućava studentima i profesorima pregled termina, označavanje prisustva i sinhronizaciju termina sa Google Calendar-om.

Glavne funkcionalnosti:
- Pregled termina po korisniku (student / profesor)
- Evidencija prisustva studenata (PRESENT / ABSENT)
- Vizuelni prikaz rasporeda pomoću kalendara
- Integracija sa Google Calendar-om (upis termina u lični kalendar)
- Uloge korisnika: ADMIN, PROFESSOR, STUDENT

---

## Tehnologije koje su korišćene

### Backend
- **Node.js**
- **Express.js**
- **Prisma ORM**
- **PostgreSQL**
- **JWT autentifikacija**
- **Google Calendar API**

### Frontend
- **React (Vite)**
- **FullCalendar**
- **Axios**
- **Tailwind CSS**

### Ostalo
- **Docker**
- **Docker Compose**

---

## Instrukcije za lokalno pokretanje aplikacije
### Pokretanje backend aplikacije
```bash
cd backend
npm start
```
### Pokretanje frontend aplikacije
```bash
cd frontend
npm run dev
```

## Pokretanje aplikacije pomocu docker compose
```bash
docker compose up -d
```
