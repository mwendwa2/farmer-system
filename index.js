// Global Data Storage
const salesData = {};   // Object to track product: total quantity sold
let totalRevenue = 0;
let totalExpenses = 0;
const salesLogs = [];   // Array to store current sales records
const logsRecords = []; // Array to store created logs

// Notification function with a variety of colors
function notify(message) {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = 'notification';
    // Array of diverse cool colors
    const colors = ['#F44336', '#2196F3', '#E91E63', '#9C27B0', '#795548', '#4CAF50', '#FF9800'];
    // Choose a random color from the array
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    notification.style.background = randomColor;
    notification.textContent = message;
    container.appendChild(notification);
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
  

// Display system after successful sign-up
const signupFormData = document.getElementById('signupFormData');
const signupForm = document.getElementById('signupForm');
const systemContainer = document.getElementById('systemContainer');

signupFormData.addEventListener('submit', function (e) {
  e.preventDefault();
  // Hide the sign-up form and show the Farmer's System
  signupForm.style.display = 'none';
  systemContainer.style.display = 'block';
  // Initialize the Analytics Chart after system is loaded
  initializeChart();
});

// Switch between sections
const salesTrackerBtn = document.getElementById('salesTrackerBtn');
const spendingTrackerBtn = document.getElementById('spendingTrackerBtn');
const analyticsBtn = document.getElementById('analyticsBtn');
const logBtn = document.getElementById('logBtn');

const salesTracker = document.getElementById('salesTracker');
const spendingTracker = document.getElementById('spendingTracker');
const analyticsDashboard = document.getElementById('analyticsDashboard');
const logs = document.getElementById('logs');

salesTrackerBtn.addEventListener('click', () => {
  salesTracker.style.display = 'block';
  spendingTracker.style.display = 'none';
  analyticsDashboard.style.display = 'none';
  logs.style.display = 'none';
});

spendingTrackerBtn.addEventListener('click', () => {
  salesTracker.style.display = 'none';
  spendingTracker.style.display = 'block';
  analyticsDashboard.style.display = 'none';
  logs.style.display = 'none';
});

analyticsBtn.addEventListener('click', () => {
  salesTracker.style.display = 'none';
  spendingTracker.style.display = 'none';
  analyticsDashboard.style.display = 'block';
  logs.style.display = 'none';
});

logBtn.addEventListener('click', () => {
  salesTracker.style.display = 'none';
  spendingTracker.style.display = 'none';
  analyticsDashboard.style.display = 'none';
  logs.style.display = 'block';
});

// Start with Sales Tracker visible
salesTracker.style.display = 'block';

// Initialize Chart.js chart
let analyticsChart;
function initializeChart() {
  const ctx = document.getElementById('analyticsChart').getContext('2d');
  analyticsChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        label: 'Sales Quantity',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Update Analytics Chart
function updateChart() {
  if (!analyticsChart) return;
  analyticsChart.data.labels = Object.keys(salesData);
  analyticsChart.data.datasets[0].data = Object.values(salesData);
  analyticsChart.update();
}

// Update Profit/Loss value
function updateProfitLoss() {
  const profitLoss = totalRevenue - totalExpenses;
  document.getElementById('profitLossValue').textContent = profitLoss;
}

// Recalculate global salesData and totalRevenue from salesLogs
function recalcSalesData() {
  totalRevenue = 0;
  // Reset salesData object
  for (let key in salesData) {
    delete salesData[key];
  }
  salesLogs.forEach(log => {
    totalRevenue += log.quantity * log.price;
    if (salesData[log.product]) {
      salesData[log.product] += log.quantity;
    } else {
      salesData[log.product] = log.quantity;
    }
  });
  updateChart();
  updateProfitLoss();
}

// Render sales list UI with edit and delete buttons
function renderSalesList() {
  const salesList = document.getElementById('salesList');
  salesList.innerHTML = '';
  salesLogs.forEach((log, index) => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `${log.quantity} x ${log.product} @ ${log.price} each`;
    
    // Container for edit and delete actions
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'sale-actions';
    
    // Edit button - allows editing all fields
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', function () {
      const newProduct = prompt('Enter new product name:', log.product);
      const newQuantityInput = prompt('Enter new quantity:', log.quantity);
      const newPriceInput = prompt('Enter new price per unit:', log.price);
      
      // Check if user did not cancel any prompt
      if (newProduct !== null && newQuantityInput !== null && newPriceInput !== null) {
        const newQuantity = parseFloat(newQuantityInput);
        const newPrice = parseFloat(newPriceInput);
        if (newProduct && newQuantity && newPrice) {
          salesLogs[index] = { product: newProduct, quantity: newQuantity, price: newPrice };
          notify(`Sale entry updated for ${newProduct}`);
          recalcSalesData();
          renderSalesList();
        } else {
          alert('Invalid input. Update cancelled.');
        }
      }
    });
    
    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', function () {
      if (confirm('Are you sure you want to delete this sale entry?')) {
        salesLogs.splice(index, 1);
        notify('Sale entry deleted');
        recalcSalesData();
        renderSalesList();
      }
    });
    
    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);
    listItem.appendChild(actionsDiv);
    salesList.appendChild(listItem);
  });
}

