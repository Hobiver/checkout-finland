const crypto = require('crypto')
const request = require('request-promise')
const uuidv1 = require('uuid/v1')

class CheckoutClient {
  constructor(merchantId, secret) {
    this.algorithm = 'sha256'
    this.secret = secret
    this.merchantId = merchantId
    this.baseUrl = 'https://api.checkout.fi'
  }

  calculateHmac(params, body) {
    const hmacPayload = Object.keys(params)
      .sort()
      .map(key => [key, params[key]].join(':'))
      .concat(body ? JSON.stringify(body) : '')
      .join('\n')

    return crypto
      .createHmac(this.algorithm, this.secret)
      .update(hmacPayload)
      .digest('hex')
  }

  async makeRequest(body, method, path, transactionId, queryParams) {
    const timestamp = new Date()
    const checkoutHeaders = {
      'checkout-account': this.merchantId,
      'checkout-algorithm': 'sha256',
      'checkout-method': method,
      'checkout-nonce': uuidv1(),
      'checkout-timestamp': timestamp.toISOString()
    }

    if (transactionId) checkoutHeaders['checkout-transaction-id'] = transactionId

    const url = this.baseUrl + path
    const signature = this.calculateHmac(checkoutHeaders, body)
    const headers = { ...checkoutHeaders, signature }

    const req = { method, url, headers, json: true, qs: queryParams }
    if (body) req.body = body

    return await request(req)
  }

  async createPayment(payment) {
    try {
      return await this.makeRequest(payment, 'POST', '/payments')
    } catch (err) {
      console.log('Error in create payment: ', err.message)
      throw err
    }
  }

  async getPayment(id) {
    try {
      return await this.makeRequest(null, 'GET', '/payments/' + id, id)
    } catch (err) {
      console.log('Error in get payment: ', err.message)
      throw err
    }
  }

  async createRefund(refund, id) {
    try {
      return await this.makeRequest(refund, 'POST', `/payments/${id}/refund`, id)
    } catch (err) {
      console.log('Error in refund: ', err.message)
      throw err
    }
  }

  async createEmailRefund(refund, id) {
    try {
      return await this.makeRequest(refund, 'POST', `/payments/${id}/refund/email`, id)
    } catch (err) {
      console.log('Error in refund: ', err.message)
      throw err
    }
  }

  async getPaymentMethods(qs) {
    try {
      return await this.makeRequest(null, 'GET', '/merchants/payment-providers', null, qs)
    } catch (err) {
      console.log('Error in get payment: ', err.message)
      throw err
    }
  }

  async getPaymentMethodsGrouped(qs) {
    try {
      return await this.makeRequest(null, 'GET', '/merchants/grouped-payment-providers', null, qs)
    } catch (err) {
      console.log('Error in get payment: ', err.message)
      throw err
    }
  }
}

module.exports = CheckoutClient
