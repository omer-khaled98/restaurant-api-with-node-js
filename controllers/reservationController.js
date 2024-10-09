import Reservation from "../models/Reservation.js"; // Use 'import' instead of 'require'

// POST /api/reservations: Book a table
export const createReservation = async (req, res) => {
  try {
    const { userId, date, time, tableNumber, numberOfGuests } = req.body;

    // تحقق من أن جميع الحقول مطلوبة
    /*  if (userId || !date || !time || !tableNumber || !numberOfGuests) {
      return res.status(400).json({ message: "All fields are required" });
    } */

    const { _id } = req.user;

    // تحقق من أن الوقت أكبر من الوقت الحالي
    const reservationTime = new Date(`${date}T${time}`);
    if (reservationTime <= Date.now()) {
      return res.status(400).json({ message: "Time should be in the future" });
    }

    const reservation = new Reservation({
      userId: _id,
      date,
      time,
      tableNumber,
      numberOfGuests,
    });

    await reservation.save();
    res
      .status(201)
      .json({ message: "Reservation booked successfully", reservation });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to book reservation", error: err.message });
  }
};

// GET /api/reservations: Retrieve all reservations (admin) or user reservations
// export const getReservations = async (req, res) => {
//   try {
//     const { userId, isAdmin } = req.user;
//     console.log(req.user);

//     // Assume user info comes from auth middleware
//     let reservations;

//     if (isAdmin) {
//       reservations = await Reservation.find().populate("userId", "name email");
//     } else {
//       reservations = await Reservation.find({ userId });
//     }

//     res.status(200).json(reservations);
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Failed to retrieve reservations", error: err.message });
//   }
// };
export const getReservations = async (req, res) => {
  // console.log(req);
  try {
    const { _id: userId, role } = req.user;
    console.log("sssssss", userId, role);
    // Assuming userInfo contains userId and role
    let reservations;

    if (role === "admin") {
      // Admin fetches all reservations and populates user info
      reservations = await Reservation.find().populate(
        "userId",
        "userName email phone"
      );
    } else if (role === "user") {
      // Users fetch their own reservations
      reservations = await Reservation.find({ userId: userId });
    }

    if (reservations) {
      res
        .status(200)
        .json({ message: "Reservations fetched successfully", reservations });
    } else {
      res.status(404).json({ message: "No reservations found" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to retrieve reservations", error: err.message });
  }
};

// GET /api/reservations/:id: Get reservation details by ID
export const getReservationById = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findById(id).populate(
      "userId",
      "name email"
    );
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    } else {
      res.status(200).json(reservation);
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to retrieve reservation", error: err.message });
  }
};

// PUT /api/reservations/:id: Update a reservation (admin or user)
export const updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time, tableNumber, numberOfGuests } = req.body;

    const updatedReservation = await Reservation.findByIdAndUpdate(
      id,
      { date, time, tableNumber, numberOfGuests, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedReservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.status(200).json({
      message: "Reservation updated successfully",
      updatedReservation,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update reservation", error: err.message });
  }
};

// DELETE /api/reservations/:id: Cancel a reservation
export const cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const newOrderStatus = req.body.status;

    const canceledReservation = await Reservation.findByIdAndDelete({
      _id: id,
    });

    if (!canceledReservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.status(200).json({
      message: "Reservation Updated successfully",
      canceledReservation,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to cancel reservation", error: err.message });
  }
};

// For testing
export const getReservationsss = async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.status(200).json(reservations);
  } catch (err) {
    res.status(500).json({
      message: "Failed to retrieve reservations",
      error: err.message,
    });
  }
};
