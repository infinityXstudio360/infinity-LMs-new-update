// 1. Mobile Menu Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

if (mobileMenu && navLinks) {
    mobileMenu.addEventListener('click', () => {
        if (navLinks.style.display === 'flex') {
            navLinks.style.display = 'none';
        } else {
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '70px';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.backgroundColor = '#384959';
            navLinks.style.padding = '20px';
            navLinks.style.borderBottom = '1px solid #6A89A7';
        }
    });
}

// Notification Dropdown Toggle Logic
const notifIcon = document.getElementById('notif-icon');
const notifDropdown = document.getElementById('notif-dropdown');

if (notifIcon && notifDropdown) {
    notifIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        notifDropdown.classList.toggle('show');
    });

    window.addEventListener('click', () => {
        if (notifDropdown.classList.contains('show')) {
            notifDropdown.classList.remove('show');
        }
    });

    notifDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

function updateNotifications() {
    let tasks = JSON.parse(localStorage.getItem('infinityx_tasks')) || [];
    let notifList = document.getElementById('notif-list');
    let notifBadge = document.getElementById('notif-badge');

    // Active (incomplete) tasks පමණක් notifications ලෙස පෙන්වමු
    let activeTasks = tasks.filter(t => !t.completed);

    if (notifList && notifBadge) {
        notifList.innerHTML = "";
        if (activeTasks.length > 0) {
            notifBadge.style.display = 'inline-block';
            notifBadge.innerText = activeTasks.length;

            activeTasks.forEach(task => {
                let li = document.createElement('li');
                li.innerHTML = `<strong>${task.topic}</strong><br><small>${task.date ? task.date : 'Today'} (${task.time || 'Anytime'})</small>`;
                notifList.appendChild(li);
            });
        } else {
            notifBadge.style.display = 'none';
            notifList.innerHTML = `<li style="text-align: center; color: #888;">No active tasks</li>`;
        }
    }
}

// Call on page load
updateNotifications();



// 3. Ad-Free YouTube Player
const loadVideoBtn = document.getElementById('load-video-btn');
const ytInput = document.getElementById('yt-link-input');
const playerContainer = document.getElementById('player-frame-container');

if (loadVideoBtn && ytInput && playerContainer) {
    loadVideoBtn.addEventListener('click', () => {
        let url = ytInput.value.trim();
        let videoId = "";

        if (url.includes("youtu.be/")) {
            videoId = url.split("youtu.be/")[1]?.split("?")[0];
        } else if (url.includes("watch?v=")) {
            videoId = url.split("watch?v=")[1]?.split("&")[0];
        } else if (url.includes("embed/")) {
            videoId = url.split("embed/")[1]?.split("?")[0];
        }

        if (videoId) {
            playerContainer.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width:100%; height:450px; border-radius:8px; border:none;"></iframe>`;
        } else {
            alert("කරුණාකර නිවැරදි YouTube Video Link එකක් ඇතුළත් කරන්න!");
        }
    });
}

// 4. To-Do List with Checkbox, Date, Time & Details
const addTodoBtn = document.getElementById('add-todo-btn');
const todoTopicInput = document.getElementById('todo-topic');
const todoDateInput = document.getElementById('todo-date');
const todoTimeInput = document.getElementById('todo-time');
const todoDetailsInput = document.getElementById('todo-details');
const todoList = document.getElementById('todo-list');

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem('infinityx_tasks')) || [];
    if (todoList) {
        todoList.innerHTML = "";
        tasks.forEach((task, index) => {
            let li = document.createElement('li');
            li.style.flexDirection = 'column';
            li.style.alignItems = 'flex-start';
            li.style.gap = '5px';
            
            let textDecoration = task.completed ? 'line-through' : 'none';
            let opacityStyle = task.completed ? '0.6' : '1';
            li.style.opacity = opacityStyle;

            li.innerHTML = `
                <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <input type="checkbox" class="task-checkbox" data-index="${index}" ${task.completed ? 'checked' : ''} style="cursor: pointer; width: 16px; height: 16px;">
                        <strong style="color: #88BDF2; font-size: 14px; text-decoration: ${textDecoration};">${task.topic}</strong>
                    </div>
                    <i class="fa-solid fa-trash delete-task" data-index="${index}" style="cursor: pointer; color: #ff6b6b;"></i>
                </div>
                <div style="font-size: 11px; color: #BDDDFC; background: #273440; padding: 2px 8px; border-radius: 4px; margin-left: 26px;">
                    <i class="fa-regular fa-calendar"></i> ${task.date || 'No Date'} | <i class="fa-regular fa-clock"></i> ${task.time || 'No Time'}
                </div>
                <p style="font-size: 12px; color: #BDDDFC; opacity: 0.9; margin-top: 3px; margin-left: 26px; text-decoration: ${textDecoration};">${task.details}</p>
            `;
            todoList.appendChild(li);
        });

        document.querySelectorAll('.task-checkbox').forEach(chk => {
            chk.addEventListener('change', (e) => {
                let idx = e.target.getAttribute('data-index');
                tasks[idx].completed = e.target.checked;
                localStorage.setItem('infinityx_tasks', JSON.stringify(tasks));
                loadTasks();
                updateNotifications(); // Task complete වූ විට notification එක යාවත්කාලීන වේ
            });
        });

        document.querySelectorAll('.delete-task').forEach(del => {
            del.addEventListener('click', (e) => {
                let idx = e.target.getAttribute('data-index');
                tasks.splice(idx, 1);
                localStorage.setItem('infinityx_tasks', JSON.stringify(tasks));
                loadTasks();
                updateNotifications(); // Task එක මැකූ විට notification එක ඉවත් වේ
            });
        });
    }
}

