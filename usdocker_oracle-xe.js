'use strict';

const usdocker = require('usdocker');
const path = require('path');
const fsutil = usdocker.fsutil();
const fs = require('fs');

const SCRIPTNAME = 'oracle-xe';

let config = usdocker.config(SCRIPTNAME);
let configGlobal = usdocker.configGlobal();
const CONTAINERNAME = SCRIPTNAME + configGlobal.get('container-suffix');

function getContainerDef() {

    let docker = usdocker.dockerRunWrapper(configGlobal);
    return docker
        .containerName(CONTAINERNAME)
        .port(config.get('port'), 1521)
        .port(config.get('apex'), 8080)
        .volume(config.get('folder'), '/u01/app/oracle')
        .volume(path.join(config.getUserDir('import')), '/docker-entrypoint-initdb.d')
        .env('TZ', configGlobal.get('timezone'))
        .env('IMPORT_FROM_VOLUME', config.get('allowImport'))
        .env('processes', config.get('processes'))
        .env('sessions', config.get('sessions'))
        .env('transactions', config.get('transactions'))
        .isDetached(true)
        .isRemove(true)
        .imageName(config.get('image'))
    ;
}

module.exports = {
    setup: function(callback)
    {
        config.setEmpty('image', 'sath89/oracle-xe-11g');
        config.setEmpty('folder', config.getDataDir());
        config.setEmpty('port', 1521);
        config.setEmpty('apex', 8080);
        config.setEmpty('processes', 500);
        config.setEmpty('sessions', 555);
        config.setEmpty('transactions', 610);
        config.setEmpty('password', 'oracle');
        config.setEmpty('allowImport', 'true');
        config.setEmpty('setPassword', 'true');

        fsutil.makeDirectory(path.join(config.getUserDir('import')));
        let sysPassFile = path.join(config.getUserDir('import'), 'sys_pass.sql');
        if (config.get('setPassword') !== 'false') {
            let genPass = [
                'alter user sys identified by ' + config.get('password') + ';',
                'alter user system identified by ' + config.get('password') + ';'
            ];
            fs.writeFileSync(sysPassFile, genPass.join('\n') + '\n');
        } else {
            if (fs.existsSync(sysPassFile)) {
                fs.unlinkSync(sysPassFile);
            }
        }
        
        //config.copyToUserDir(path.join(__dirname, 'oracle-xe', 'conf'));
        //config.copyToDataDir(path.join(__dirname, 'oracle-xe', 'data'));

        callback(null, 'setup loaded for ' + SCRIPTNAME);
    },

    debugcli(callback) {
        let result = usdocker.outputRaw('cli', getContainerDef());
        callback(result);
    },

    debugapi(callback) {
        let result = usdocker.outputRaw('api', getContainerDef());
        callback(result);
    },

    up: function(callback)
    {
        usdocker.up(CONTAINERNAME, getContainerDef(), callback);
    },

    status: function(callback) {
        usdocker.status(CONTAINERNAME, callback);
    },

    down: function(callback)
    {
        usdocker.down(CONTAINERNAME, callback);
    },

    restart: function(callback)
    {
        usdocker.restart(CONTAINERNAME, getContainerDef(), callback);
    },

    client: function(callback, extraArgs)
    {
        usdocker.exec(CONTAINERNAME, ['sqlplus'].concat(extraArgs), callback);
    },

    connect: function(callback, extraArgs)
    {
        usdocker.exec(CONTAINERNAME, ['bash'].concat(extraArgs), callback);
    },

};
