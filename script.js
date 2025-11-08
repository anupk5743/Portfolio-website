// Startup + Login
const startupScreen = document.getElementById('startupScreen');
const loginScreen = document.getElementById('loginScreen');
const desktop = document.getElementById('desktop');

let progress = 0;
const progressBar = document.getElementById('progress');

const startupInterval = setInterval(() => {
  progress += 5;
  progressBar.style.width = progress + '%';
  if (progress >= 100) {
    clearInterval(startupInterval);
    startupScreen.style.display = 'none';
    loginScreen.style.display = 'flex';
  }
}, 100);

function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  if (username && password) {
    loginScreen.style.display = 'none';
    desktop.style.display = 'flex';
  } else {
    alert('Enter username and password');
  }
}

// Window functions
function openWindow(winId) {
  const win = document.getElementById(winId);
  if(win) win.style.display = 'block';
}

function closeWindow(winId) {
  const win = document.getElementById(winId);
  if(win) win.style.display = 'none';
}

function minimizeWindow(winId) {
  const win = document.getElementById(winId);
  if (!win) return;

  win.style.display = 'none';
  const minimizedWindows = document.getElementById('minimizedWindows');

  if (!document.getElementById('taskbar-' + winId)) {
    const icon = document.createElement('img');
    icon.id = 'taskbar-' + winId;
    icon.className = 'taskbar-icon';
    icon.src = win.getAttribute('data-icon');
    icon.alt = win.querySelector('.window-header span').textContent;
    icon.title = win.querySelector('.window-header span').textContent;
    icon.onclick = () => restoreWindow(winId, icon.id);
    minimizedWindows.appendChild(icon);
  }
}

function restoreWindow(winId, iconId) {
  const win = document.getElementById(winId);
  if(win) win.style.display = 'block';
  const icon = document.getElementById(iconId);
  if(icon) icon.parentNode.removeChild(icon);
}

// Fullscreen for Resume
function fullscreenResume() {
  const win = document.getElementById('resume');
  const iframe = document.getElementById('resumeFrame');
  if(!win.classList.contains('fullscreen')){
    win.classList.add('fullscreen');
    win.style.top='0'; win.style.left='0';
    win.style.width='100%'; win.style.height='100vh';
    iframe.style.height='90vh';
  } else {
    win.classList.remove('fullscreen');
    win.style.width='400px'; win.style.height='auto';
    win.style.top='100px'; win.style.left='100px';
    iframe.style.height='400px';
  }
}

// Print Resume
function printResume() {
  const iframe = document.getElementById('resumeFrame');
  iframe.contentWindow.focus();
  iframe.contentWindow.print();
}

// Theme toggle
function toggleTheme() {
  document.body.classList.toggle('dark');
}

