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
  ]
}