if (addTodoBtn && todoTopicInput && todoList) {
    loadTasks();
    addTodoBtn.addEventListener('click', () => {
        let topic = todoTopicInput.value.trim();
        let date = todoDateInput ? todoDateInput.value : "";
        let time = todoTimeInput ? todoTimeInput.value.trim() : "";
        let details = todoDetailsInput ? todoDetailsInput.value.trim() : "";

        if (topic !== "") {
            let tasks = JSON.parse(localStorage.getItem('infinityx_tasks')) || [];
            tasks.push({ topic, date, time, details, completed: false });
            localStorage.setItem('infinityx_tasks', JSON.stringify(tasks));

            todoTopicInput.value = "";
            if(todoDateInput) todoDateInput.value = "";
            if(todoTimeInput) todoTimeInput.value = "";
            if(todoDetailsInput) todoDetailsInput.value = "";
            
            loadTasks();
            updateNotifications(); // අලුත් task එකක් එකතු කළ විට notification එකට එකතු වේ
        } else {
            alert("කරුණාකර Task Topic එකක් ඇතුළත් කරන්න!");
        }
    });
}

// 5. Subject-wise 3 Charts Analyzer
const addMarkBtn = document.getElementById('add-mark-btn');
const paperSubjectSelect = document.getElementById('paper-subject');
const paperNameInput = document.getElementById('paper-name');
const paperMarksInput = document.getElementById('paper-marks');
const marksList = document.getElementById('marks-list');

let chart1, chart2, chart3;

function initCharts() {
    const c1 = document.getElementById('subject1Chart');
    const c2 = document.getElementById('subject2Chart');
    const c3 = document.getElementById('subject3Chart');

    if (c1) {
        chart1 = new Chart(c1.getContext('2d'), {
            type: 'bar',
            data: { labels: [], datasets: [{ label: 'Subject 01 Marks (%)', data: [], backgroundColor: '#88BDF2', borderRadius: 5 }] },
            options: { responsive: true, scales: { y: { beginAtZero: true, max: 100, ticks: { color: '#BDDDFC' } }, x: { ticks: { color: '#BDDDFC' } } } }
        });
    }
    if (c2) {
        chart2 = new Chart(c2.getContext('2d'), {
            type: 'bar',
            data: { labels: [], datasets: [{ label: 'Subject 02 Marks (%)', data: [], backgroundColor: '#6A89A7', borderRadius: 5 }] },
            options: { responsive: true, scales: { y: { beginAtZero: true, max: 100, ticks: { color: '#BDDDFC' } }, x: { ticks: { color: '#BDDDFC' } } } }
        });
    }
    if (c3) {
        chart3 = new Chart(c3.getContext('2d'), {
            type: 'bar',
            data: { labels: [], datasets: [{ label: 'Subject 03 Marks (%)', data: [], backgroundColor: '#BDDDFC', borderRadius: 5 }] },
            options: { responsive: true, scales: { y: { beginAtZero: true, max: 100, ticks: { color: '#BDDDFC' } }, x: { ticks: { color: '#BDDDFC' } } } }
        });
    }
}

