const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const appList = require('./list.json');

const app = express();

app
.use(bodyParser.json())
.use('/api/web', async function(req, res) {
    const cc = await exec('wget -P ~/ https://az764295.vo.msecnd.net/stable/c7d83e57cd18f18026a8162d042843bda1bcf21f/code_1.35.1-1560350270_amd64.deb', async function(error, stderr, stdout){
        if (error) {
            return res.status(500).json({
                message: 'Internal server error',
                error: error
            });
        }
        const xampp = await exec('wget -P ~ https://images.unsplash.com/photo-1560507074-b9eb43faab00?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&dl=pawel-czerwinski-1678552-unsplash.jpg', function(error, stderr, stdout){
            console.log(`stderr: ${stderr}\nstdout: ${stdout}\nerror: ${error}`);
            if (error) {
                return res.status(500).json({
                    message: 'Internal server error',
                    error: error
                });
            }
            return {stderr,stdout};
        })
        res.status(200).json(`stderr: ${stderr}\nstdout: ${stdout}\nxampp: ${xampp}`);
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