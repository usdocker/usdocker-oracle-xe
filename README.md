# Useful script for 'oracle-xe' service

This Useful Script creates a oracle-xe server based on a Docker Image.
You don't have know docker to use this solution.

## Installing

```bash
npm install -g usdocker-oracle-xe
```

## Start the oracle-xe service

```bash
usdocker oracle-xe up
```

## Stop the oracle-xe service

```bash
usdocker oracle-xe down
```

## Check the oracle-xe status

```bash
usdocker oracle-xe status
```

## Connecting to SQLPlus 

```bash
usdocker oracle-xe client -- [args]
```

Example:

```bash
usdocker oracle-xe client -- system/oracle@xe
```

## Connect to Bash

```bash
usdocker oracle-xe connect -- [args]
```


## Connect to your Oracle

```
hostname: localhost
port: 1521
sid: xe
username: system
password: oracle
```

## Connect to APEX

Connect to Oracle Application Express web management console with following settings:

```
http://localhost:8080/apex
workspace: INTERNAL
user: ADMIN
password: oracle
```

## Customize your service

You can setup the variables by using:

```bash
usdocker oracle-xe --set variable=value
```

Default values

 - image": "sath89/oracle-xe-11g",
 - folder": "$HOME/.usdocker/data/oracle-xe",
 - port": 1521,
 - apex": 8080,
 - processes": 500,
 - sessions": 555,
 - transactions": 610,
 - password": "oracle",
 - allowImport": "true",
 - setPassword": "true"    // only will work if allowImport: true also.

