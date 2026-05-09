const STORAGE_KEY = 'gad_love_calculator_data_v3';
const ADMIN_PASSWORD = 'gadmichael7';

function getSubmissions() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

function saveSubmission(name, love) {
    const submissions = getSubmissions();

    submissions.unshift({
        name: name.trim(),
        love: love.trim(),
        time: new Date().toLocaleString()
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
}

function switchPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    document.getElementById(pageId).classList.add('active');
}

function goBack() {
    document.getElementById('userName').value = '';
    document.getElementById('loveName').value = '';
    switchPage('page1');
}

function handleCalculate() {
    const userName = document.getElementById('userName').value;
    const loveName = document.getElementById('loveName').value;

    if (!userName.trim() || !loveName.trim()) {
        alert('Please enter both names! 💕');
        return;
    }

    saveSubmission(userName, loveName);
    switchPage('page2');
}

function renderAdminTable() {
    const tbody = document.getElementById('adminTableBody');
    const submissions = getSubmissions();

    document.getElementById('countBadge').textContent = submissions.length;

    if (submissions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="2">No submissions yet...</td></tr>';
        return;
    }

    tbody.innerHTML = submissions.map(sub => `
        <tr>
            <td>${sub.name}</td>
            <td>${sub.love}</td>
        </tr>
    `).join('');
}

function clearData() {
    if (confirm('Delete all submissions?')) {
        localStorage.removeItem(STORAGE_KEY);
        renderAdminTable();
    }
}

function checkPassword() {
    const input = document.getElementById('adminPassword').value;

    if (input === ADMIN_PASSWORD) {
        document.getElementById('loginOverlay').style.display = 'none';
        renderAdminTable();
    } else {
        document.getElementById('loginError').style.display = 'block';
    }
}

function checkUrlHash() {
    if (window.location.hash === '#admin') {
        document.getElementById('loginOverlay').style.display = 'flex';
        switchPage('page3');
    }
}

document.getElementById('calcBtn').addEventListener('click', handleCalculate);
document.getElementById('backBtn1').addEventListener('click', goBack);
document.getElementById('backBtn2').addEventListener('click', goBack);
document.getElementById('clearBtn').addEventListener('click', clearData);
document.getElementById('loginBtn').addEventListener('click', checkPassword);

window.addEventListener('hashchange', checkUrlHash);
checkUrlHash();
