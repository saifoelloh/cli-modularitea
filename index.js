const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const appList = require('./list.json');

const app = express();
const modulePath = '~/.module';
const url = {
    xampp: 'https://www101.zippyshare.com/d/jwzpMWo5/304317/xampp-linux-x64-7.2.19-1-installer.run',
    android: 'https://dl.google.com/dl/android/studio/ide-zips/3.4.1.0/android-studio-ide-183.5522156-linux.tar.gz'
};

app
.use(bodyParser.json())
.use('/api/web', async function(req, res) {
    const command = `mkdir -p ${modulePath} && wget -P ${modulePath} ${url.xampp}`;
    await exec( command, { timeout: 600 * 1000, maxBuffer: 150 * 1024 * 1024, }, function(error, stderr, stdout) {
        if (error) {
            return res.status(500).json({
                success: false,
                code: 500,
                message: 'error while download source',
                result: error
            });
        }
        exec(`ls ${modulePath} | grep xampp`, function(error, stderr, stdout){
            if (error) {
                return res.status(500).json({
                    success: false,
                    code: 404,
                    message: 'file not found',
                    result: error
                });
            }
            exec(`gksudo "./${modulePath}/xampp-linux-x64-7.2.19-1-installer.run"`, function(error, stderr, stdout){
                if (error) {
                    return res.status(500).json({
                        success: false,
                        code: 500,
                        message: 'error while executing command',
                        result: error
                    });
                }
                res.status(200).json({
                    success: true,
                    code: 200,
                    message: 'success installing web module',
                    result: {
                        stdout: stdout,
                        stderr: stderr,
                    }
                });
            })
        })
    });
})
.use('/api/multimedia', function(req, res){
    exec('gksudo "apt install inkscape blender gimp -y"', function(error, stdout, stderr) {
        console.log(error, stderr, stdout);
        if (error) {
            return res.status(500).json({
                success: false,
                code: 500,
                message: 'Internal server error',
                result: error
            });
        }
        res.status(200).json({
            success: true,
            code: 200,
            message: 'success installing multimedia module',
            result: {
                stdout: stdout.replace(/\n/g, ''),
                stderr: stderr.replace(/\n/g, ''),
                error: error ? error.replace(/\n/g, '') : error,
            }
        });
    });
})
.use('/api/mobile', function(req, res){
    exec('gksudo "apt-get install libc6:i386 libncurses5:i386 libstdc++6:i386 lib32z1 libbz2-1.0:i386"', function(error, stdout, stderr) {
        console.log(error, stderr, stdout);
        if (error) {
            return res.status(500).json({
                success: false,
                code: 500,
                message: 'Error while installing dependencies',
                result: error
            });
        }
        exec(`wget -P ${modulePath} ${url.android}`, function(error, stdout, stderr){
            if (error) {
                return res.status(500).json({
                    success: false,
                    code: 500,
                    message: 'Error while downloading android studio',
                    result: error
                });
            }
            exec(`gksudo "unzip ${modulePath}/android-studio-ide-183.5522156-linux.tar.gz /usr/local && chmod -R 777 /usr/local/android-studio"`, function(error, stdout, stderr){
                if (error) {
                    return res.status(500).json({
                        success: false,
                        code: 500,
                        message: 'Error while installing android studio',
                        result: error
                    });
                }
            })
        })
    });
})
.listen(3000, function(){
    console.log('your app listing to port 3000');
})