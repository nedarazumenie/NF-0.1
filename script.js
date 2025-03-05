/* script.js */
// Переключение темной и светлой темы
function toggleTheme() {
    document.body.classList.toggle("light-theme");
    const theme = document.body.classList.contains("light-theme") ? "light" : "dark";
    localStorage.setItem("theme", theme);
}

document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
        document.body.classList.add("light-theme");
    }
    loadPosts();
});

let currentInterest = '';

function loadInterest(interest) {
    currentInterest = interest;
    document.getElementById("current-interest").innerText = `Раздел: ${interest}`;
    loadPosts();
}

function loadPosts() {
    const posts = JSON.parse(localStorage.getItem(currentInterest) || "[]");
    const postList = document.getElementById("post-list");
    postList.innerHTML = "";
    posts.forEach((post, index) => {
        const postDiv = createPostElement(post, index);
        postList.appendChild(postDiv);
    });
}

function addPost() {
    if (!currentInterest) {
        alert("Сначала выберите раздел!");
        return;
    }
    
    const content = document.getElementById("post-content").value;
    const posts = JSON.parse(localStorage.getItem(currentInterest) || "[]");
    posts.push({ content, replies: [] });
    localStorage.setItem(currentInterest, JSON.stringify(posts));
    loadPosts();
    document.getElementById("post-content").value = "";
}

function addReply(postIndex) {
    const replyContent = prompt("Введите ваш ответ:");
    if (!replyContent) return;
    
    const posts = JSON.parse(localStorage.getItem(currentInterest) || "[]");
    posts[postIndex].replies.push({ content: replyContent, replies: [] });
    localStorage.setItem(currentInterest, JSON.stringify(posts));
    loadPosts();
}
