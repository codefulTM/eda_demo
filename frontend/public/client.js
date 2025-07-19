const form = document.getElementById('orderForm');
const events = document.getElementById('events');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const customer = document.getElementById('customer').value;
  const pizza = document.getElementById('pizza').value;

  await fetch('http://localhost:4000/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customer, pizza }),
  });
});

const ws = new WebSocket('ws://localhost:5000');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  const item = document.createElement('li');
  item.className = "px-4 py-2 rounded-lg border shadow-sm animate-fade-in";

  // Tuỳ biến giao diện và nội dung theo loại sự kiện
  switch (data.type) {
    case 'order_created':
      item.classList.add("bg-blue-100", "border-blue-300");
      item.textContent = `📦 Order ${data.orderId} has been placed by ${data.customer}`;
      break;

    case 'pizza_prepared':
      item.classList.add("bg-green-100", "border-green-300");
      item.textContent = `👨‍🍳 Pizza for Order ${data.orderId} is ready!`;
      break;

    case 'pizza_delivered':
      item.classList.add("bg-purple-100", "border-purple-300");
      item.textContent = `🚚 Order ${data.orderId} has been delivered to ${data.customer}`;
      break;

    default:
      item.classList.add("bg-gray-100", "border-gray-300");
      item.textContent = `📌 Unknown event for Order ${data.orderId}`;
      break;
  }

  events.prepend(item);
};
