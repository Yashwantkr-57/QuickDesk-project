function logout() {
  localStorage.clear();
  window.location.href = "login-register.html";
}

const ticketForm = document.getElementById("ticketForm");
const ticketsContainer = document.getElementById("ticketsContainer");
let tickets = JSON.parse(localStorage.getItem("tickets")) || [];

function renderTickets(data) {
  if (!ticketsContainer) return;
  ticketsContainer.innerHTML = "";
  data.forEach((ticket, index) => {
    const div = document.createElement("div");
    div.className = "ticket";
    div.innerHTML = `
      <strong>${ticket.subject}</strong><br>
      <em>${ticket.category}</em> - ${ticket.status}<br>
      Date: ${ticket.date}<br>
      ${ticket.description}<br>
      ${ticket.status === "completed" ? `
        <strong>Rating:</strong> ${ticket.rating || 'N/A'} ⭐<br>
        <strong>Feedback:</strong> ${ticket.feedback || 'N/A'}<br>
      ` : ""}
      <br>
      <button onclick="updateStatus(${index}, 'in progress')">In Progress</button>
      <button onclick="updateStatus(${index}, 'completed')">Completed</button>
      <button onclick="deleteTicket(${index})">Delete</button>
    `;
    ticketsContainer.appendChild(div);
  });
}

function filterTickets(status) {
  renderTickets(status === "all" ? tickets : tickets.filter(t => t.status.toLowerCase() === status));
}

function updateStatus(index, newStatus) {
  tickets[index].status = newStatus;

  if (newStatus === "completed") {
    const rating = prompt("Please rate your experience (1–5):", "5");
    const feedback = prompt("Leave your feedback:");
    tickets[index].rating = rating || "N/A";
    tickets[index].feedback = feedback || "N/A";
  }

  localStorage.setItem("tickets", JSON.stringify(tickets));
  renderTickets(tickets);
  showNotification(`Marked "${tickets[index].subject}" as ${newStatus}`);
}

function deleteTicket(index) {
  showNotification(`Deleted ticket: ${tickets[index].subject}`);
  tickets.splice(index, 1);
  localStorage.setItem("tickets", JSON.stringify(tickets));
  renderTickets(tickets);
}

if (ticketForm) {
  ticketForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const subject = document.getElementById("subject").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;

    const newTicket = {
      subject,
      description,
      category,
      date,
      rating: null,
      feedback: null,
      status: "open"
    };

    tickets.push(newTicket);
    localStorage.setItem("tickets", JSON.stringify(tickets));
    renderTickets(tickets);
    showNotification(`Ticket submitted: ${subject}`);
    ticketForm.reset();
  });
}

// Notifications
function toggleNotifications() {
  const box = document.getElementById("notificationBox");
  if (box) box.style.display = box.style.display === "block" ? "none" : "block";
}

function showNotification(message) {
  const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
  notifications.push({ message, time: new Date().toLocaleTimeString() });
  localStorage.setItem("notifications", JSON.stringify(notifications));
  updateNotificationUI();
  simulateEmailNotification(message);
}

function updateNotificationUI() {
  const list = document.getElementById("notificationList");
  const count = document.getElementById("notificationCount");
  const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
  if (list && count) {
    list.innerHTML = "";
    notifications.forEach(n => {
      const li = document.createElement("li");
      li.textContent = `${n.message} • ${n.time}`;
      list.appendChild(li);
    });
    count.textContent = notifications.length;
  }
}

function clearNotifications() {
  localStorage.removeItem("notifications");
  updateNotificationUI();
}

function simulateEmailNotification(message) {
  const users = JSON.parse(localStorage.getItem("users") || "{}");
  const loggedUser = localStorage.getItem("loggedUser");
  const email = users[loggedUser]?.email;
  if (email) {
    console.log(`Simulating email to ${email}: ${message}`);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  renderTickets(tickets);
  updateNotificationUI();
});




