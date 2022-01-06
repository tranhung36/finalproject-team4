const faker = require('faker')
const Product = require('../../models/product.model')
const db = require('../database/db')
const slugify = require('slugify')

require('dotenv').config()
db.connect()

for (let i = 0; i <= 15; i++) {
    const product = new Product({
        name: faker.commerce.productName(),
        slug: slugify(faker.commerce.productName(), {
            lower: true
        }),
        price: faker.commerce.price(),
        description: faker.commerce.productDescription(),
        thumbnail:faker.image.image(),
        
        
    })

    product.save((err, data) => {
        if (err) {
            console.log(err)
        }
    })
}