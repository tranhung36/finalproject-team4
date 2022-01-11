const faker = require('faker')
const Category = require('../../models/category.model')

module.exports = (req, res, next) => {
    for (let i = 0; i < 5; i++) {
        Category.create({
            name: faker.name.title()
        })
    }
    res.sendStatus(200)
}