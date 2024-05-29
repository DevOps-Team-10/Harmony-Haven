const bodyParser = require('body-parser');

class APIReponse {

    constructor(statusCode,message,data={}){
        this.statusCode=statusCode
        this.message=message
        this.success=statusCode<400
        this.data=data
    }

}

module.exports = APIReponse;