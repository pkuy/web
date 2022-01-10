const modal = document.querySelector('.js-modal')
const btnExit = document.querySelector('.js-exit-btn')
const btnEdits = document.querySelectorAll('.js-edit-order')
const btnConfirm = document.querySelector('.js-modal__confirm')
const modalOverlay = document.querySelector('.js-modal-overlay')


function showEdit() {
    modal.classList.add('open')
}

function hideEdit() {
    modal.classList.remove('open')
}

for(const btnEdit of btnEdits) {
    btnEdit.addEventListener('click',showEdit)
}

btnConfirm.addEventListener('click',hideEdit)
btnExit.addEventListener('click',hideEdit)


