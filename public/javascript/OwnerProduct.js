const modal = document.querySelector('.js-modal')
const btnExits = document.querySelectorAll('.js-exit-btn')
const btnEdits = document.querySelectorAll('.js-edit-product')
const btnAdd = document.querySelector('.js-add-btn')
const modalAdd = document.querySelector('.js-modal-add-product')
const modalEdit = document.querySelector('.js-modal-edit-product')
const btnConfirm = document.querySelector('.js-modal__confirm')


function showAdd() {
    modal.classList.add('open')
    modalAdd.classList.add('open')
}

function showEdit() {
    modal.classList.add('open')
    modalEdit.classList.add('open')
}

function hide() {
    modal.classList.remove('open')
    modalAdd.classList.remove('open')
    modalEdit.classList.remove('open')
}


for(const btnEdit of btnEdits) {
    btnEdit.addEventListener('click', showEdit)
}

btnAdd.addEventListener('click', showAdd)


for(const btnExit of btnExits) {
    btnExit.addEventListener('click', hide)
}

btnConfirm.addEventListener('click', hide)

// btnExit.addEventListener('click', hide)

