var express = require('express');
var router = express.Router();
var {check, validationResult} = require('express-validator');
const url = 'https://picsum.photos/seed/picsum';
const qr = 'https://image-charts.com/chart?';

router.get('/', function (req, res) {
    res.render('index');
})

router.route('/generate-image')
    .get(function(req,res){
        res.render('customize_photo',{title:"Create your own URL"})
    })
    .post(async function(req,res){

        await check('height','Height cannot be less than 0 or empty!').isInt({min:0}).run(req);
        await check('width','Width cannot be less than 0 or empty!').isInt({min:0}).run(req);
        await check('blur','Blur entered invalid (1-10)!').isInt({min:1,max:10}).run(req);

        const errors = validationResult(req);

        if(errors.isEmpty()){
            let height = "/"+req.body.height;
            let width = "/"+req.body.width;
            let blur = "?blur="+req.body.blur;
            let grayscale = '';
            if (req.body.grayscale){
                grayscale = '?grayscale';
                blur="&blur="+req.body.blur;
            }
            let newUrl = url+height+width+grayscale+blur;
            res.redirect(newUrl);
            
        }else{
            res.render('customize_photo',{
                errors: errors.array(),
                title: "Create your own URL",
            })
        }
    })
router.route('/generate-qr-code')
    .get(function(req,res){
        res.render('customize_QR',{title:"Create your own QR code"})
    })
    .post(async function(req,res){

        await check('height','Height cannot be less than 0 or empty!').isInt({min:0}).run(req);
        await check('width','Width cannot be less than 0 or empty!').isInt({min:0}).run(req);
        await check('value','Information cannot be empty!').notEmpty().run(req);

        const errors = validationResult(req);

        if(errors.isEmpty()){
            let height = "chs="+req.body.height;
            let width = "x"+req.body.width+"&cht=qr";
            let value = "&chl="+req.body.value;
            let newUrl = qr+height+width+value;
            res.redirect(newUrl);
            
        }else{
            res.render('customize_QR',{
                errors: errors.array(),
                title: "Create your own QR code",
            })
        }
})

module.exports = router;