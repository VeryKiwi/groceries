# groceries
Menu Organizer.  Access [here](http://learnnation.org:8243)!

![](banner-black.png)

This code is meant to collect recipes for various meals and allow convenient management of those recipes.



## quick notes
- Groceries server and MongoDB are both on the FUJI server (159.89.229.227).
- learnnation.org is the FUJI server.
- If you get error `Permission denied (publickey)`, you may need to manually run `ssh-add ~/.ssh/fuji_groceries` because changes not propogated to extant tabs, or ask Matt.
- So I used iloveimg to compress the jpgs (did better than the elephant site) and then I used cloudconvert to convert to webp, getting even smaller results.
- jpg compression: https://www.iloveimg.com/compress-image/compress-jpg
- jpg to webp conversion: https://cloudconvert.com/jpg-to-webp


## set up mongo

First install MongoDB.  For me, the output of `mongod --version` is **db version v3.0.4**.

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

    mongorestore mongo-dumps/fuji-server.2024-08-31T12:26:08-04:00

or similar.



## install

Since we are using NodeJS, I recommend installing `nvm`.  Then install and enable node v11.15.0.  The output of `nvm which current` is **/path/to/.nvm/versions/node/v11.15.0/bin/node**.

Then use `npm` to install gulp.  The output of `gulp --version` contains **Local version: 3.9.1**.

Please refer to http://provemath.org/docs/install.html for directions on installing gulp and any dependencies.  That website is for PROVEMATH, but things should be similar for groceries.

For our python backend, the output of `python --version` is **Python 2.7.12**.

To install python2 deps, use `pip install -r requirements.txt`, since we have the version info there.



## build the frontend

For the frontend you need to run a build process to create an updated `client-side-built` directory from the `client-side` source directory:

Make sure you are using the correct version of `node` and `gulp` (see above) before running the build:

    gulp

On the server, gulp may throw an "`operation not permitted`" error when you try to build.  This can be overrided with sudo:

    sudo gulp

The last action in the default gulp actions is a `watch` action.  If you don't want it in prod, just ctrl-C out of it after everything is built.



## serve

This serves BOTH the front-end HTML/JS/CSS stuff as well as the backend Python stuff.

    cd server-side
    python2 serve.py

Then you can visit the site at http://localhost:8243/index.html



