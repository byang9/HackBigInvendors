var express = require('express')
var path = require('path')
var bP = require('body-parser')
var cookieParser = require('cookie-parser')
var mongojs = require('mongojs')
var db = mongojs('mongodb://masterphuc:vietnam64@ds039125.mlab.com:39125/se_books_2017', ['Customers','accounts'])
var jsonfile = require('jsonfile')

//var index = require('./routes/index')
//var tasks = require('./routes/tasks')
//var user = require('./routes/user')
//var book = require('./routes/book')641

var app = express()

////view engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.engine('html', require('ejs').renderFile)


//static
app.use(express.static(path.join(__dirname, 'public')))

//cookie
app.use(cookieParser())

//body parser
app.use(bP.json())
app.use(bP.urlencoded({
    extended: false
}))
//
//app.use('/', index)
//app.use('/api', tasks)
//app.use('/user', user)
//app.use('/book', book)
app.get('/register', function (req, res) {
    res.render("register.html")
})
app.post('/register', function (req, res, next) {
    var fname = req.body.fname
    var lname = req.body.lname
    var email = req.body.email
    var pword = req.body.password
    var cnum = req.body.cnum
    var cvn = req.body.cvn
    var bill = req.body.bill
    var mail = req.body.mail

    var newAcc = {
        cardNumber: cnum,
        cvn: cvn,
        bill: bill,
        mail: mail,
        email: email
    }

    db.Customers.findOne({
        email: email
    }, function (err, customer) {
        if (err) {
            res.send(err)
        }
        if (customer != null) {
            res.send("403")
        } else {
            var newCustomer = {
                "fname": fname,
                "lname": lname,
                "pword": pword,
                "email": email
            }
            db.Customers.save(newCustomer, function (err, customer) {
                if (err) {
                    res.send(err)
                }
                res.cookie("email", email)
                db.accounts.save(newAcc, function (err, acc) {
                    if (err) {
                        res.send(err)
                    }
                    res.send("200")
                })
            })
        }
    })
})

app.get('/home', function (req, res) {
    res.render("index.html")
})

app.get('/addcard', function (req, res) {
    res.render("addCard.html")
})

app.post('/login', function (req, res) {
    var email = req.body.email;
    var pword = req.body.pword;
    console.log(email + pword)
    db.Customers.findOne({
        email: email
    }, function (err, customer) {
        if (err) {
            res.send(err)
        }else{
            console.log(customer)
            if(customer.pword==pword){
                res.cookie("email",email)
                res.send("200")
            }else{
                res.send("401")
            }
        }
    })
})

app.post('/buy', function(req, res){
    
})
//
//app.get('/list/:item', function (req, res, next) {
//    var isbnVal = req.params.isbn
//    var file = './public/tmp/data.json'
//    db.books.find({
//        isbn: isbnVal
//    }, function (err, book) {
//        if (err) {
//            res.send(err)
//        }
//        var obj = book
//        jsonfile.writeFile(file, obj, function (err) {
//            console.error(err)
//        })
//    })
//    next()
//}, function (req, res) {
//    res.render("list.html")
//})

//
//app.post('/list/:itemName/:maxCount/:title/:price/:seller', function (req, res) {
//    //    console.log("hit")
//
//    var book = {
//        "isbn": req.params.isbn,
//        "author": req.params.author,
//        "title": req.params.title,
//        "price": req.params.price,
//        "seller": req.params.seller,
//        "buyer": "no"
//    }
//
//    db.counters.findAndModify({
//        query: {
//            _id: "bookId"
//        },
//        update: {
//            $inc: {
//                sequence_value: 1
//            }
//        },
//        new: true
//    }, function (err, counter) {
//
//        //save img
//        
//
//    });
//
//})
//



app.listen((process.env.PORT || 3000), function () {
    console.log('server up')
})
