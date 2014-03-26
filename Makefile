CC=gcc
CFLAGS=-c -Wall
LDFLAGS=
SOURCES=socket_reverse.c
LIBS=ev
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

