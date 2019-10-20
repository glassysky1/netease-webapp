const express = require('express')
const app = express()

app.use(express.static('./dist'))

app.get(/.*/,function (req,res) {
  res.sendFile(__dirname+'./dist/index.html')
})

app.listen(8000,()=>{
  console.log('Server started....');
  
})