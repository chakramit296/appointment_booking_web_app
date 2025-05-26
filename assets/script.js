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
    //const feedback = document.getElementById(feedbackId);

    if (!name || !email || !phone || !datetime || !service) {
      alert("Please fill in all fields.");
      return;
    }

    const isNameValid = validateName("name", "nameFeedback");
    const isPhoneValid = validatePhoneNumber("phone", "phoneFeedback");
    const isEmailValid = validateEmail("email", "emailFeedback");
    const isDateTimeValid = validateDateTime("datetime", "datetimeFeedback");

    if (!isNameValid || !isPhoneValid || !isEmailValid || !isDateTimeValid) {
      return; // stop submission
    }

    //NAME VALIDATION FUNCTION
    function validateName(nameInputId, feedbackId) {
      const name = document.getElementById(nameInputId).value.trim();
      const feedback = document.getElementById(feedbackId);
      const namePattern = /^[A-Za-z\s]+$/;
      if (name === "") {
        feedback.textContent = "Name cannot be empty.";
        feedback.style.color = "red";
        return false;
      }
      if (!namePattern.test(name)) {
        feedback.textContent = "Name must contain only letters and spaces.";
        feedback.style.color = "red";
        return false;
      }
      feedback.textContent = "You're good to go.";
      feedback.style.color = "green";
      return true;
    }

    //EMAIL VALIDATION FUNCTION
    function validateEmail(emailInputId, feedbackId) {
      const email = document.getElementById(emailInputId).value.trim();
      const feedback = document.getElementById(feedbackId);
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (email === "") {
        feedback.textContent = "Email cannot be empty.";
        feedback.style.color = "red";
        return false;
      }
      if (!emailPattern.test(email)) {
        feedback.textContent =
          "Enter a valid email id([A-Z][a-z][0-9] % _ - . +)";
        feedback.style.color = "red";
        return false;
      }
      feedback.textContent = "You're good to go.";
      feedback.style.color = "green";
      return true;
    }

    // PHONE VALIDATION FUNCTION
    function validatePhoneNumber(phoneInputId, feedbackId) {
      const phone = document.getElementById(phoneInputId).value.trim();
      const feedback = document.getElementById(feedbackId);
      const phonePattern = /^[6-9]\d{9}$/;
      // 1. Format check
      if (!phonePattern.test(phone)) {
        feedback.textContent =
          "Invalid format. Enter a valid 10-digit Indian number.";
        feedback.style.color = "red";
        return false;
      }
      // 2. Duplicate check in localStorage
      const appointments =
        JSON.parse(localStorage.getItem("appointments")) || [];
      const duplicate = appointments.some((app) => app.phone === phone);
      if (duplicate) {
        feedback.textContent = "This phone number has already been used.";
        feedback.style.color = "orange";
        return false;
      }
      // 3. Valid
      feedback.textContent = "You're good to go.";
      feedback.style.color = "green";
      return true;
    }

    //DATETIME VALIDATION FUNCTION
    function validateDateTime(datetimeInputId, feedbackId) {
      const input = document.getElementById(datetimeInputId).value;
      const feedback = document.getElementById(feedbackId);
      if (!input) {
        feedback.textContent = "Please select a date and time.";
        feedback.style.color = "red";
        return false;
      }
      const selectedDateTime = new Date(input);
      const now = new Date();
      if (selectedDateTime < now) {
        feedback.textContent = "Please choose a future date and time.";
        feedback.style.color = "red";
        return false;
      }
      feedback.textContent = "Date & Time is valid.";
      feedback.style.color = "green";
      return true;
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
