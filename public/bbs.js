"use strict";

let number=0;
const bbs = document.querySelector('#bbs');
document.querySelector('#post').addEventListener('click', () => {
    const name = document.querySelector('#name').value;
    const message = document.querySelector('#message').value;

    const params = {  // URL Encode
        method: "POST",
        body:  'name='+name+'&message='+message,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    console.log( params );
    const url = "/post";
    fetch( url, params )
    .then( (response) => {
        if( !response.ok ) {
            throw new Error('Error');
        }
        return response.json();
    })
    .then( (response) => {
        console.log( response );
        document.querySelector('#message').value = "";
    });
});

document.querySelector('#check').addEventListener('click', () => {
    const params = {  // URL Encode
        method: "POST",
        body:  '',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    const url = "/check";
    fetch( url, params )
    .then( (response) => {
        if( !response.ok ) {
            throw new Error('Error');
        }
        return response.json();
    })
    .then( (response) => {
        let value = response.number;
        console.log( value );

        console.log( number );
        if( number != value ) {
            const params = {
                method: "POST",
                body: 'start='+number,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'               
                }
            }
            const url = "/read";
            fetch( url, params )
            .then( (response) => {
                if( !response.ok ) {
                    throw new Error('Error');
                }
                return response.json();
            })
            .then( (response) => {
                number += response.messages.length;
                for( let mes of response.messages ) {
                    console.log( mes );  // 表示する投稿
                    let cover = document.createElement('div');
                    cover.className = 'cover';
                    cover.id = 'post-' + mes.id;

                    let name_area = document.createElement('span');
                    name_area.className = 'name';
                    name_area.innerText = mes.name;
                    let mes_area = document.createElement('span');
                    mes_area.className = 'mes';
                    mes_area.innerText = mes.message;

                    let delete_btn = document.createElement('button');
                    delete_btn.innerText = '削除';
                    delete_btn.addEventListener('click', () => {
                        deletePost(mes.id);
                    });

                    let like_btn = document.createElement('button');
                    like_btn.dataset.id = mes.id;
                    if (mes.likes==undefined) mes.likes=0;
                    like_btn.innerText = 'いいね'+mes.likes;  
                    like_btn.addEventListener('click', () => {
                        likePost(mes.id);
                    });

                    let edit_btn = document.createElement('button');
                    edit_btn.innerText = '編集';
                    edit_btn.addEventListener('click', () => {
                    editPost(mes.id, mes.message, cover);
                    });

                    let edit_info = document.createElement('span');
                    edit_info.className = 'edit-info';
                    edit_info.innerText = mes.edited ? '（編集済み）' : '';

                    cover.appendChild( name_area );
                    cover.appendChild( mes_area );
 
                    cover.appendChild( delete_btn ); 
                    cover.appendChild( like_btn );  
                    cover.appendChild( edit_btn ); 
                    cover.appendChild(edit_info);

                    bbs.appendChild( cover );
                }
            })
        }
    });
});


function deletePost(id) {
    fetch('/delete', {
        method: "POST",
        body: 'id=' + id,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .then(response => response.json())
    .then(response => {
        if (response.success) {
            document.querySelector('#post-' + id).remove();
            number -= 1;
        }
    });
}

function likePost(id) {
    const params = {
        method: "POST",
        body: 'id='+id,
        headers: {
            'Content-Type':'application/x-www-form-urlencoded'
        }
    };
    const url = "/like";
    fetch(url, params)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error');
            }
            return response.json();
        })
        .then((response) => {
            if (response.success) {
                const like_btn = document.querySelector(`#post-${id} button[data-id='${id}']`);
                like_btn.innerText = 'いいね ' + response.likes;

            }
        })
}


function editPost(id, currentMessage, cover) {
    // 既存のメッセージ部分だけを編集フォームに置き換える
    const mes_area = cover.querySelector('.mes');
    const edit_info = cover.querySelector('.edit-info');

    let input = document.createElement('input');
    input.type = 'text';
    input.value = currentMessage;
    input.className = 'edit-input';

    let save_btn = document.createElement('button');
    save_btn.innerText = '保存';
    save_btn.addEventListener('click', () => {
        saveEdit(id, input.value, mes_area, edit_info);
    });

    // メッセージ部分を置き換え
    mes_area.innerHTML = '';
    mes_area.appendChild(input);
    mes_area.appendChild(save_btn);
}


// 編集内容の保存
function saveEdit(id, newMessage, mes_area, edit_info) {
    fetch('/edit', {
        method: "POST",
        body: 'id=' + id + '&message=' + newMessage,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .then(response => response.json())
    .then(response => {
        if (response.success) {
            // メッセージを新しい内容に更新
            mes_area.innerText = newMessage;
            
            // 編集済みラベルを表示
            if (!edit_info) {
                edit_info = document.createElement('span');
                edit_info.className = 'edit-info';
                mes_area.parentElement.appendChild(edit_info);
            }
            edit_info.innerText = '（編集済み）';
        }
    });
}
