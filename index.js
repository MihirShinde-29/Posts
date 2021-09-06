// URL
const url = 'http://jsonplaceholder.typicode.com/posts';

// Storing Posts
let posts = [];

// Fetch Request
const fetchPosts = async () => {
    try {
        const res = await fetch(url);
        posts = await res.json();
        showPosts(posts);
    } catch (err) {
        console.log(err);
    }
};

// POST Request
const postPost = async post => {
    try {
        const res = await fetch (url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(post)
        });
        const posts = await res.json();
        console.log(posts);
    } catch (err) {
        console.log(err);
    }
}

// PUT Request
const putPost = async post => {
    try {
        const id = post.id;
        const res = await fetch (`${url}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(post)
        });
        const posts = await res.json();
        console.log(posts);
    } catch (err) {
        console.log(err);
    }
}

// DELETE Request
const DELETEPost = async id => {
    try {
        const res = await fetch (`${url}/${id}`, {
            method: 'DELETE'
        });
        const post = res.json();
        console.log("DELETED", post);
    } catch (err) {
        console.log(err);
    }
}

// Showing Posts
const showPosts = posts => {
    posts.sort((a, b) => (a.id > b.id) ? 1 : -1 );
    let output = '';
    posts.forEach((post, index) => {
        output += `
        <div id='${post.id}' class="accordion-item text-start">
            <div class='d-flex justify-content-center border-bottom  align-items-center'>
                <h5 class='mt-2 mx-3 title'>${index+1}.</h5>
                <h2 class="accordion-header w-100">
                    <button class="accordion-button collapsed title fs-5" type="button" data-bs-toggle="collapse" data-bs-target="#post-${post.id}">${post.title}</button>
                </h2>
                <i id='delete_button' class='bi-x px-1 ms-1 fs-3 text-danger rounded-3'></i>
                <i id='edit' class='bi-pencil-square px-1 ms-1 me-3 fs-3 text-primary rounded-3'></i>
            </div>
            <div id="post-${post.id}" class="accordion-collapse collapse" data-bs-parent="#posts">
                <div id='body' class="accordion-body px-md-5 me-md-5 px-3 fs-6">${post.body}</div>
            </div>
        </div>
        `;
    });
    document.querySelector('#posts').innerHTML = output;
};

// Clear Fields
const clearFields = () => {
    document.querySelector('#title').value = '';
    document.querySelector('#body').value = '';
}

// Add Post
const addPost = (id, title, body) => {
    if (!editMode) {
        const userId = Math.floor(Math.random() * 10) + 1;
        const len = posts.length;
        const id = posts[len-1].id + 1;
        const post = {
            userId,
            id,
            title,
            body
        };
        postPost(post);
        posts = [...posts, post];
        showPosts(posts);
        clearFields();
        location.href = '#' + post.id;
    } else {
        const userId = Math.floor(Math.random() * 10) + 1;
        const post = {
            userId,
            id,
            title,
            body
        };
        putPost(post);
        posts = [...posts, post];
        showPosts(posts);
        editMode = false;
        clearFields();
        location.href = '#' + post.id;
    }
};

// Display onLoad
document.addEventListener('DOMContentLoaded', fetchPosts());

// Editing Post
let editMode = false;
let editId = 0;

const editPost = e => {
    if (e.id === 'edit' && !editMode) {
        const title = e.parentElement.children[1].firstElementChild.innerHTML;
        const body = e.parentElement.parentElement.lastElementChild.firstElementChild.innerHTML;
        const id = +e.parentElement.parentElement.id;
        const index = e.parentElement.firstElementChild.innerHTML;
        document.querySelector('#title').value = title;
        document.querySelector('#body').value = body;
        posts.splice(index-1, 1);
        showPosts(posts);
        editMode = true;
        editId = id;
        location.href = '#top';
    }
}

// Deleting Post
const deletePost = (index, id) => {
    DELETEPost(id);
    posts.splice(index, 1);
    showPosts(posts);
}

// Event: Adding Post
document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.querySelector('#title').value;
    const body = document.querySelector('#body').value;
    (title === '' || body === '') ? 
    Swal.fire(
        "Error", 
        "Fill the fields with <span class='text-danger'>*</span> .", 
        "warning"
    ) : addPost(editId, title, body);
});

// Event: Edit Post
document.querySelector("#posts").addEventListener('click', (e) => editPost(e.target));

// Event: Delete Post
let deleteIndex = 0;
let deleteId = 0;

document.querySelector("#posts").addEventListener('click', (e) => {
    if (e.target.id === "delete_button") {
        deleteIndex = e.target.parentElement.firstElementChild.innerHTML - 1;
        deleteId = +e.target.parentElement.parentElement.id;
        Swal.fire({
            title: 'Are you Sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            allowOutsideClick: false,
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: `Delete`,
            denyButtonText: `Don't Delete`,
        }).then((result) => {
            if (result.isConfirmed) {
                deletePost(deleteIndex, deleteId);
                Swal.fire(
                    'Deleted!',
                    'The post has been deleted.', 
                    'success'
                )
            }
        })
    };
});

// Go To Top
const btn = document.querySelector('#goToTop');

btn.addEventListener('click', () => location.href = '#top');

window.addEventListener("scroll", () => {
    let y = window.scrollY;
    (y >= 800) ? btn.className='' : btn.className='d-none';
});