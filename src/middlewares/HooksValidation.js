const razorpay = require('razorpay')

const hooksValidation = async (req,res,next) => {
    const signature = req.header('X-Razorpay-Signature')
    console.log(razorpay.validateWebhookSignature(req.body, signature, process.env.HOOKSIGNATURE))
    next()
}

module.exports = hooksValidation