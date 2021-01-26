const nodemailer = require("nodemailer")
const { Product } = require('../model')

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'Yandex',
  auth: {
    user: 'delivery@incodewetrust.ru', // generated ethereal user
    pass: '@123@456', // generated ethereal password
  },
})

const userConfirmationOrderEmail = async ({ email, _id, products }) => {

  // let productsArr = []

  // products.forEach(async id => {
  //   const product = await Product.findById(id)
  //   productsArr.push(product)
  // })
  // for(const i = 0; i <= products.length; i++) {
  //   const product = await Product.findById(products[i])
  //   productsArr.push(product)
  // }
  
  
  const mail = await transporter.sendMail({
    from: `"GS delivery" <delivery@incodewetrust.ru>`, // sender address
    to: `${email}`, // list of receivers
    subject: `Подтверждение заказа ${_id}`, 
    text: `Ваш заказ номер ${_id} подтвержден`, 
    html: `
      <ul>
        <li>Ваш заказ</li>
      </ul>
    `,
  })

  return mail
}

const adminConfirmationOrderEmail = async (
  { _id, address, fullname, phone, email }, adminEmail = 'vo.site@mail.ru'
) => {

  const mail = await transporter.sendMail({
    from: `"GS delivery" <delivery@incodewetrust.ru>`, // sender address
    to: `${adminEmail}`, // list of receivers
    subject: "У вас новый заказ", 
    text: `Создан заказ номер ${_id}`, 
    html: `
      <h2>Новый заказ ${_id}</h2>
      <ul>
        <li>Имя: ${fullname}</li>
        <li>Телефон: ${phone}</li>
        <li>Эл. почта: ${email}</li>
        <li>Адрес: ${address}</li>
      </ul>
    `,
  })
  
  return mail
}

module.exports = {
  userConfirmationOrderEmail,
  adminConfirmationOrderEmail
}
