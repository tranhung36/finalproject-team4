
const faker = require('faker')
const User = require('../../models/user.model')
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://hung:1234@cluster0.jkk2t.mongodb.net/fp-ecommerce?retryWrites=true&w=majority', { useNewUrlParser: true })

async function fakeUser() {
  const roles = ["admin", "user"]
  faker.locale = 'vi'
  for (let i = 0; i < 10; i++) {
    const user = new User({
      user: faker.name.findName(),
      address: faker.address.streetAddress() + ' ' + faker.address.stateAbbr() + ' ' + faker.address.city(),
      telephone: faker.phone.phoneNumber(),
      role: roles[Math.floor(Math.random() * roles.length)],
      timestamps: faker.time
    })
    await user.save()
  }
}
// fakeUser()

