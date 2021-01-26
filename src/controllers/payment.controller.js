const dollarsToCents = require('dollars-to-cents')
const { Order } = require('../model')
const { userConfirmationOrderEmail, adminConfirmationOrderEmail } = require('./mail.controller')
const { sum } = require('ramda')
const stripe = require('stripe')('sk_test_51HyxxjH57z5tRjHiv5cI7GstZO2ZgAvoUMTdWgnT04S0iZFIpqI0lavFLLLSEdTQvSAX7NyT1WWgtaIaXiqJjNEs00dy6aLiz1')


const createPaymentIntent = async ({ body: { fullname, address, phone, email, products } }, res) => {
  try {

    if (!address) {
      throw new Error('Адрес обязателен')
    }

    const amount = sum(products.map(i => Number(i.price)))
    const productsIds = products.map(({ _id }) => _id)
    const prepareOrder = {
      fullname, address, phone, email, products: productsIds, amount
    }

    const newOrder = await new Order(prepareOrder)
    const saveOrder = await newOrder.save()

    const paymentIntent = await stripe.paymentIntents.create({
      amount: dollarsToCents(amount),
      currency: 'eur',
      payment_method_types: ['card'],
      metadata: {
        orderId: String(saveOrder._id)
      }
    })

    return res.status(200).send({
      paymentIntent,
      saveOrder
    })
  } catch (err) {
    res.status(500).send(err)
  }
}

const stripeWebHook = async ({ body }, res) => {
  try {
    console.log('stripeWebHook', body)
    const orderId = body.data.object.metadata.orderId
    const order = await Order.findById(orderId)

    if (!order) {
      throw new Error('Order not found')
    }

    await Order.findByIdAndUpdate(orderId, { status: 'Paid' })

    userConfirmationOrderEmail(order)
    adminConfirmationOrderEmail(order)

    return res.status(200).send('success')
  } catch (err) {
    res.status(500).send(err)
  }
}

module.exports = {
  createPaymentIntent,
  stripeWebHook
}
