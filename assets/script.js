// script.js

// ------------------ Theme Toggle ------------------
function initThemeToggle() {
  const toggleBtn = document.getElementById("toggle-mode");
  if (!toggleBtn) return;

  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    toggleBtn.textContent = document.body.classList.contains("dark-mode")
      ? "☀️"
      : "🌙";
  });
}

// ------------------ Load Appointments on Home Page ------------------
function loadAppointments() {
  const listDiv = document.getElementById("appointmentList");
  if (!listDiv) return;

  const appointments = JSON.parse(localStorage.getItem("appointments")) || [];
  if (appointments.length === 0) {
    listDiv.innerHTML = "<p>No previous appointments.</p>";
    return;
  }

  listDiv.innerHTML =
    "<h3>Previous Appointments</h3>" +
    appointments
      .map(
        (app) => `
      <div class="appointment-item">
        <strong>${app.name}</strong><br>
        ${app.service} on ${new Date(app.datetime).toLocaleString()}<br>
        📞 ${app.phone} | ✉️ ${app.email}
      </div>
    `
      )
      .join("");
}

// ------------------ Form Submission Logic ------------------
function setupFormSubmission() {
  const form = document.getElementById("appointmentForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const datetime = document.getElementById("datetime").value;
    const service = document.getElementById("service").value;

    if (!name || !email || !phone || !datetime || !service) {
      alert("Please fill in all fields.");
      return;
    }

    const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    const phonePattern = /^[0-9]{10}$/;

    if (!emailPattern.test(email)) {
      alert("Please enter a valid email.");
      return;
    }

    if (!phonePattern.test(phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    const appointment = { name, email, phone, datetime, service };
    let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
    appointments.push(appointment);
    localStorage.setItem("appointments", JSON.stringify(appointments));
    localStorage.setItem("currentAppointment", JSON.stringify(appointment));

    window.location.href = "confirmation.html";
  });
}

// ------------------ Load Confirmation Data ------------------
function loadConfirmation() {
  const data = JSON.parse(localStorage.getItem("currentAppointment"));
  if (!data) {
    location.href = "index.html";
    return;
  }

  const map = {
    userName: data.name,
    "c-name": data.name,
    "c-email": data.email,
    "c-phone": data.phone,
    "c-datetime": new Date(data.datetime).toLocaleString(),
    "c-service": data.service,
  };

  Object.entries(map).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  });
}

// ------------------ Global Initialization ------------------
document.addEventListener("DOMContentLoaded", function () {
  initThemeToggle();

  // Only call functions if corresponding elements exist
  if (document.getElementById("appointmentList")) {
    loadAppointments();
  }

  if (document.getElementById("appointmentForm")) {
    setupFormSubmission();
  }

  if (document.getElementById("confirmationPage")) {
    loadConfirmation();
  }
});
