import Http from './lib.js';
const http = new Http('https://nikolay0951-api.herokuapp.com/');

const rootEl = document.getElementById('root');
const addEl = document.createElement('form');
addEl.className = 'form-inline mb-2';
addEl.innerHTML = `
    <div class="form-group">
        <input class="form-control" data-id="content" placeholder="Введите тест или url источника" size="30">
    </div>
    <select class="custom-select" data-id="type">
        <option value="regular">Обычный</option>
        <option value="image">Изображение</option>
        <option value="audio">Аудио</option>
        <option value="video">Видео</option>
    </select>
    <button class="btn btn-primary">Добавить</button>
`;
rootEl.appendChild(addEl);

const contentEl = addEl.querySelector('[data-id=content]');
contentEl.value = localStorage.getItem('content');
contentEl.addEventListener('input', (evt) => {
    localStorage.setItem('content', evt.currentTarget.value);
});

const typeEl = addEl.querySelector('[data-id=type]');
typeEl.value = localStorage.getItem('types');
typeEl.addEventListener('input', (evt) => {
    localStorage.setItem('types', evt.currentTarget.value);
});

addEl.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const data = {
        content: contentEl.value,
        type: typeEl.value,
    };

    http.postRequest('/posts', (evt) => {
        loadData();
        contentEl.value = '';
        localStorage.removeItem('link');
    }, handleError, JSON.stringify(data), [{ name: 'Content-Type', value: 'application/json' }]);
});


const listEl = document.createElement('div');
rootEl.appendChild(listEl);


const rebuildList = (evt) => {
    const data = JSON.parse(evt.currentTarget.responseText);
    listEl.innerHTML = '';

    data.sort((a, b) => {
        return a.likes - b.likes;
    });

    for (const item of data) {
        const el = document.createElement('div');
        el.className = 'card-posts';

        if (item.type === 'regular') {
            el.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <p class="card-text">${item.content}</p>
                    <button class="btn btn-primary" data-action="like">👍🏼 ${item.likes}</button>
                    <button class="btn btn-secondary" data-action="dislike">👎🏻</button>
                    <button class="btn btn-danger" data-action="delete">X</button>
                </div>
            </div>
            `;
        } else if (item.type === 'image') {
            el.innerHTML = `
            <div class="card">
                <img src="${item.content}" class="card-img-top">
                <div class="card-body">
                    <button class="btn btn-primary" data-action="like">👍🏼 ${item.likes}</button>
                    <button class="btn btn-secondary" data-action="dislike">👎🏻</button>
                    <button class="btn btn-danger" data-action="delete">X</button>
                </div>
            </div>
            `;
        } else if (item.type === 'video') {
            el.innerHTML = `
            <div class="card">
                <div class="embed-responsive embed-responsive-16by9">
                     <iframe class="embed-responsive-item" src="${item.content}"></iframe>
                </div>
                <div class="card-body">
                    <button class="btn btn-primary" data-action="like">👍🏼 ${item.likes}</button>
                    <button class="btn btn-secondary" data-action="dislike">👎🏻</button>
                    <button class="btn btn-danger" data-action="delete">X</button>
                </div>
            </div>
            `;
        } else if (item.type === 'audio') {
            el.innerHTML = `
            <div class="card">
                <div class="card-img-top">
                    <audio src="${item.content}" controls></audio>
                </div>
                <div class="card-body">
                    <button class="btn btn-primary" data-action="like">👍🏼 ${item.likes}</button>
                    <button class="btn btn-secondary" data-action="dislike">👎🏻</button>
                    <button class="btn btn-danger" data-action="delete">X</button>
                </div>
            </div>
            `;
        }
        el.addEventListener('click', evt => {
            if (evt.target.dataset.action === 'like') {
                http.postRequest(`/posts/${item.id}/likes`, loadData, handleError, null, []);
            } else if (evt.target.dataset.action === 'dislike') {
                http.deleteRequest(`/posts/${item.id}/likes`, loadData, handleError);
            } else if (evt.target.dataset.action === 'delete') {
                http.deleteRequest(`/posts/${item.id}`, loadData, handleError);
            }
        })

        listEl.appendChild(el);
        listEl.insertBefore(el, listEl.firstChild);

    }
};
const handleError = (evt) => {
    console.log(evt);
};
const loadData = () => {
    http.getRequest('/posts', rebuildList, handleError);
};
loadData();