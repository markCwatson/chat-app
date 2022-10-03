const users = []

// Returns user if successfully added
const addUser = ({ id, username, room }) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    
    if (!username || !room) {
        return { error: 'Must have username and room!' }
    }

    const existingUser = users.find((user) => {
        return user.username === username && user.room === room
    })

    if (existingUser) {
        return { error: 'Username already taken in room!' }
    }

    const user = { id, username, room }
    users.push(user)
    return { user }
}

// Returns user who was successfully removed
const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })

    if (index === -1) {
        return { error: 'No user found!' }
    }

    return users.splice(index, 1)[0]
}

// Returns a user by id
const getUser = (id) => {
    const userIndex = users.findIndex((user) => {
        return user.id === id
    })

    if (userIndex === -1) {
        return { error: 'No user found!' }
    }

    return users[userIndex]
}

// Retruns all users in a room
const getUsersInRoom = (room) => {
    const usersInRoom = users.filter((user) => {
        return user.room === room
    })

    if (usersInRoom.length == 0) {
        return { error: `No users found in ${room}!` }
    }

    return usersInRoom
}

export { addUser, removeUser, getUser, getUsersInRoom } 