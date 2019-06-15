const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

const app = express();

app
.use(bodyParser.json())
.use('/api/web', function(req, res) {
    exec('gksudo "apt install apache2 -y"', function(error, stdout, stderr){
        console.log(error, stderr, stdout);
        if (error) {
            return res.status(500).json({
                message: 'Internal server error',
                error: error
            });
        }
        res.status(200).json({stderr, stdout});
    });
})
.use('/api/multimed', function(req, res){
    exec('gksudo "apt install blender inkscape gimp -y"', function(error, stdout, stderr) {
        console.log(error, stderr, stdout);
        if (error) {
            return res.status(500).json({
                message: 'Internal server error',
                error: error
            });
        }
        res.status(200).json({stderr, stdout});
    });
})
.use('/api/mobile', function(req, res){
    exec('wget -P ~ https://dl.google.com/dl/android/studio/ide-zips/3.4.1.0/android-studio-ide-183.5522156-linux.tar.gz', function(error, stdout, stderr) {
        console.log(error, stderr, stdout);
        if (error) {
            return res.status(500).json({
                message: 'Internal server error',
                error: error
            });
        }
        res.status(200).json({stderr, stdout});
    });
})
.listen(3000, function(){
    console.log('your app listing to port 3000');
})