document.addEventListener("DOMContentLoaded", () => {
    loadTheme();
    checkPrivacyAcceptance();
    setupEventListeners();
});

function checkPrivacyAcceptance() {
    if (!localStorage.getItem("privacyAccepted")) {
        document.getElementById("privacy-modal").style.display = "block";
    }
}

document.getElementById("accept-privacy").addEventListener("click", () => {
    localStorage.setItem("privacyAccepted", "true");
    document.getElementById("privacy-modal").style.display = "none";
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

function setupEventListeners() {
    document.querySelectorAll("#interests-nav button").forEach(button => {
        button.addEventListener("click", () => loadThreads(button.dataset.interest));
    });

    document.getElementById("create-thread").addEventListener("click", createThread);
    document.getElementById("add-post").addEventListener("click", addPost);
}

function loadThreads(interest) {
    currentInterest = interest;
    document.getElementById("current-interest").textContent = "Треды в разделе: " + interest;
    const threadList = document.getElementById("thread-list");
    threadList.innerHTML = "";

    (JSON.parse(localStorage.getItem(interest) || "[]")).forEach(thread => {
        let li = document.createElement("li");
        li.textContent = thread;
        li.onclick = () => openThread(thread);
        threadList.appendChild(li);
    });

    document.getElementById("post-section").style.display = "none";
}

function createThread() {
    const title = document.getElementById("thread-title").value.trim();
    if (!title) return alert("Введите название треда!");

    let threads = JSON.parse(localStorage.getItem(currentInterest) || "[]");
    threads.push(title);
    localStorage.setItem(currentInterest, JSON.stringify(threads));

    loadThreads(currentInterest);
}

function openThread(thread) {
    currentThread = thread;
    document.getElementById("thread-title-display").textContent = "Тред: " + thread;
    document.getElementById("post-section").style.display = "block";
    loadPosts();
}

function addPost() {
    const content = document.getElementById("post-content").value.trim();
    const media = document.getElementById("media-input").files[0];

    if (!content && !media) return alert("Введите сообщение или прикрепите изображение!");

    let posts = JSON.parse(localStorage.getItem(currentThread) || "[]");
    let post = { text: content, replies: [] };

    if (media) {
        const reader = new FileReader();
        reader.onload = event => {
            post.image = event.target.result;
            posts.push(post);
            saveAndReloadPosts(posts);
        };
        reader.readAsDataURL(media);
    } else {
        posts.push(post);
        saveAndReloadPosts(posts);
    }
}

function saveAndReloadPosts(posts) {
    localStorage.setItem(currentThread, JSON.stringify(posts));
    loadPosts();
}

function loadPosts() {
    const postList = document.getElementById("post-list");
    postList.innerHTML = "";

    (JSON.parse(localStorage.getItem(currentThread) || "[]")).forEach((post, index) => {
        let li = document.createElement("li");
        li.innerHTML = `<p>${post.text}</p>` + 
                       (post.image ? `<img src="${post.image}">` : "") +
                       `<button onclick="replyToPost(${index})">Ответить</button>` +
                       `<button onclick="toggleReplies(${index})">Посмотреть ответы</button>`;
        postList.appendChild(li);
    });
}
