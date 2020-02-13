export default {
  initial: [
    [{ text: '👤 Мой профиль' , callback_data: 'myProfile' }],
    [{ text: '❓ Информация' , callback_data: 'information' }],
    [{ text: 'Связь с нами' , url: 'https://t.me/kr_fen2' }]
  ],
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