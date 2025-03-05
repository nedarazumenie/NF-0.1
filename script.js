// Переключение темы
document.getElementById("theme-toggle").addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    const theme = document.body.classList.contains("light-theme") ? "light" : "dark";
    localStorage.setItem("theme", theme);
});

// Загрузка сохраненной темы
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
        document.body.classList.add("light-theme");
    }
    loadPosts();
});

let currentInterest = ""; 

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

function createPostElement(post, index) {
    const postDiv = document.createElement("div");
    postDiv.className = "post";
    postDiv.innerHTML = `<p>${post.content}</p>`;

    if (post.mediaUrl) {
        const img = document.createElement("img");
        img.src = post.mediaUrl;
        img.style.maxWidth = "100%";
        postDiv.appendChild(img);
    }

    const replyButton = document.createElement("button");
    replyButton.innerText = "Ответить";
    replyButton.onclick = () => addReply(index);
    postDiv.appendChild(replyButton);

    if (post.replies) {
        post.replies.forEach(reply => {
            const replyDiv = document.createElement("div");
            replyDiv.className = "reply";
            replyDiv.innerHTML = `<p>${reply.content}</p>`;

            if (reply.mediaUrl) {
                const replyImg = document.createElement("img");
                replyImg.src = reply.mediaUrl;
                replyDiv.appendChild(replyImg);
            }
            postDiv.appendChild(replyDiv);
        });
    }

    return postDiv;
}

function addPost() {
    if (!currentInterest) {
        alert("Сначала выберите раздел!");
        return;
    }
    
    const content = document.getElementById("post-content").value;
    const mediaInput = document.getElementById("media-input");
    const mediaFile = mediaInput.files[0];

    if (!content && !mediaFile) {
        alert("Введите текст или добавьте изображение!");
        return;
    }

    const posts = JSON.parse(localStorage.getItem(currentInterest) || "[]");
    const newPost = { content, mediaUrl: null, replies: [] };

    if (mediaFile) {
        const reader = new FileReader();
        reader.onload = function(event) {
            newPost.mediaUrl = event.target.result;
            posts.push(newPost);
            localStorage.setItem(currentInterest, JSON.stringify(posts));
            loadPosts();
        };
        reader.readAsDataURL(mediaFile);
    } else {
        posts.push(newPost);
        localStorage.setItem(currentInterest, JSON.stringify(posts));
        loadPosts();
    }

    document.getElementById("post-content").value = "";
    mediaInput.value = "";
}

function addReply(postIndex) {
    const replyContent = prompt("Введите ваш ответ:");
    if (!replyContent) return;

    const posts = JSON.parse(localStorage.getItem(currentInterest) || "[]");
    const newReply = { content: replyContent, mediaUrl: null };
    posts[postIndex].replies = posts[postIndex].replies || [];
    posts[postIndex].replies.push(newReply);

    localStorage.setItem(currentInterest, JSON.stringify(posts));
    loadPosts();
}
