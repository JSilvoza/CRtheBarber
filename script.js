document.getElementById('year').textContent = new Date().getFullYear();

const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');

navToggle.addEventListener('click', () => {
  nav.classList.toggle('nav-open');
});

// ---------- Booking widget ----------

// TODO: replace with your real contact/booking inbox before publishing.
const SHOP_EMAIL = 'SHOP_EMAIL_PLACEHOLDER@example.com';

const serviceSelect = document.getElementById('service-select');
const dateInput = document.getElementById('date-select');
const timeSlotsContainer = document.getElementById('time-slots');
const reserveBtn = document.getElementById('reserve-btn');
const bookingForm = document.getElementById('booking-form');
const confirmationEl = document.getElementById('booking-confirmation');

let selectedTime = null;

function generateTimeSlots(startHour, endHour, intervalMinutes) {
  const slots = [];
  let current = startHour * 60;
  const end = endHour * 60;
  while (current <= end) {
    const h24 = Math.floor(current / 60);
    const m = current % 60;
    const period = h24 >= 12 ? 'PM' : 'AM';
    let h12 = h24 % 12;
    if (h12 === 0) h12 = 12;
    slots.push(`${h12}:${m.toString().padStart(2, '0')} ${period}`);
    current += intervalMinutes;
  }
  return slots;
}

function renderTimeSlots() {
  const slots = generateTimeSlots(11, 16, 30); // 11:00 AM - 4:00 PM, 30-min steps
  timeSlotsContainer.innerHTML = '';
  slots.forEach((slot) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'time-slot';
    btn.textContent = slot;
    btn.addEventListener('click', () => selectTimeSlot(btn, slot));
    timeSlotsContainer.appendChild(btn);
  });
}

function selectTimeSlot(button, slot) {
  document.querySelectorAll('.time-slot').forEach((el) => el.classList.remove('selected'));
  button.classList.add('selected');
  selectedTime = slot;
  updateReserveState();
}

function updateReserveState() {
  const hasService = !!serviceSelect.value;
  const hasDate = !!dateInput.value;
  const hasTime = !!selectedTime;
  reserveBtn.disabled = !(hasService && hasDate && hasTime);
}

function preselectService(serviceName) {
  const options = Array.from(serviceSelect.options);
  const match = options.find((opt) => opt.value === serviceName);
  if (match) {
    serviceSelect.value = serviceName;
    updateReserveState();
  }
}

// Wire up each service row's "Book" button to preselect that service
document.querySelectorAll('.service-book-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    preselectService(btn.dataset.service);
  });
});

// Set date input minimum to today, no past-date bookings
const today = new Date().toISOString().split('T')[0];
dateInput.min = today;

serviceSelect.addEventListener('change', updateReserveState);
dateInput.addEventListener('change', updateReserveState);

renderTimeSlots();

bookingForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const service = serviceSelect.value;
  const date = dateInput.value;

  const subject = encodeURIComponent(`Booking Request - ${service}`);
  const body = encodeURIComponent(
    `Service: ${service}\nDate: ${date}\nTime: ${selectedTime}\n\nPlease confirm this appointment.`
  );

  window.location.href = `mailto:${SHOP_EMAIL}?subject=${subject}&body=${body}`;

  confirmationEl.hidden = false;
  confirmationEl.textContent = `Request sent: ${service} on ${date} at ${selectedTime}. You'll receive a confirmation shortly.`;
});
