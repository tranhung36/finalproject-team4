const faker = require('faker')
const Coupons = require('../../models/coupon.model')
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://hung:1234@cluster0.jkk2t.mongodb.net/fp-ecommerce?retryWrites=true&w=majority', {
  useNewUrlParser: true
})

function makeCode(length) {
    const result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


async function fakeCoupon() {
    for (let i = 0; i <= 5; i++) {
        const coupon = new Coupons({
            code: makeCode(12),
            name: faker.lorem.word(),
            amount: Math.floor(Math.random() * 100),
            validFrom: Date.now(),
            validTo: date.setDate(date.getDate() + Math.floor(Math.random() * 10)),
            active: true
        })
        console.log(coupon);
        await coupon.save()
    }
}

fakeCoupon()
