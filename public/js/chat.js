const socket = io()

const $messageForm = document.querySelector('#msgForm')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationButton = document.querySelector('#location')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML

const {name, room} = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('message', (msg) => {
    const html = Mustache.render(messageTemplate, {
        msg: msg.text,
        createdAt: moment(msg.createdAt).format('h:mm A')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (msg) => {
    const html = Mustache.render(locationMessageTemplate, {
        url: msg.url,
        createdAt: moment(msg.createdAt).format('h:mm A')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

$messageForm.addEventListener('submit', (event) => {
    event.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')

    const msg = event.target.elements.formInput.value

    socket.emit('sendMsg', msg, (ack) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
    })
})

$locationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser!')
    } 
    
    $locationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('location', { 
            latitude: position.coords.latitude, 
            longitude: position.coords.longitude
        }, (ack) => {
            $locationButton.removeAttribute('disabled')
        })
    })
})

socket.emit('join')