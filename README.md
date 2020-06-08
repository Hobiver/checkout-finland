# checkout-finland
Client for checkout payment service (https://checkoutfinland.github.io). Start by running npm run build

## Installation

npm install --save checkout-finland

## Usage

### Create client 

Use test credentials for testing purposes:
https://checkoutfinland.github.io/psp-api/#/?id=test-credentials

```
const CheckoutFinland = require('checkout-finland')
const client = new CheckoutFinland(merchantId, secret)
```

### Create payment
https://checkoutfinland.github.io/psp-api/#/?id=create
```
const { transactionId } = await client.createPayment(payment)
```

### Get payment 
https://checkoutfinland.github.io/psp-api/#/?id=get
```
const data = await client.getPayment(transactionId)
```

### Create refund fot the payment 
https://checkoutfinland.github.io/psp-api/#/?id=refund
```
const data = await client.createRefund(refund, transactionId)
```

### Create email refund for the payment 
https://checkoutfinland.github.io/psp-api/#/?id=email-refund
```
const data = await client.createEmailRefund(refund, transactionId)
```

## Testing

You can run unit tests made with jest:
`npm test`
