const mongoose = require('mongoose')

async function connect() {
    try {
        await mongoose
            .connect(process.env.DATABASE)
        console.log('connect successfully')
    } catch (error) {
        console.log('error connecting')
    }
}

module.exports = {
    connect
}