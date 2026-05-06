document.addEventListener("DOMContentLoaded", function () {
  const bookingData = JSON.parse(localStorage.getItem("bookingData"));
  const email = localStorage.getItem("user_email");

  if (email) {
    const userInfo = document.getElementById("userInfo");
    if (userInfo) {
      userInfo.textContent = email;
    }
  }

  if (!bookingData) {
    window.location.href = "search.html";
    return;
  }

  const routeText = document.getElementById("routeText");
  const tripIdText = document.getElementById("tripIdText");
  const seatClassText = document.getElementById("seatClassText");
  const priceText = document.getElementById("priceText");
  const confirmBtn = document.getElementById("confirmBtn");
  const message = document.getElementById("message");

  routeText.textContent = `${bookingData.from} → ${bookingData.to}`;
  tripIdText.textContent = bookingData.trip_id;
  seatClassText.textContent = bookingData.seat_class;
  priceText.textContent = `${bookingData.price} SAR`;

  confirmBtn.addEventListener("click", async function () {
    try {
      const response = await fetch("http://localhost:3000/confirm-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bookingData)
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("bookingResult", JSON.stringify(result));
        window.location.href = "success.html";
      } else {
        message.textContent = result.error || "Booking failed.";
      }
    } catch (error) {
      message.textContent = "Cannot connect to the server. Make sure server.js is running.";
    }
  });
});