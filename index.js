const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const userRoute = require('./routes/user')
const authRoute = require('./routes/auth')
const productRoute = require('./routes/product')
const cartRoute = require('./routes/cart')
const orderRoute = require('./routes/order')
const stripeRoute = require('./routes/stripe')
const cors = require('cors')

//Configuracion para usar dotenv
dotenv.config()

//Conexion con mongoDB usando la KEY con el .env
mongoose.connect(process.env.MONGO_URL)
    .then(() => { console.log('Mongo DB Conected') })
    .catch((err) => { console.log(err) })

app.use(cors())
//Para que express reconozca todos los datos en json
app.use(express.json())
//Instaciando rutas de la api para hacer los pedidos
app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/products', productRoute)
app.use('/api/carts', cartRoute)
app.use('/api/orders', orderRoute)
app.use('/api/checkout', stripeRoute)

//Arrancando el servidor 
app.listen(process.env.PORT || 8000, () => {
    console.log('Server on port 8000');
})