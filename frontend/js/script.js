//login elementos

const login = document.querySelector('.login')
const loginForm = document.querySelector('.login__form')
const loginInput = document.querySelector('.login__input')

//chat alementosd
const chat = document.querySelector('.chat')
const chatForm = document.querySelector('.chat__form')
const chatInput = document.querySelector('.chat__input')
const chatMessage = document.querySelector('.chat__messages')



const colors = [
    "cadetblue",
    "darkgoldenrod",
    "cornflowerblue",
    "darkkhaki",
    "hotpink",
    "gold"
]

const user = {id: '' , name:'' , color:''}

let websocket 

const creatMessageSelfElement = (content) =>{
    const div = document.createElement('div')

    div.classList.add('message--self')
    div.innerHTML = content

    return div
}

const creatMessageOtherElement = (content , sender , senderColor) =>{
    const div = document.createElement('div')
    const span = document.createElement('span')

    div.classList.add('message--other')

    div.classList.add('message--self')
    span.classList.add('message--sender')
    span.style.color = senderColor

    div.appendChild(span)

    span.innerHTML = sender

    div.innerHTML += content

    return div
}


const getRandomColor = () => {
    const randomIndex  =  Math.floor(Math.random() * colors.length)

    return colors[randomIndex]
}

const scrollScree = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavier: 'smooth'
})
}

const processMessage = ({data}) => {
    const  {userId , userColor , userName , content} = JSON.parse(data)

    const message = userId == user.id ? 
        creatMessageSelfElement(content) :   
        creatMessageOtherElement(content , userName , userColor)
    
    chatMessage.appendChild(message)

    scrollScree()
}

const hendleLogin = ( event ) => {
    event.preventDefault()
    
    user.id =  crypto.randomUUID()
    user.name = loginInput.value
    user.color = getRandomColor()
    
    login.style.display = 'none'
    chat.style.display = 'flex'
    
    websocket = new WebSocket('ws://localhost:8080')
    
   websocket.onmessage = processMessage

} 

const sendMessage = (event) => {
    event.preventDefault()

    const message = {
        userId :user.id,
        userName : user.name,
        userColor : user.color,
        content: chatInput.value
    }

    websocket.send(JSON.stringify(message))

    chatInput.value = ''
}

loginForm.addEventListener('submit', hendleLogin)
chatForm.addEventListener('submit', sendMessage)