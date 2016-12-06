CC=gcc
CFLAGS=-c -Wall -std=gnu99
LDFLAGS=-lev
SOURCES=socket_reverse.c socket_client.c
OBJECTS=$(SOURCES:.c=.o)
EXECUTABLES=$(SOURCES:.c=)
# NOTE(yin): pkg-config is usable only if you have Xorg installed

all: $(SOURCES) $(EXECUTABLES)

socket_reverse: $(OBJECTS) 
	$(CC) socket_reverse.o $(LDFLAGS) -o $@

socket_client: $(OBJECTS) 
	$(CC) socket_client.o $(LDFLAGS) -o $@

.cpp.o:
	$(CC) $(CFLAGS) $< -o $@

clean:
	rm -f $(OBJECTS) $(EXECUTABLES) 