function loadMarks() {
    let marksData = JSON.parse(localStorage.getItem('infinityx_marks')) || [];
    if (marksList) {
        marksList.innerHTML = "";
        if (chart1) { chart1.data.labels = []; chart1.data.datasets[0].data = []; }
        if (chart2) { chart2.data.labels = []; chart2.data.datasets[0].data = []; }
        if (chart3) { chart3.data.labels = []; chart3.data.datasets[0].data = []; }

        marksData.forEach((item, index) => {
            let li = document.createElement('li');
            li.innerHTML = `<span>[${item.subject}] ${item.name}: <strong>${item.marks}%</strong></span> <i class="fa-solid fa-trash" style="cursor: pointer; color: #ff6b6b;"></i>`;
            
            li.querySelector('i').addEventListener('click', () => {
                marksData.splice(index, 1);
                localStorage.setItem('infinityx_marks', JSON.stringify(marksData));
                loadMarks();
            });

            marksList.appendChild(li);

            if (item.subject === 'Subject 1' && chart1) {
                chart1.data.labels.push(item.name);
                chart1.data.datasets[0].data.push(item.marks);
            } else if (item.subject === 'Subject 2' && chart2) {
                chart2.data.labels.push(item.name);
                chart2.data.datasets[0].data.push(item.marks);
            } else if (item.subject === 'Subject 3' && chart3) {
                chart3.data.labels.push(item.name);
                chart3.data.datasets[0].data.push(item.marks);
            }
        });

        if (chart1) chart1.update();
        if (chart2) chart2.update();
        if (chart3) chart3.update();
    }
}

if (document.getElementById('subject1Chart')) {
    initCharts();
    loadMarks();
}

if (addMarkBtn && paperSubjectSelect && paperNameInput && paperMarksInput) {
    addMarkBtn.addEventListener('click', () => {
        let subject = paperSubjectSelect.value;
        let name = paperNameInput.value.trim();
        let marks = parseFloat(paperMarksInput.value.trim());
        
        if (name && !isNaN(marks)) {
            let marksData = JSON.parse(localStorage.getItem('infinityx_marks')) || [];
            marksData.push({ subject, name, marks });
            localStorage.setItem('infinityx_marks', JSON.stringify(marksData));

            paperNameInput.value = "";
            paperMarksInput.value = "";
            loadMarks();
        } else {
            alert("කරුණාකර නිවැරදි දත්ත ඇතුළත් කරන්න!");
        }
    });
}

// 6. Working Hours Tracker Tab Logic
const addHourBtn = document.getElementById('add-hour-btn');
const studyDateInput = document.getElementById('study-date');
const studyHoursInput = document.getElementById('study-hours');
const hoursList = document.getElementById('hours-list');

let hoursChartInstance = null;

function initHoursChart() {
    const hoursCanvas = document.getElementById('hoursChart');
    if (hoursCanvas) {
        if (hoursChartInstance) { hoursChartInstance.destroy(); }
        hoursChartInstance = new Chart(hoursCanvas.getContext('2d'), {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Study Hours',
                    data: [],
                    borderColor: '#88BDF2',
                    backgroundColor: 'rgba(136, 189, 242, 0.2)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true, ticks: { color: '#BDDDFC' } },
                    x: { ticks: { color: '#BDDDFC' } }
                }
            }
        });
    }
}

function loadHours() {
    let hoursData = JSON.parse(localStorage.getItem('infinityx_hours')) || [];
    if (hoursList) {
        hoursList.innerHTML = "";
        if (hoursChartInstance) {
            hoursChartInstance.data.labels = [];
            hoursChartInstance.data.datasets[0].data = [];
        }

        hoursData.forEach((item, index) => {
            let li = document.createElement('li');
            li.innerHTML = `<span>${item.date}: <strong>${item.hours} Hours</strong></span> <i class="fa-solid fa-trash delete-hour" data-index="${index}" style="cursor: pointer; color: #ff6b6b;"></i>`;
            hoursList.appendChild(li);

            if (hoursChartInstance) {
                hoursChartInstance.data.labels.push(item.date);
                hoursChartInstance.data.datasets[0].data.push(item.hours);
            }
        });

        if (hoursChartInstance) { hoursChartInstance.update(); }

        document.querySelectorAll('.delete-hour').forEach(btn => {
            btn.addEventListener('click', (e) => {
                let idx = e.target.getAttribute('data-index');
                hoursData.splice(idx, 1);
                localStorage.setItem('infinityx_hours', JSON.stringify(hoursData));
                loadHours();
            });
        });
    }
}

if (document.getElementById('hoursChart')) {
    initHoursChart();
    loadHours();
}

