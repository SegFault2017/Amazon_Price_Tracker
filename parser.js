require('dotenv').config()
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const nightmare = require('nightmare')()
// const eT = require('extract-numbers')()
// require(dotenv)
//<span id="priceblock_dealprice" class="a-size-medium a-color-price">CDN$ 16.99</span>

const args = process.argv.slice(2)
const url = args[0]
const minPrice = args[1]

// const url = "https://www.amazon.ca/Orzly-Carry-Compatible-Nintendo-Switch/dp/B01NAUKS62"
// const minPrice = 20
checkPrice()

async function checkPrice(){
    try {
         //"https://www.amazon.ca/Orzly-Carry-Compatible-Nintendo-Switch/dp/B01NAUKS62"
    const priceString = await nightmare.goto(url)
    .wait("#priceblock_ourprice")
    .evaluate(() => document.getElementById("priceblock_ourprice").innerText)
    .end()
    const priceNumber = parseFloat(priceString.replace(/[^0-9.]/g,''))
    if (priceNumber  < minPrice){
        console.log("It is cheap")
        await sendEmail(
            'Price Is Low',
            `The price on ${url} has dropped below ${minPrice}`
        )
       
    }
    } catch (e) {
        await sendEmail(
            'Amazon Price check fails',
            e.message
        )
        throw e
    }
   
}


function sendEmail(subject,body){

    const email ={
        to:'salol@quickemail.top',
        from:'amazon-price-checker@example.com',
        subject: subject,
        text: body,
        html:body

    }

    return sgMail.send(email)
}