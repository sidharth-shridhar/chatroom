const socket = io('http://localhost:3000')
const messageContainer = document.getElementById('message-container')
const roomContainer = document.getElementById('room-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
const likeButton = document.getElementById('like-button')
const userbrand = document.getElementById('user')

if (messageForm != null) {
  const user = prompt('What is your name?')
  // appendMessage('')
  userbrand.innerText = `(joined in as ${user})`
  socket.emit('new-user', roomName, user)

  messageForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = messageInput.value
    appendMessage(user, message, false)
    socket.emit('send-chat-message', roomName, message)
    messageInput.value = ''
  })
  
}

socket.on('room-created', room => {
  const roomElement = document.createElement('div')
  roomElement.innerText = room
  const roomLink = document.createElement('a')
  roomLink.href = `/${room}`
  roomContainer.append(roomElement)
  roomContainer.append(roomLink)
})

socket.on('chat-message', data => {
  appendMessage(data.name, data.message, true)
  
})

socket.on('user-connected', name => {
  appendMessage(name, ` joined the chatroom`, false)
})

socket.on('like-notification', data => {
  console.log(data)
  appendMessage(data.name, `liked ${data.user}'s message "${data.message}"`, false)
})

socket.on('user-disconnected', name => {
  appendMessage(name, ` left the chatroom`, false)
})

function appendMessage(name, message, canLike) {
  const messageElement = document.createElement('div')
  messageElement.setAttribute("id", "message-div")
  const username = document.createElement('span')
  username.style.fontWeight ="bold";
  username.innerText = name;
  messageElement.innerText = message;
  messageContainer.append(username)
  messageContainer.append(messageElement)

  if(canLike){
    const likeButton = document.createElement('button') 
    const icon = document.createElement('i') 
    icon.setAttribute("class","fa fa-heart") 
    likeButton.setAttribute("id", "like-button")
    likeButton.innerHTML = '<i class="far fa-heart"></i> Like'
    messageElement.append(likeButton)
    likeButton.addEventListener('click', e => {
      likeButton.innerHTML = '<i class="fas fa-heart"></i> Liked'
      likeButton.disabled = true
      likeButton.style.color = "maroon"
      e.preventDefault()
      const messageText = message
      appendMessage(name, `You liked ${name}'s message: "${messageText}"`, false)
      socket.emit('like-notification-message', roomName, message, name)
    })
  }
}