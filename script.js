document.addEventListener("DOMContentLoaded", () => {
    checkPrivacyAccepted();
    loadTheme();
});

function checkPrivacyAccepted() {
    if (!localStorage.getItem("privacyAccepted")) {
        document.getElementById("privacy-overlay").style.display = "flex";
    }
}

document.getElementById("accept-privacy").addEventListener("click", () => {
    localStorage.setItem("privacyAccepted", "true");
    document.getElementById("privacy-overlay").style.display = "none";
});

function loadTheme() {
    const theme = localStorage.getItem("theme");
    document.body.classList.toggle("dark-theme", theme === "dark");
}

document.getElementById("theme-toggle").addEventListener("click", () => {
    const theme = localStorage.getItem("theme") === "dark" ? "light" : "dark";
    localStorage.setItem("theme", theme);
    loadTheme();
});

let currentInterest = "";
let currentThread = "";

// Загрузка тредов
function loadThreads(interest) {
    currentInterest = interest;
    document.getElementById("current-interest").textContent = "Треды в разделе: " + interest;

    const threadList = document.getElementById("thread-list");
    threadList.innerHTML = "";

    const threads = JSON.parse(localStorage.getItem(interest) || "[]");

    threads.forEach(thread => {
        const li = document.createElement("li");
        li.textContent = thread;
        li.onclick = () => openThread(thread);
        threadList.appendChild(li);
    });

    document.getElementById("post-section").style.display = "none";
}

// Создание треда
function createThread() {
    const title = document.getElementById("thread-title").value.trim();
    if (!title) return alert("Введите название треда!");

    let threads = JSON.parse(localStorage.getItem(currentInterest) || "[]");
    threads.push(title);
    localStorage.setItem(currentInterest, JSON.stringify(threads));

    loadThreads(currentInterest);
}

// Открытие треда
function openThread(thread) {
    currentThread = thread;
    document.getElementById("thread-title-display").textContent = "Тред: " + thread;
    document.getElementById("post-section").style.display = "block";

    loadPosts();
}

// Добавление поста
function addPost() {
    const content = document.getElementById("post-content").value.trim();
    const media = document.getElementById("media-input").files[0];

    if (!content && !media) return alert("Введите сообщение или прикрепите изображение!");

    let posts = JSON.parse(localStorage.getItem(currentThread) || "[]");

    let post = { text: content, time: new Date().toLocaleString(), replies: [] };

    if (media) {
        const reader = new FileReader();
        reader.onload = function (event) {
            post.image = event.target.result;
            posts.push(post);
            localStorage.setItem(currentThread, JSON.stringify(posts));
            loadPosts();
        };
        reader.readAsDataURL(media);
    } else {
        posts.push(post);
        localStorage.setItem(currentThread, JSON.stringify(posts));
        loadPosts();
    }
}

// Загрузка постов
function loadPosts() {
    const postList = document.getElementById("post-list");
    postList.innerHTML = "";

    let posts = JSON.parse(localStorage.getItem(currentThread) || "[]");

    posts.forEach((post, index) => {
        const li = document.createElement("li");
        li.innerHTML = `<p>${post.text}</p><small>${post.time}</small>` + 
                       (post.image ? `<img src="${post.image}">` : "") +
                       `<button onclick="replyToPost(${index})">Ответить</button>`;

        postList.appendChild(li);
    });
}
