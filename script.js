
const STORAGE_KEY = 'gad_love_calculator_data_v4';
const PASSWORD_KEY = 'gad_admin_password';

function getAdminPassword() {
    const stored = localStorage.getItem(PASSWORD_KEY);
    return stored || 'gadmichael7';
}

function getSubmissions() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
}

function saveSubmission(name, love) {
    const submissions = getSubmissions();
    submissions.unshift({
        name: name.trim(),
        love: love.trim(),
        time: new Date().toLocaleString(),
        id: Date.now()
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
}

function switchPage(pageId) {
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
        p.style.display = 'none';
    });

    const target = document.getElementById(pageId);

    if (target) {
        target.style.display = 'flex';

        setTimeout(() => {
            target.classList.add('active');
        }, 10);
    }

    window.scrollTo(0, 0);
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
    const badge = document.getElementById('countBadge');

    badge.textContent = submissions.length;

    if (submissions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="2" class="empty-msg">No submissions yet... Go share your link! 😏</td></tr>';
        return;
    }

    tbody.innerHTML = submissions.map(sub =>
        `<tr><td>${sub.name}</td><td>${sub.love}</td></tr>`
    ).join('');
}

function checkPassword() {
    const input = document.getElementById('adminPassword').value.trim();
    const error = document.getElementById('loginError');

    if (input === getAdminPassword()) {
        document.getElementById('loginOverlay').style.display = 'none';
        document.getElementById('adminPassword').value = '';
        renderAdminTable();
    } else {
        error.style.display = 'block';

        setTimeout(() => {
            error.style.display = 'none';
        }, 3000);
    }
}

function changePassword() {
    const oldPass = document.getElementById('oldPassword').value.trim();
    const newPass = document.getElementById('newPassword').value.trim();
    const msg = document.getElementById('passwordMsg');

    if (!oldPass || !newPass) {
        msg.textContent = 'Please fill both fields!';
        return;
    }

    if (oldPass !== getAdminPassword()) {
        msg.textContent = 'Current password is wrong!';
        return;
    }

    localStorage.setItem(PASSWORD_KEY, newPass);

    msg.textContent = 'Password changed successfully! ✅';
}

function checkUrlHash() {
    if (window.location.hash === '#admin') {
        document.getElementById('loginOverlay').style.display = 'flex';
        switchPage('page3');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('calcBtn').addEventListener('click', handleCalculate);
    document.getElementById('backBtn1').addEventListener('click', goBack);
    document.getElementById('backBtn2').addEventListener('click', goBack);
    document.getElementById('loginBtn').addEventListener('click', checkPassword);
    document.getElementById('changePassBtn').addEventListener('click', changePassword);

    checkUrlHash();
});

window.addEventListener('hashchange', checkUrlHash);
