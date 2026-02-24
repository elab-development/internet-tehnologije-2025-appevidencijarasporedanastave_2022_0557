import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeAdmin } from "../middlewares/role.middleware.js";
import {
  getMyTerms,
  getTermsByUser,
  createTerm,
  getPresentCountController,
} from "../controllers/term.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Terms
 *   description: API za upravljanje terminima i statistikom prisustva
 */

/**
 * @swagger
 * /terms/my:
 *   get:
 *     summary: Dohvatanje termina prijavljenog korisnika
 *     tags: [Terms]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista termina korisnika
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   subject:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date
 *                   professor:
 *                     type: string
 *       401:
 *         description: Korisnik nije autentifikovan
 */
router.get("/my", authenticate, getMyTerms);

/**
 * @swagger
 * /terms/{id}:
 *   get:
 *     summary: Dohvatanje termina određenog korisnika
 *     tags: [Terms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID korisnika
 *     responses:
 *       200:
 *         description: Lista termina za korisnika
 *       401:
 *         description: Korisnik nije autentifikovan
 */
router.get("/:id", authenticate, getTermsByUser);

/**
 * @swagger
 * /terms:
 *   post:
 *     summary: Kreiranje novog termina (samo admin)
 *     tags: [Terms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subjectId:
 *                 type: string
 *                 example: "60a7c5d3f1e7b80017f0c123"
 *               professorId:
 *                 type: string
 *                 example: "60b7d5a2e5f7c80011d0b456"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2026-02-25"
 *     responses:
 *       201:
 *         description: Termin uspešno kreiran
 *       401:
 *         description: Korisnik nije autentifikovan
 *       403:
 *         description: Nije admin
 */
router.post("/", authenticate, authorizeAdmin, createTerm);

/**
 * @swagger
 * /terms/{id}/stats:
 *   get:
 *     summary: Dohvatanje statistike prisustva po terminu (za profesora)
 *     tags: [Terms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID termina
 *     responses:
 *       200:
 *         description: Broj studenata prisutnih na terminu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 termId:
 *                   type: string
 *                   example: "60c8e7b1f1e8a90017d0c789"
 *                 presentCount:
 *                   type: integer
 *                   example: 12
 *       401:
 *         description: Korisnik nije autentifikovan
 *       403:
 *         description: Korisnik nema prava za pristup statistici
 */
router.get("/:id/stats", authenticate, getPresentCountController);

export default router;