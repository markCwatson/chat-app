const socket = io()

socket.on('message', (msg) => {
    console.log(msg)
})

document.querySelector('#msgForm').addEventListener('submit', (event) => {
    event.preventDefault()

    const msg = event.target.elements.formInput.value
    socket.emit('sendMsg', msg)
})