// Clock
function updateClock() {
  const clock = document.getElementById('clock');
  const now = new Date();
  clock.textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

// Draggable windows
let draggedWindow = null;
let offsetX=0, offsetY=0;

function dragStart(e, winId){
  draggedWindow = document.getElementById(winId);
  offsetX = e.clientX - draggedWindow.offsetLeft;
  offsetY = e.clientY - draggedWindow.offsetTop;
  document.addEventListener('mousemove', dragMove);
  document.addEventListener('mouseup', dragEnd);
}

function dragMove(e){
  if(draggedWindow){
    draggedWindow.style.left = (e.clientX - offsetX) + 'px';
    draggedWindow.style.top = (e.clientY - offsetY) + 'px';
  }
}

function dragEnd(){
  draggedWindow = null;
  document.removeEventListener('mousemove', dragMove);
  document.removeEventListener('mouseup', dragEnd);
}

// Maximize Window
function maximizeWindow(winId){
  const win = document.getElementById(winId);
  if(win.classList.contains('maximized')){
    win.classList.remove('maximized');
    win.style.width='400px';
    win.style.height='auto';
    win.style.top='100px';
    win.style.left='100px';
  } else {
    win.classList.add('maximized');
    win.style.top='0';
    win.style.left='0';
    win.style.width='100%';
    win.style.height='100vh';
  }
}

// Project filter
function filterProjects(){
  const input = document.getElementById('search').value.toLowerCase();
  const items = document.querySelectorAll('.project-item');
  items.forEach(item=>{
    if(item.dataset.name.toLowerCase().includes(input)) item.style.display='flex';
    else item.style.display='none';
  });
}

function openProject(url){
  window.open(url,'_blank');
}

// Start Menu
function toggleStartMenu(){
  const menu = document.getElementById('startMenu');
  menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
}

// Desktop Search
const searchData = [
  { name: 'About Me', window: 'about', icon: '👤' },
  { name: 'Skills', window: 'skills', icon: '💻' },
  { name: 'Projects', window: 'projects', icon: '📁' },
  { name: 'Contact', window: 'contact', icon: '📧' },
  { name: 'Resume', window: 'resume', icon: '📄' },
  { name: 'Settings', window: 'settings', icon: '⚙️' },
  { name: 'Help', window: 'help', icon: '❓' }
];

function searchDesktop() {
  const searchInput = document.getElementById('desktopSearch');
  const resultsContainer = document.getElementById('searchResults');
  const query = searchInput.value.toLowerCase().trim();
  
  if (query === '') {
    resultsContainer.classList.remove('show');
    return;
  }
  
  const results = searchData.filter(item => 
    item.name.toLowerCase().includes(query)
  );
  
  if (results.length === 0) {
    resultsContainer.innerHTML = '<div class="search-result-item">No results found</div>';
    resultsContainer.classList.add('show');
    return;
  }
  
  resultsContainer.innerHTML = results.map(item => `
    <div class="search-result-item" onclick="openWindow('${item.window}'); document.getElementById('desktopSearch').value = ''; document.getElementById('searchResults').classList.remove('show');">
      <span style="margin-right: 10px;">${item.icon}</span>
      <span>${item.name}</span>
    </div>
  `).join('');
  
  resultsContainer.classList.add('show');
}

// Close search results when clicking outside
document.addEventListener('click', (e) => {
  const searchContainer = document.querySelector('.desktop-search');
  if (searchContainer && !searchContainer.contains(e.target)) {
    document.getElementById('searchResults').classList.remove('show');
  }
});

// Notification System
function showNotification(message, type = 'info', title = '') {
  const container = document.getElementById('notificationContainer');
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };
  
  notification.innerHTML = `
    <span class="notification-icon">${icons[type] || icons.info}</span>
    <div class="notification-content">
      ${title ? `<div class="notification-title">${title}</div>` : ''}
      <div class="notification-message">${message}</div>
    </div>
  `;
  
  container.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'fadeOut 0.3s ease forwards';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Settings Functions
function changeAnimationSpeed() {
  const speed = document.getElementById('animationSpeed').value;
  const root = document.documentElement;
  
  let multiplier = 1;
  if (speed === 'slow') multiplier = 2;
  if (speed === 'fast') multiplier = 0.5;
  
  root.style.setProperty('--animation-speed', multiplier);
  showNotification(`Animation speed set to ${speed}`, 'success');
}

function toggleNotifications() {
  const enabled = document.getElementById('notificationsEnabled').checked;
  if (enabled) {
    showNotification('Notifications enabled', 'success');
  } else {
    showNotification('Notifications disabled', 'info');
  }
}

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
  // Close window with Esc
  if (e.key === 'Escape') {
    const openWindows = document.querySelectorAll('.window[style*="display: block"]');
    if (openWindows.length > 0) {
      const lastWindow = openWindows[openWindows.length - 1];
      closeWindow(lastWindow.id);
    }
  }
  
  // Toggle theme with Ctrl+T
  if (e.ctrlKey && e.key === 't') {
    e.preventDefault();
    toggleTheme();
  }
  
  // Focus search with Ctrl+F
  if (e.ctrlKey && e.key === 'f') {
    e.preventDefault();
    const searchInput = document.getElementById('desktopSearch');
    if (searchInput) {
      searchInput.focus();
    }
  }
});

// Show welcome notification on load
window.addEventListener('load', () => {
  setTimeout(() => {
    if (document.getElementById('desktop').style.display === 'flex') {
      showNotification('Welcome to the portfolio! Use Ctrl+F to search.', 'info', 'Welcome');
    }
  }, 1000);
});