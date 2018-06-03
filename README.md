# groceries
Menu Organizer

Access groceries [here](http://learnnation.org:8243)!

This code is meant to collect recipes for various meals and allow convenient management of those recipes.


## set up mongo

The following is specific to the FUJI server unless otherwise stated.

Config file should be located at `/usr/local/etc/mongodb.conf` and should have contents:

    systemLog:
      destination: file
      path: /var/db/mongodb/mongod.log
      logAppend: false
    storage:
      dbPath: /var/db/mongodb
    net:
      bindIp: 127.0.0.1
      http:
        enabled: true

To start the daemon:

    sudo /usr/local/bin/mongod --logpath /var/db/mongodb/mongod.log --config /usr/local/etc/mongodb.conf --dbpath /var/db/mongodb

To kick off mongo daemon on *matt's macbook*:

    /usr/local/opt/mongodb/bin/mongod --config /usr/local/etc/mongod.conf

To restore the DB from an old backup:

    mongorestore mongo-dumps/guava-server.2018-05-25T21:38:54+00:00
    
or similar.


## install
Please refer to http://provemath.org/docs/install.html for directions on installing gulp and any dependencies.  That website is for PROVEMATH, but things should be similar for groceries.

To install python2 packages:

    sudo python2 -m pip install pymongo
    
and similar.


## build

On the server, gulp may throw an 'operation not permitted' error when you try to build.  This can be overrided with sudo:

    sudo gulp

For now I have no better solution.

## serve

    cd server-side
    python2 serve.py
    
