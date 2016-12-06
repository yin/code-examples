libev-examples
============

Examples of using the Event-processing framework libev. 

Building under Ubuntu 12.04+
============================

You need to install package libev-dev. Additionally you need make and gcc.

    sudo apt-get install libev-dev make gcc

In project root:

    make

You should have executables `socket_reverse` and `socket-client` 

Usage
=====

Terminal 1:

    ./socket_reverse

![Server will listen](https://raw.github.com/yin/libev-examples/master/docs/images/screenshot-libev-sockets-server.png)

Terminal 2:

    echo -n 'Hello world!' | ./socket_client

![Response: !dlrow olleH](https://raw.github.com/yin/libev-examples/master/docs/images/screenshot-libev-sockets-client.png)
