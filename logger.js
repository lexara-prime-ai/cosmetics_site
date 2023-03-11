const log = console.log;
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const { v4:uuid } = require('uuid');
const { format } = require('date-fns');
const logger = async (message, file_name) => {
    let date = format(new Date(), 'yyyMMdd\tHH:mm:ss');
    let log_item = `${date}\t${uuid()}\t${message}\n`
    let dir_path = path.join(__dirname, 'logs');
    let file_path = path.join(__dirname, 'logs', file_name);
    log(log_item);
    file_path += '.log';
    try {
        if (!fs.existsSync(dir_path)) {
            await fsPromises.mkdir(dir_path);
            await fsPromises.appendFile(file_path, log_item);
        } else {
            await fsPromises.appendFile(file_path, log_item);
        }
    } catch(err) {
        console.error(`${err.name}\t${err.message}`);
    }
}
module.exports = logger;