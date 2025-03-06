document.addEventListener("DOMContentLoaded", () => {
    loadTheme();
    loadThreads(localStorage.getItem("lastInterest") || "technology");
});

function loadTheme() {
    const theme = localStorage.getItem("theme");
    document.body.classList.toggle("light-theme", theme === "light");
}

document.getElementById("theme-toggle").addEventListener("click", () => {
    const newTheme = document.body.classList.contains("light-theme") ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    loadTheme();
});

let currentInterest = "";
let currentThread = "";

function loadThreads(interest) {
    currentInterest = interest;
    localStorage.setItem("lastInterest", interest);
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

function createThread() {
    const title = document.getElementById("thread-title").value.trim();
    if (!title) return alert("Введите название треда!");

    let threads = JSON.parse(localStorage.getItem(currentInterest) || "[]");

    if (threads.includes(title)) {
        alert("Тред с таким названием уже существует!");
        return;
    }

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

function loadPosts() {
    const postList = document.getElementById("post-list");
    postList.innerHTML = "";

    let posts = JSON.parse(localStorage.getItem(currentThread) || "[]");

    posts.forEach((post, index) => {
        const li = document.createElement("li");
        li.innerHTML = `<p>${post.text}</p>` + (post.image ? `<img src="${post.image}">` : "") +
                       `<button onclick="replyToPost(${index})">Ответить</button>`;

        if (post.replies.length) {
            const replyList = document.createElement("ul");
            post.replies.forEach(reply => {
                const replyItem = document.createElement("li");
                replyItem.textContent = reply;
                replyList.appendChild(replyItem);
            });
            li.appendChild(replyList);
        }

        postList.appendChild(li);
    });
}

function replyToPost(index) {
    const replyText = prompt("Введите ответ:");
    if (!replyText) return;

    let posts = JSON.parse(localStorage.getItem(currentThread) || "[]");
    posts[index].replies.push(replyText);
    localStorage.setItem(currentThread, JSON.stringify(posts));

    loadPosts();
}
