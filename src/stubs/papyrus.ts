export default {
  initial: 'Big Toys приветствует тебя, Друг !',
  initialSecond: '➖ Выберите ваш город для просмотра товаров',
  wallet: (wallets) => {
    let summaryString = 'Доступные кошельки: '
    wallets.forEach(wallet => {
      summaryString += `\n\nИмя: ${wallet.name}\nНомер: ${wallet.number}\nТип: ${wallet.walletType}\nБаланс: ${wallet.balance}`
    })
    return summaryString
  },
  profile: (username: string, userId: number, countOfPurchases: number, registrationDate: string) => `⚙️ Привет, ${username}

Ваш ID - #${userId}
Кол-во покупок - ${countOfPurchases} шт.
Дата регистрации - ${registrationDate}`,
  information: `Для покупки товара
-Выберете ваш город
-Выберете товар и район
-Нажмите 'Оплатить заказ'
-Следуйте указаниям
-Нажмите 'Я оплатил заказ'
* Вы получите товар автоматически если деньги поступили на кошелек
Контакты оператора - https://t.me/kr_fen2`,
  discountSystem: (referralFriends: number, bonusBalance: number, userId: number) => `👥 Система скидок

Вы привели друзей - ${referralFriends} шт.
Ваш бонусный баланс - ${bonusBalance} грн.
Ваша реф. ссылка - https://t.me/big71_bot?start=${userId}

За каждую покупку вашего друга вы будете получать 2% от суммы его заказа.
Вы можете использовать реферальный баланс как скидку на покупку любого товара.`,
  enterPromocode: '💰Введите ваш промокод',
  historyOfPurchases: (countOfPurchases: number, historyOfPurchases: any[]) => {
    let summaryString = `📊 История ваших покупок (${countOfPurchases} шт.)\n`
    if (historyOfPurchases.length === 0) {
      summaryString += '\nВы еще ничего не купили!'
    }
    historyOfPurchases.forEach(purchase => {
      // Do something
    })
    return summaryString
  },
  promocodeDoesNotExist: '⛔️ Промокод не найден!',
  getProductsByCity: '➖ Выберите товар для просмотра районов',
  getAreasByProduct: '➖ Выберите удобный для вас район города',
  displayProductDetails: (title: string, description: string, city: string, area: string) => `${title}
Описание: ${description}
Город и район: ${city} (${area})

Товар зарезервирован, оплатите его в течении 30 минут
➖ Выберите способ оплаты товара:`,
  orderDiscarded: 'Ваш заказ успешно удален!',
  payProduct: (title, description, city, area, wallet, price) => `${title}
Описание: ${description}
Город и район: ${city} (${area})

◼️ Инструкция по оплате товара через EasyPay.
Пополните кошелек ${wallet} 
одним платежом на сумму ${price} грн или больше (без учета комиссии)

➖ПОСЛЕ ПОПОЛНЕНИЯ КОШЕЛЬКА ПОДОЖДИТЕ 1-2 МИН И НАЖМИТЕ 'ПРОВЕРИТЬ ОПЛАТУ'`,
  orderData: (title, response) => `Данные вашего заказа (${title}):\n\n${response}`,
  succesfulPayment: '✔ Благодарим за покупку!\nДля продолжения работы с ботом введите - /start'
}