if (addHourBtn && studyDateInput && studyHoursInput) {
    addHourBtn.addEventListener('click', () => {
        let date = studyDateInput.value.trim();
        let hours = parseFloat(studyHoursInput.value.trim());

        if (date && !isNaN(hours)) {
            let hoursData = JSON.parse(localStorage.getItem('infinityx_hours')) || [];
            hoursData.push({ date, hours });
            localStorage.setItem('infinityx_hours', JSON.stringify(hoursData));

            studyDateInput.value = "";
            studyHoursInput.value = "";
            loadHours();
        } else {
            alert("කරුණාකර නිවැරදි දිනයක් සහ පැය ගණනක් ඇතුළත් කරන්න!");
        }
    });
}








// 1. ඔයාගේ Firebase Config එක මෙතනට දාන්න (Firebase Console එකෙන් අරගෙන)
const firebaseConfig = {
    apiKey: "AIzaSyDSKSOOjlE7BSQFSyhDtLdMCsMivHf5R2g",
  authDomain: "infinityx-ef3c1.firebaseapp.com",
  projectId: "infinityx-ef3c1",
  storageBucket: "infinityx-ef3c1.firebasestorage.app",
  messagingSenderId: "268457109973",
  appId: "1:268457109973:web:84bd9dde3e8263cc12755c"
};

// Firebase Initialize කිරීම
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();

// 2. Auth Guard: ලොග් වූ කෙනෙක් සහ ලොග් නොවූ කෙනෙක්ව පාලනය කිරීම
auth.onAuthStateChanged((user) => {
    // අපි දැනට ඉන්නේ මොන පේජ් එකේද කියලා බලාගන්නවා
    const currentPage = window.location.pathname.split("/").pop();

    if (user) {
        // යූසර් ලොග් වී ඇත: ලොගින් පේජ් එකේ ඉන්නවා නම් හෝම් පේජ් එකට (index.html) යවන්න
        if (currentPage === "login.html" || currentPage === "") {
            window.location.replace("index.html"); 
        }
    } else {
        // යූසර් ලොග් වී නැත: වෙන පේජ් එකක ඉන්නවා නම් ආපහු ලොගින් පේජ් එකට යවන්න
        if (currentPage !== "login.html") {
            window.location.replace("login.html"); 
        }
    }
});

// 3. Login Button එක ක්ලික් කළාම ක්‍රියාත්මක වන ෆන්ක්ෂන් එක
function loginUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMsg = document.getElementById("error-msg");
    const loginBtn = document.querySelector(".login-btn");

    // ඊමේල් හෝ මුරපදය හිස් නම්
    if (!email || !password) {
        errorMsg.innerText = "කරුණාකර ඊමේල් ලිපිනය සහ මුරපදය ඇතුළත් කරන්න!";
        errorMsg.style.display = "block";
        return;
    }

    // ලොග් වෙමින් පවතින බව පෙන්වන්න බටන් එක වෙනස් කිරීම
    const originalBtnText = loginBtn.innerText;
    loginBtn.innerText = "ඇතුල් වෙමින් පවතී...";
    errorMsg.style.display = "none";
    
    // Firebase හරහා ලොග් කිරීම
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // ලොග් වීම සාර්ථකයි! (Auth Guard එක මගින් ස්වයංක්‍රීයව index.html එකට යවනු ඇත)
            console.log("Logged in successfully:", userCredential.user.email);
        })
        .catch((error) => {
            // එරර් එකක් ආවොත් (උදා: වැරදි පාස්වර්ඩ්)
            loginBtn.innerText = originalBtnText; // ආපහු බටන් එක හදනවා
            errorMsg.innerText = "ලොග් වීමට නොහැක! ඊමේල් හෝ මුරපදය වැරදියි.";
            errorMsg.style.display = "block";
            console.error("Login Error:", error.message);
        });
}




// Sign Up (අලුත් Account එකක් සෑදීම)
function registerUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const errorMsg = document.getElementById("error-msg");
    const submitBtn = document.getElementById("submit-btn");

    if (!email || !password) {
        errorMsg.innerText = "කරුණාකර ඊමේල් සහ මුරපදය ඇතුළත් කරන්න!";
        errorMsg.style.display = "block";
        return;
    }

    if (password !== confirmPassword) {
        errorMsg.innerText = "ඇතුළත් කළ මුරපද දෙක සමාන නොවේ!";
        errorMsg.style.display = "block";
        return;
    }

    submitBtn.innerText = "ගිණුම සාදමින් පවතී...";

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log("Account Created:", userCredential.user.email);
            // Sign Up වූ පසු Auth Guard මගින් ස්වයංක්‍රීයව index.html එකට Redirect කරනු ඇත
        })
        .catch((error) => {
            submitBtn.innerText = "Sign Up";
            errorMsg.innerText = "ගිණුම සෑදීමට නොහැකි විය: " + error.message;
            errorMsg.style.display = "block";
        });
}