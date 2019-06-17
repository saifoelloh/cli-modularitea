const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const appList = require('./list.json');
const os = require('os');
const drivelist = require('drivelist');

const app = express();
const modulePath = '~/.module';
const port = 3333;

app
.use(bodyParser.json())
.use('/api/web', async function(req, res) {
    await exec( `mkdir -p ${modulePath}`, { timeout: 120 * 1000 }, function(error) {
        if (error) {
            return res.status(500).json({
                success: false,
                code: 500,
                message: 'error while download source',
                result: error
            });
        }
        exec('pkexec apt-get install lamp-server^ -y', function(error){
            if (error) {
                return res.status(500).json({
                    success: false,
                    code: 404,
                    message: 'file not found',
                    result: error
                });
            }
            exec(`pkexec apt install phpmyadmin -y`, function(error, stdout, stderr){
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
                        stdout: stdout.replace(/\n/g, ''),
                        stderr: stderr.replace(/\n/g, ''),
                        error: error ? error.replace(/\n/g, '') : error,
                    }
                });
            })
        })
    });
})
.use('/api/multimedia', function(req, res){
    exec(`mkdir -p ${modulePath}`, function(error) {
        if (error) {
            return res.status(500).json({
                success: false,
                code: 500,
                message: 'Internal server error',
                result: error
            });
        }
        exec('pkexec apt install inkscape gimp blender -y', function(error, stdout, stderr) {
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
        })
    });
})
.use('/api/mobile', function(req, res){
    exec(`mkdir -p ${modulePath}`, function(error) {
        if (error) {
            return res.status(500).json({
                success: false,
                code: 500,
                message: 'Error while installing dependencies',
                result: error
            });
        }
    })
    exec('pkexec apt-get install libc6:i386 libncurses5:i386 libstdc++6:i386 lib32z1 libbz2-1.0:i386', function(error) {
        if (error) {
            return res.status(500).json({
                success: false,
                code: 500,
                message: 'Error while installing dependencies',
                result: error
            });
        }
        exec('pkexec apt-add-repository ppa:maarten-fonville/android-studio && apt update', function(error){
            if (error) {
                return res.status(500).json({
                    success: false,
                    code: 500,
                    message: 'Error while adding ppa to list',
                    result: error
                });
            }
            exec('pkexec apt install android-studio', function(error, stdout, stderr){
                if (error) {
                    return res.status(500).json({
                        success: false,
                        code: 500,
                        message: 'Error while installing android studio',
                        result: error
                    });
                }
                return res.status(200).json({
                        stdout: stdout.replace(/\n/g, ''),
                        stderr: stderr.replace(/\n/g, ''),
                        error: error ? error.replace(/\n/g, '') : error,
                });
            })
        })
    });
})
.use('/api/about', async function(req, res) {
    const list = await drivelist.list();
    const storage = Math.round(list[0].size / Math.pow(1024,3));
    const ram = Math.round(os.totalmem() / Math.pow(1024,3));
    res.status(200).json({
        hostname: os.hostname(),
        processor: os.cpus()[0].model,
        storage: storage,
        ram: ram,
    })
})
.listen(port, function(){
    console.log(`your app listing to port ${port}`);
})