// Handle Sales Form Submission
document.getElementById('salesForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const product = document.getElementById('product').value;
  const quantity = parseFloat(document.getElementById('quantity').value);
  const price = parseFloat(document.getElementById('price').value);
  
  if (!product || !quantity || !price) {
    alert('Please fill all fields.');
    return;
  }
  
  // Save the sale log for export and later edit/delete
  salesLogs.push({ product, quantity, price });
  
  // Update global sales data and revenue
  totalRevenue += quantity * price;
  if (salesData[product]) {
    salesData[product] += quantity;
  } else {
    salesData[product] = quantity;
  }
  
  updateChart();
  updateProfitLoss();
  
  // Render updated sales list with edit and delete options
  renderSalesList();
  
  // Notify farmer that sale is recorded
  notify(`Product sold: ${quantity} x ${product} @ ${price} each`);
  
  // Clear form
  e.target.reset();
});

// Handle Spending Form Submission
document.getElementById('spendingForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const expenseName = document.getElementById('expenseName').value;
  const expenseAmount = parseFloat(document.getElementById('expenseAmount').value);

  if (!expenseName || !expenseAmount) {
    alert('Please fill all fields.');
    return;
  }

  // Update spending list UI
  const listItem = document.createElement('li');
  listItem.textContent = `${expenseName}: ${expenseAmount}`;
  document.getElementById('spendingList').appendChild(listItem);

  // Update global expenses and profit/loss
  totalExpenses += expenseAmount;
  updateProfitLoss();
  
  // Notify farmer that spending is added
  notify(`Spending added: ${expenseName} - ${expenseAmount}`);
  
  // Clear form
  e.target.reset();
});

// Export Current Sales Logs to CSV (for current session)
document.getElementById('exportLogsBtn').addEventListener('click', function () {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Product,Quantity,Price per Unit,Total Revenue\n";
  salesLogs.forEach(log => {
    const total = log.quantity * log.price;
    csvContent += `${log.product},${log.quantity},${log.price},${total}\n`;
  });
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "sales_log.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// New Log Creation - Save current sales logs under a given name and clear current sales log
document.getElementById('newLogForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const logName = document.getElementById('logName').value;
  if (!logName) {
    alert('Please provide a log name.');
    return;
  }
  if (salesLogs.length === 0) {
    alert("Current sales log is empty. No log to create.");
    return;
  }
  // Save current salesLogs as a new log
  logsRecords.push({ name: logName, sales: [...salesLogs] });
  // Clear current salesLogs and update UI
  salesLogs.length = 0;
  document.getElementById('salesList').innerHTML = '';
  renderSalesList();
  
  // Add new log to logsList UI
  const logItem = document.createElement('li');
  logItem.textContent = logName;
  const downloadButton = document.createElement('button');
  downloadButton.textContent = 'Download Log';
  downloadButton.style.marginLeft = '10px';
  downloadButton.addEventListener('click', function () {
    exportLogAsCSV(logName);
  });
  logItem.appendChild(downloadButton);
  document.getElementById('logsList').appendChild(logItem);
  
  // Clear the log name input
  e.target.reset();
});

// Function to export a specific log as CSV
function exportLogAsCSV(logName) {
  const log = logsRecords.find(l => l.name === logName);
  if (!log) {
    alert("Log not found.");
    return;
  }
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Product,Quantity,Price per Unit,Total Revenue\n";
  log.sales.forEach(item => {
    const total = item.quantity * item.price;
    csvContent += `${item.product},${item.quantity},${item.price},${total}\n`;
  });
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", logName + "_sales_log.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
