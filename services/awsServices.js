const AWS = require('aws-sdk');

class AWSService {

    constructor() {

        this.s3 = new AWS.S3({

            accessKeyId: process.env.AWS_ACCESS_KEY_ID,

            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,

            region: process.env.AWS_REGION,

        });

    }

    async uploadToS3(BUCKETName, key, data) {
        
        const params = {

            Bucket: BUCKETName,

            Key: key,

            Body: data,

            ACL: `public-read`

        };

        return new Promise((resolve, reject) => {

            this.s3.upload(params, (err, result) => {

                if (err) {
                    console.log("Error in uploading to aws:", err);
                    return reject(err);

                }
                resolve(result.Location);
                console.log('Data uploaded successfully:', result);
            });

        });

    }

}

module.exports = new AWSService();