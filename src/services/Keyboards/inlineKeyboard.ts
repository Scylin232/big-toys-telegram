import { chunks } from "../../utils"

export default {
  initial: (places) => {
    const keyboard = [
      [{ text: '👤 Мой профиль' , callback_data: 'myProfile' }],
      [{ text: '❓ Информация' , callback_data: 'information' }],
      [{ text: 'Связь с нами' , url: 'https://t.me/kr_fen2' }]
    ]
    chunks(places).forEach(item => {
      if (typeof item[1] === 'undefined') {
        return keyboard.unshift([{ text: item[0].city, callback_data: `getProductsByCity:${item[0]._id}` }])
      }
      keyboard.unshift([{ text: item[0].city, callback_data: `getProductsByCity:${item[0]._id}` }, { text: item[1].city, callback_data: `getProductsByCity:${item[1]._id}` }])
    });
    return keyboard;
  },
  back: [
    [{ text: '🔙 Назад', callback_data: 'back' }]
  ],
  secondBack: [
    [{ text: '⚫ Главное меню', callback_data: 'back' }]
  ],
  profile: [
    [{ text: '👥 Система скидок', callback_data: 'systemOfDiscounts' }],
    [{ text: '📅 История покупок', callback_data: 'historyOfPurchases' }],
    [{ text: '🔙 Назад', callback_data: 'back' }]
  ],
  discountSystem: [
    [{ text: '🎁 Ввести промокод', callback_data: 'enterPromocode' }], 
    [{ text: '⚫ Главное меню', callback_data: 'back' }],
  ],
  products: (products) => {
    const keyboard = [[{ text: '🔙 Назад', callback_data: 'back' }]]
    products.forEach(product => {
      if (product.stock.length === 0) {
        return;
      }
      keyboard.unshift([{ text: product.title, callback_data: `getAreasByProduct:${product._id}` }])
    })
    return keyboard
  },
  areas: (areas) => {
    const keyboard = [[{ text: '⚫ Главное меню', callback_data: 'back' }]]
    areas.forEach(area => {
      keyboard.unshift([{ text: area, callback_data: `displayOrderDetails:${area}` }])
    })
    return keyboard
  },
  paymentMethod: (price, area, isBonusBalanceMatch, bonusBalance) => {
    let keyboard = [
      [{ text: `🔷 EasyPay (${price} грн)`, callback_data: `payProduct:${area}` }, { text: `✖ Отменить заказ`, callback_data: 'discardOrder' }],
    ]
    if (isBonusBalanceMatch) {
      keyboard = [
        [{ text: `🔷 EasyPay (${price} грн)`, callback_data: `payProduct:${area}` }, { text: `Купить за бонусы (${bonusBalance} грн)`, callback_data: `payProductByBonuses` }],
        [{ text: `✖ Отменить заказ`, callback_data: 'discardOrder' }]
      ]
    }
    return keyboard
  },
  payProduct: [
    [{ text: '✔ Проверить оплату', callback_data: 'checkPayment' }, { text: '✖ Отмена', callback_data: 'discardOrder' }]
  ]
}