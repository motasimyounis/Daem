
// طي القائمة الجانبية
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleSidebar');
toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
});

// التنقل بين الأقسام
const navLinks = sidebar.querySelectorAll('nav a');
const sections = document.querySelectorAll('.section');
navLinks.forEach(link => {
    link.addEventListener('click', e => {
    e.preventDefault();
    navLinks.forEach(l => l.classList.remove('active'));
    sections.forEach(s => s.classList.remove('active-section'));

    link.classList.add('active');
    const sec = document.getElementById(link.dataset.section);
    if (sec) {
        sec.classList.add('active-section');
    }
    });
});

// قائمة الملف الشخصي
const profileToggle = document.getElementById('profileToggle');
const profileMenu = document.getElementById('profileMenu');
profileToggle.addEventListener('click', () => {
    profileMenu.classList.toggle('active');
});
window.addEventListener('click', e => {
    if (!profileToggle.contains(e.target)) {
    profileMenu.classList.remove('active');
    }
});

document.getElementById("sendBtn").addEventListener("click", function () {
  const input = document.getElementById("chatInput");
  const messageText = input.value.trim();
  const token = localStorage.getItem("access");

  if (messageText === "" || !token) return;

  // عرض رسالة المستخدم
  const userMsg = document.createElement("div");
  userMsg.className = "message user";
  userMsg.innerHTML = `
    <img src="https://i.pravatar.cc/100?img=47" class="avatar" alt="User Avatar">
    <div class="bubble">${messageText}</div>
  `;
  document.getElementById("chatMessages").appendChild(userMsg);
  input.value = "";

  // إرسال الرسالة إلى API
  fetch(`${API_BASE_URL}/sessions/`, {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json"
    }
  })
  .then(res => res.json())
  .then(session => {
    return fetch(`${API_BASE_URL}/send-message/`, {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        session: session.session_id,
        content: messageText
      })
    });
  })
  .then(res => res.json())
  .then(data => {
    const aiMsg = document.createElement("div");
    aiMsg.className = "message bot";
    aiMsg.innerHTML = `
      <img src="https://cdn-icons-png.flaticon.com/512/4712/4712106.png" class="avatar" alt="AI Avatar">
      <div class="bubble">${data.ai_response}</div>
    `;
    document.getElementById("chatMessages").appendChild(aiMsg);

    // تمرير تلقائي
    document.getElementById("chatMessages").scrollTop = document.getElementById("chatMessages").scrollHeight;
  })
  .catch(err => {
    console.error("خطأ في إرسال الرسالة:", err);
    alert("حدث خطأ أثناء إرسال الرسالة. تأكد من أنك مسجّل دخول.");
  });
});


// سجل المزاج
const moodForm = document.getElementById('moodForm');
const moodEntries = document.getElementById('moodEntries');

function renderMoodEntry(mood, note, date) {
    const entry = document.createElement('div');
    entry.classList.add('mood-entry');
    const dateStr = new Date(date).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' });
    entry.innerHTML = `<strong>${mood}</strong> - <small>${dateStr}</small><br>${note ? note : ''}`;
    moodEntries.prepend(entry);
}

moodForm.addEventListener('submit', e => {
    e.preventDefault();
    const mood = document.getElementById('moodSelect').value;
    const note = document.getElementById('moodNote').value.trim();
    if (!mood) return alert('يرجى اختيار المزاج');
    renderMoodEntry(mood, note, new Date());
    moodForm.reset();
});

// روبوت المحادثة مبسط
const botMessages = document.getElementById('botMessages');
const botInput = document.getElementById('botInput');
const botSendBtn = document.getElementById('botSendBtn');

function appendBotMessage(text) {
    const div = document.createElement('div');
    div.classList.add('bot-message');
    div.textContent = text;
    botMessages.appendChild(div);
    botMessages.scrollTop = botMessages.scrollHeight;
}

botSendBtn.addEventListener('click', () => {
    const message = botInput.value.trim();
    if (!message) return;
    appendBotMessage(`أنت: ${message}`);
    botInput.value = '';
    setTimeout(() => {
    appendBotMessage('البوت: شكراً لسؤالك! أنا هنا لمساعدتك.');
    }, 1200);
});

botInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    botSendBtn.click();
    }
});



function goToSession() {
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active-section'));
    document.getElementById('chat').classList.add('active-section');
    document.querySelectorAll('nav a').forEach(link => link.classList.remove('active'));
    document.querySelector('nav a[data-section="chat"]').classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}