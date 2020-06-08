import * as crypto from 'crypto'
import request from 'request-promise'
import { v1 as uuidv1 } from 'uuid'
import { CheckoutPayment, CheckoutRefund } from './types'


export class CheckoutClient {
  private algorithm: string
  private secret: string
  private merchantId: string
  private baseUrl: string
  constructor(merchantId: string, secret: string) {
    this.algorithm = 'sha256'
    this.secret = secret
    this.merchantId = merchantId
    this.baseUrl = 'https://api.checkout.fi'
  }

  calculateHmac(params: any, body: any) {
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

  async makeRequest(body: any, method: 'POST' | 'GET' | 'PUT', path: string, transactionId?: string, queryParams?: any) {
    const timestamp = new Date()
    const checkoutHeaders: any = {
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

    const req: any = { method, url, headers, json: true, qs: queryParams }
    if (body) req.body = body

    return await request(req)
  }

  async createPayment(payment: CheckoutPayment) {
    try {
      return await this.makeRequest(payment, 'POST', '/payments')
    } catch (err) {
      console.log('Error in create payment: ', err.message)
      throw err
    }
  }

  /**
   * Get data of single payment
   * @param id transactionId from checkout
   */
  async getPayment(id: string) {
    try {
      return await this.makeRequest(null, 'GET', '/payments/' + id, id)
    } catch (err) {
      console.log('Error in get payment: ', err.message)
      throw err
    }
  }

  async createRefund(refund: CheckoutRefund, id: string) {
    try {
      return await this.makeRequest(refund, 'POST', `/payments/${id}/refund`, id)
    } catch (err) {
      console.log('Error in refund: ', err.message)
      throw err
    }
  }

  async createEmailRefund(refund: CheckoutRefund, id: string) {
    try {
      return await this.makeRequest(refund, 'POST', `/payments/${id}/refund/email`, id)
    } catch (err) {
      console.log('Error in refund: ', err.message)
      throw err
    }
  }

  async getPaymentMethods(qs: any) {
    try {
      return await this.makeRequest(null, 'GET', '/merchants/payment-providers', undefined, qs)
    } catch (err) {
      console.log('Error in get payment: ', err.message)
      throw err
    }
  }

  async getPaymentMethodsGrouped(qs: any) {
    try {
      return await this.makeRequest(null, 'GET', '/merchants/grouped-payment-providers', undefined, qs)
    } catch (err) {
      console.log('Error in get payment: ', err.message)
      throw err
    }
  }
}

export default CheckoutClient
