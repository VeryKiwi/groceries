# groceries
Menu Organizer

Access groceries [here](http://learnnation.org:8243)!

This code is meant to collect recipes for various meals and allow convenient management of those recipes.

## Developer: How to Run Locally:

To kick off mongo daemon on matt's macbook:

    /usr/local/opt/mongodb/bin/mongod --config /usr/local/etc/mongod.conf

To build:

On the server, gulp may throw an 'operation not permitted' error when you try to build.  This can be overrided with sudo:

    sudo gulp

For now I have no better solution.

