'use strict';
var SSH = require('simple-ssh');
console.log('Loading function');

const aws = require('aws-sdk');

const s3 = new aws.S3({ apiVersion: '2006-03-01' });


exports.handler = (event, context, callback) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));

    // Get the object from the event and show its content type
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const params = {
        Bucket: bucket,
        Key: key,
    };
    //ec2-52-37-23-200.us-west-2.compute.amazonaws.com
    var ssh = new SSH({
        host: 'host',
        user: 'ubuntu',
        key: fs.readFileSync("youtrpoject.pem")
    });

    /* -- execute SSH command -- */
    ssh.exec('sudo su').exec('ls -al', {
        out: function(stdout) {
            console.log('privilegios');
            console.log(stdout);
        }
    }).exec('cd /var/www/html/').exec('ls -al', {
        out: function(stdout) {
            console.log('change directory');
            console.log(stdout);
        }
    }).exec('aws s3 sync --delete s3://code-qeestudiar /var/www/html/').exec('ls -al', {
        out: function(stdout) {
            console.log('dolowad code from s3');
            console.log(stdout);
        }
    }).exec('composer update').exec('ls -al', {
        out: function(stdout) {
            console.log('updating dependecy');
            console.log(stdout);
        }
    }).exec('cp .env.dist .env').exec('ls -al', {
        out: function(stdout) {
            console.log('copping config env');
            console.log(stdout);
        },
        exit: function(code, stdout, stderr) {
            console.log('operation exited with code: ' + code);
            console.log('STDOUT from EC2:\n' + stdout);
            console.log('STDERR from EC2:\n' + stderr);
            context.succeed('Success!');
        }
    }).start();
    //cp .env.dist .env
    // s3.getObject(params, (err, data) => {
    //     if (err) {
    //         console.log(err);
    //         const message = `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
    //         console.log(message);
    //         callback(message);
    //     } else {
    //         console.log('CONTENT TYPE:', data.name);
    //         callback(null, data.ContentType);
    //     }
    // });
};