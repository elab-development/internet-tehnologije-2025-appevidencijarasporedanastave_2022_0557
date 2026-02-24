import express from "express";
import {
  updateMyAccount,
  updateUserByAdmin,
  deleteAccount,
  searchUsers,
  getMyProfile,
  getAllUsers,
  createUser,
  getAllProfessors,
} from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeAdmin } from "../middlewares/role.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API za upravljanje korisnicima
 */

/**
 * @swagger
 * api/users/me:
 *   put:
 *     summary: Ažuriranje sopstvenog naloga
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Marko Markovic"
 *               email:
 *                 type: string
 *                 example: "marko@example.com"
 *     responses:
 *       200:
 *         description: Nalog uspešno ažuriran
 *       401:
 *         description: Korisnik nije autentifikovan
 */
router.put("/me", authenticate, updateMyAccount);

/**
 * @swagger
 * api/users/{id}:
 *   put:
 *     summary: Ažuriranje korisnika od strane admina
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID korisnika
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 example: "student"
 *     responses:
 *       200:
 *         description: Korisnik uspešno ažuriran
 *       401:
 *         description: Korisnik nije autentifikovan
 *       403:
 *         description: Nije admin
 */
router.put("/:id", authenticate, authorizeAdmin, updateUserByAdmin);

/**
 * @swagger
 * api/users/{id}:
 *   delete:
 *     summary: Brisanje korisničkog naloga (samo admin)
 *     tags: [Users]
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
 *         description: Nalog uspešno obrisan
 *       401:
 *         description: Korisnik nije autentifikovan
 *       403:
 *         description: Nije admin
 */
router.delete("/:id", authenticate, authorizeAdmin, deleteAccount);

/**
 * @swagger
 * api/users/search:
 *   get:
 *     summary: Pretraga korisnika (samo admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Upit za pretragu korisnika
 *     responses:
 *       200:
 *         description: Lista korisnika koji odgovaraju upitu
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *       401:
 *         description: Korisnik nije autentifikovan
 *       403:
 *         description: Nije admin
 */
router.get("/search", authenticate, authorizeAdmin, searchUsers);

/**
 * @swagger
 * api/users/me:
 *   get:
 *     summary: Dohvatanje profila prijavljenog korisnika
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil korisnika
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *       401:
 *         description: Korisnik nije autentifikovan
 */
router.get("/me", authenticate, getMyProfile);

/**
 * @swagger
 * api/users:
 *   get:
 *     summary: Dohvatanje svih korisnika (samo admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista svih korisnika
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   role:
 *                     type: string
 *       401:
 *         description: Korisnik nije autentifikovan
 *       403:
 *         description: Nije admin
 */
router.get("/", authenticate, authorizeAdmin, getAllUsers);

/**
 * @swagger
 * api/users/professors:
 *   get:
 *     summary: Dohvatanje svih profesora (samo admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista profesora
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *       401:
 *         description: Korisnik nije autentifikovan
 *       403:
 *         description: Nije admin
 */
router.get("/professors", authenticate, authorizeAdmin, getAllProfessors);

/**
 * @swagger
 * api/users:
 *   post:
 *     summary: Kreiranje novog korisnika (samo admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 example: "student"
 *     responses:
 *       201:
 *         description: Korisnik uspešno kreiran
 *       401:
 *         description: Korisnik nije autentifikovan
 *       403:
 *         description: Nije admin
 */
router.post("/", authenticate, authorizeAdmin, createUser);

export default router;