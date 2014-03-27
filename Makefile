CC=gcc
CFLAGS=-c -Wall -std=gnu99
LDFLAGS=-lev
SOURCES=socket_reverse.c
OBJECTS=$(SOURCES:.c=.o)
EXECUTABLES=$(SOURCES:.c=)
# NOTE(yin): pkg-config is usable only if you have Xorg installed

all: $(SOURCES) $(EXECUTABLES)

$(EXECUTABLES): $(OBJECTS) 
	$(CC) $(OBJECTS) $(LDFLAGS) -o $@

.cpp.o:
	$(CC) $(CFLAGS) $< -o $@

clean:
	rm -f $(OBJECTS) $(EXECUTABLES) 

