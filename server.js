const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

/* -----------------------------
   Basic app config
----------------------------- */
app.use(express.json());
app.use(express.static(__dirname));

/* -----------------------------
   In-memory trip data
   Trusted server-side source
----------------------------- */
const trips = [
  {
    trip_id: "372617",
    from: "Makkah",
    to: "Madinah",
    economyPrice: 50,
    businessPrice: 200
  }
];

/* -----------------------------
   Simple fixed authenticated user
   We intentionally DO NOT trust
   user_id from the client
----------------------------- */
const AUTHENTICATED_USER_ID = "1001";

/* -----------------------------
   Booking endpoint
   Intended vulnerability:
   server trusts client-supplied price
----------------------------- */
app.post("/confirm-booking", (req, res) => {
  const { trip_id, seat_class, price } = req.body;

  if (typeof trip_id !== "string") {
    return res.status(400).json({ error: "Invalid trip_id." });
  }

  const trip = trips.find((t) => t.trip_id === trip_id);

  if (!trip) {
    return res.status(404).json({ error: "Trip not found." });
  }

  if (!["Economy", "Business"].includes(seat_class)) {
    return res.status(400).json({ error: "Invalid seat class." });
  }

  if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
    return res.status(400).json({ error: "Invalid price." });
  }

  const bookingResult = {
    booking_id: "BK" + Math.floor(Math.random() * 100000),
    trip_id: trip.trip_id,
    from: trip.from,
    to: trip.to,
    seat_class: seat_class,
    price: price,
    user_id: AUTHENTICATED_USER_ID,
    message: "Booking confirmed successfully."
  };

  if (seat_class === "Business" && price === trip.economyPrice) {
    bookingResult.flag = "FLAG{business_class_booked_at_economy_price}";
  }

  return res.status(200).json(bookingResult);
});

/* -----------------------------
   Start server
----------------------------- */
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});