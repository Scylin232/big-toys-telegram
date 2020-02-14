import Markup from 'telegraf/markup'
import axios from 'axios'
import inlineKeyboards from '../Keyboards/inlineKeyboard'
import papyrus from '../../stubs/papyrus'
import { easyPayData } from '../Crontab'
import { availableScenarious } from '../../helpers/markup'
import { usersModel, placesModel, productsModel, historyModel, promocodeModel } from '../MongoDB'
import { session } from '../Session'
import { bot } from '../../bootstrap'

const scenarious = {
  initial: async ctx => {
    const user = await usersModel.findOne({ userId: ctx.from.id })
    const places = await placesModel.find({})
    if (user === null) {
      await usersModel.create({ userId: ctx.from.id, username: ctx.from.username, registrationDate: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''), countOfPurchases: 0, referralFriends: [], bonusBalance: 0, historyOfPurchases: [] })
    }
    await session.init(ctx.from.id)
    await ctx.reply(papyrus.initialSecond, 
      Markup.inlineKeyboard(inlineKeyboards.initial(places))
        .resize()
        .extra()
    )
    return await ctx.reply(papyrus.initial)
  },
  coshInfo: async ctx => {
    const response = await axios({
      url: 'https://api.easypay.ua/api/wallets/get',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${easyPayData.bearerToken}`,
        'AppId': easyPayData.appId,
        'PageId': easyPayData.pageId
      }
    })
    return await ctx.reply(papyrus.wallet(response.data.wallets));
  },
  myProfile: async ctx => {
    const user = await usersModel.findOne({ userId: ctx.from.id })
    return await ctx.editMessageText(papyrus.profile(ctx.from.username, ctx.from.id, user.countOfPurchases, user.registrationDate),
      Markup.inlineKeyboard(inlineKeyboards.profile)
        .resize()
        .extra()
    )
  },
  information: async ctx => {
    return await ctx.editMessageText(papyrus.information,
      Markup.inlineKeyboard(inlineKeyboards.back)
        .resize()
        .extra()
    )
  },
  back: async ctx => {
    const places = await placesModel.find({})
    await session.update(ctx.from.id, 'scope', null)
    return await ctx.editMessageText(papyrus.initialSecond,
      Markup.inlineKeyboard(inlineKeyboards.initial(places))
        .resize()
        .extra()
    )
  },
  systemOfDiscounts: async ctx => {
    const user = await usersModel.findOne({ userId: ctx.from.id })
    return await ctx.editMessageText(papyrus.discountSystem(user.referralFriends, user.bonusBalance, ctx.from.id),
      Markup.inlineKeyboard(inlineKeyboards.discountSystem)
        .resize()
        .extra()
    )
  },
  enterPromocode: async ctx => {
    await session.update(ctx.from.id, 'scope', 'enterPromocode')
    return await ctx.reply(papyrus.enterPromocode,
      Markup.inlineKeyboard(inlineKeyboards.back)
        .resize()
        .extra()
    )
  },
  historyOfPurchases: async ctx => {
    const history = await historyModel.find({ buyerId: ctx.from.id })
    return await ctx.editMessageText(papyrus.historyOfPurchases(history),
      Markup.inlineKeyboard(inlineKeyboards.secondBack)
        .resize()
        .extra()
    )
  },
  applyPromocode: ctx => async promocode => {
    const promo = await promocodeModel.findOne({ promo: promocode })
    if (promo) {
      await usersModel.findOneAndUpdate({ userId: ctx.from.id }, { $inc: { bonusBalance: promo.increaseValue } })
      await promocodeModel.deleteOne({ _id: promo._id })
      await session.update(ctx.from.id, 'scope', null)
      return await ctx.reply(papyrus.promocodeUsed(promo.increaseValue))
    }
    return await ctx.reply(papyrus.promocodeDoesNotExist)
  },
  getProductsByCity: ctx => async city => {
    const place = await placesModel.findById(city)
    const products = await productsModel.find({ city: place.city })
    return await ctx.editMessageText(papyrus.getProductsByCity,
      Markup.inlineKeyboard(inlineKeyboards.products(products))
        .resize()
        .extra()
    )
  },
  getAreasByProduct: ctx => async productId => {
    const product = await productsModel.findById(productId)
    await session.update(ctx.from.id, 'product', productId)
    return await ctx.editMessageText(papyrus.getAreasByProduct,
      Markup.inlineKeyboard(inlineKeyboards.areas(product.area))
        .resize()
        .extra()
    )
  },
  displayOrderDetails: ctx => async area => {
    const productId = await session.getEntity(ctx.from.id, 'product')
    const product = await productsModel.findById(productId)
    const user = await usersModel.findOne({ userId: ctx.from.id })
    let isBonusBalanceMatch = false
    if (user.bonusBalance >= product.price) {
      isBonusBalanceMatch = true
    }
    return await ctx.editMessageText(papyrus.displayProductDetails(product.title, product.description, product.city, area),
      Markup.inlineKeyboard(inlineKeyboards.paymentMethod(product.price, area, isBonusBalanceMatch, user.bonusBalance))
        .resize()
        .extra()
    )
  },
  discardOrder: async ctx => {
    await session.checkout(ctx.from.id)
    const places = await placesModel.find({})
    await ctx.editMessageText(papyrus.orderDiscarded)
    return await ctx.reply(papyrus.initialSecond,
      Markup.inlineKeyboard(inlineKeyboards.initial(places))
        .resize()
        .extra()
    )
  },
  payProduct: ctx => async area => { 
    const productId = await session.getEntity(ctx.from.id, 'product')
    const product = await productsModel.findById(productId)
    return await ctx.editMessageText(papyrus.payProduct(product.title, product.description, product.city, area, '12345678', product.price),
      Markup.inlineKeyboard(inlineKeyboards.payProduct)
        .resize()
        .extra()
    )
  },
  payProductByBonuses: async ctx => {
    const productId = await session.getEntity(ctx.from.id, 'product')
    const product = await productsModel.findById(productId)
    if (product === null) {
      return;
    }
    const stock = product.stock[Math.floor(Math.random() * product.stock.length)]
    await usersModel.findOneAndUpdate({ userId: ctx.from.id }, { $inc: { countOfPurchases: 1, bonusBalance: Number(-Math.abs(product.price)) } })
    await historyModel.create({ response: stock, buyerId: ctx.from.id, buyerUsername: ctx.from.username, price: product.price, date: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') })
    await productsModel.findByIdAndUpdate(productId, { stock: product.stock.filter(elem => elem !== stock) })
    await session.checkout(ctx.from.id)
    await ctx.editMessageText(papyrus.orderData(product.title, stock))
    return await ctx.reply(papyrus.succesfulPayment,
      Markup.inlineKeyboard(inlineKeyboards.secondBack)
        .resize()
        .extra()
    )
  },
  checkPayment: async ctx => {
    const productId = await session.getEntity(ctx.from.id, 'product')
    const product = await productsModel.findById(productId)
    if (product === null) {
      return;
    }
    const user = await usersModel.findOne({ userId: ctx.from.id })
    const stock = product.stock[Math.floor(Math.random() * product.stock.length)]
    if (false) {
      return await ctx.answerCbQuery('Платёж не найден! Попробуйте позже!')
    }
    if (user.inviterId) {
      await usersModel.findOneAndUpdate({ userId: user.inviterId }, { $inc: { bonusBalance: Math.round((2 / 100) * product.price) } }) 
    }
    await usersModel.findOneAndUpdate({ userId: ctx.from.id }, { $inc: { countOfPurchases: 1 } })
    await historyModel.create({ response: stock, buyerId: ctx.from.id, buyerUsername: ctx.from.username, price: product.price, date: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') })
    await productsModel.findByIdAndUpdate(productId, { stock: product.stock.filter(elem => elem !== stock) })
    await session.checkout(ctx.from.id)
    await ctx.editMessageText(papyrus.orderData(product.title, stock))
    return await ctx.reply(papyrus.succesfulPayment,
      Markup.inlineKeyboard(inlineKeyboards.secondBack)
        .resize()
        .extra()
    )
  },
  addReferral: ctx => async inviterId => {
    const user = await usersModel.findOne({ userId: inviterId })
    if (user.referralFriends.indexOf(ctx.from.id) !== -1) {
      return;
    }
    await usersModel.findOneAndUpdate({ userId: ctx.from.id }, { inviterId })
    return await usersModel.findOneAndUpdate({ userId: inviterId }, { $push: { referralFriends: ctx.from.id } })
  },
  adminMakeMailing: async message => {
    const users = await usersModel.find({})
    return users.forEach(async user => {
      await bot.telegram.sendMessage(user.userId, message)
    })
  }
}

const anthology = new Map()
for (const scenario in availableScenarious) {
  if (Reflect.has(availableScenarious, scenario)) {
    anthology.set(scenario, scenarious[scenario])
  }
}

export default anthology