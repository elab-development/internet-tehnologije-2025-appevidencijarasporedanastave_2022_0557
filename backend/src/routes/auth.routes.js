import express from "express";
import { login, logout } from "../controllers/auth.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API za autentifikaciju korisnika
 */

/**
 * @swagger
 * api/auth/login:
 *   post:
 *     summary: Prijava korisnika
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Uspesno prijavljen korisnik
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Neuspešna autentifikacija
 */
router.post("/login", login);

/**
 * @swagger
 * api/auth/logout:
 *   post:
 *     summary: Odjava korisnika
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Uspesno odjavljen korisnik
 *       401:
 *         description: Korisnik nije prijavljen
 */
router.post("/logout", logout);

export default router;