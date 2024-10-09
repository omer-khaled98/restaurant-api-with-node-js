import express from "express";
import * as reservationController from "../controllers/reservationController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// POST /api/reservations: Book a table
router.post(
  "/reservations",
  authMiddleware,
  reservationController.createReservation
);

// GET /api/reservations: Retrieve all reservations (admin) or user reservations
router.get(
  "/reservations",
  authMiddleware,
  reservationController.getReservations
);

// PUT /api/reservations: Update all reservations
router.put(
  "/reservations",
  authMiddleware,
  reservationController.getReservationsss
);

// GET /api/reservations/:id: Get reservation details by ID
router.get(
  "/reservations/:id",
  authMiddleware,
  reservationController.getReservationById
);

// PUT /api/reservations/:id: Update a reservation by ID
router.put(
  "/reservations/:id",
  authMiddleware,
  reservationController.updateReservation
);

// DELETE /api/reservations/:id: Cancel a reservation by ID
router.patch(
  "/reservations/:id",
  authMiddleware,
  reservationController.cancelReservation
);

export default router;
