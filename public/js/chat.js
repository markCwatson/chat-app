const socket = io()

socket.on('message', (msg) => {
    console.log(msg)
})

document.querySelector('#msgForm').addEventListener('submit', (event) => {
    event.preventDefault()

    const msg = event.target.elementsg.formInput.value
    socket.emit('sendMsg', msg)
})

document.querySelector('#location').addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser!')
    } 

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('location', { 
            latitude: position.coords.latitude, 
            longitude: position.coords.longitude
        })
    })
})