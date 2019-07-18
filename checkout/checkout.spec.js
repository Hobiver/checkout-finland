const Checkout = require('./Checkout')
const uuidv1 = require('uuid/v1')

describe('Checkout client', () => {
  describe('create payment', () => {
    test('success if everything correct', async () => {
      const payment = {
        stamp: uuidv1(),
        reference: '3759170',
        amount: 1525,
        currency: 'EUR',
        language: 'FI',
        items: [
          {
            unitPrice: 1525,
            units: 1,
            vatPercentage: 24,
            productCode: '#1234',
            deliveryDate: '2018-09-01',
            stamp: uuidv1(),
            merchant: '695874',
            reference: 'kurssi-1'
          }
        ],
        customer: {
          email: 'test.customer@example.com'
        },
        redirectUrls: {
          success: 'https://ecom.example.com/cart/success',
          cancel: 'https://ecom.example.com/cart/cancel'
        }
      }

      const client = new Checkout('695861', 'MONISAIPPUAKAUPPIAS')
      const res = await client.createPayment(payment)
      expect(res).toBeDefined()
    })
    test('error if secret wrong', async () => {
      const payment = {
        stamp: uuidv1(),
        reference: '3759170',
        amount: 1525,
        currency: 'EUR',
        language: 'FI',
        items: [
          {
            unitPrice: 1525,
            units: 1,
            vatPercentage: 24,
            productCode: '#1234',
            deliveryDate: '2018-09-01',
            stamp: uuidv1(),
            merchant: '695874',
            reference: 'kurssi-1'
          }
        ],
        customer: {
          email: 'test.customer@example.com'
        },
        redirectUrls: {
          success: 'https://ecom.example.com/cart/success',
          cancel: 'https://ecom.example.com/cart/cancel'
        }
      }
      const client = new Checkout('695861', 'AIPPUAKAUPPIAS')
      try {
        await client.createPayment(payment)
      } catch (err) {
        expect(err.statusCode).toBe(401)
      }
    })
  })

  describe('get payment', () => {
    test('success if everything correct', async () => {
      const payment = {
        stamp: uuidv1(),
        reference: '3759170',
        amount: 1525,
        currency: 'EUR',
        language: 'FI',
        items: [
          {
            unitPrice: 1525,
            units: 1,
            vatPercentage: 24,
            productCode: '#1234',
            deliveryDate: '2018-09-01',
            stamp: uuidv1(),
            merchant: '695874',
            reference: 'kurssi-1'
          }
        ],
        customer: {
          email: 'test.customer@example.com'
        },
        redirectUrls: {
          success: 'https://ecom.example.com/cart/success',
          cancel: 'https://ecom.example.com/cart/cancel'
        }
      }
      const client = new Checkout('695861', 'MONISAIPPUAKAUPPIAS')
      const { transactionId } = await client.createPayment(payment)
      const res = await client.getPayment(transactionId)
      expect(res).toBeDefined()
    })
  })
})
