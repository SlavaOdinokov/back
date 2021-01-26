const boom = require('@hapi/boom')

const genericCrud = (model, { get = '', getAll = '' } = {}) => ({
  // получить один
  async get({ params: { id } }, res) {
    try {
      const item = await model.findById(id).populate(get)
      return res.status(200).send(item)
    } catch (err) {
      return res.status(400).send(boom.boomify(err))
    }
  },
  // получить все
  async getAll(req, res) {
    try {
      const items = await model.find().populate(getAll)
      return res.status(200).send(items)
    } catch (err) {
      return res.status(400).send(boom.boomify(err))
    }
  },
  // создать
  async create({ body }, res) {
    try {
      const item = new model(body)
      const newItem = await item.save()
      return res.status(200).send(newItem)
    } catch (err) {
      return res.status(400).send(boom.boomify(err))
    }
  },
  // обновить один
  async update({ params: { id }, body }, res) {
    try {
      console.log(id);
      const item = await model.findByIdAndUpdate(id, body, { new: true })
      return res.status(200).send(item)
    } catch (err) {
      return res.status(400).send(boom.boomify(err))
    }
  },
  // удалить один
  async delete({ params: { id } }, res) {
    try {
      await model.findByIdAndDelete(id)
      return res.status(200).send({ status: 'OK', message: 'Продукт удален' })
    } catch (err) {
      return res.status(400).send(boom.boomify(err))
    }
  }
})

module.exports = genericCrud
