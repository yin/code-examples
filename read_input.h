#ifndef _READ_INPUT_H_
#define _READ_INPUT_H_

void on_line_read(char *line, void *payload);
void read_all_input_lines(void (*callback)(char*, void*), void *payload);
char* read_input_line();
char* read_input();
char* ensure_capacity(char *buffer, size_t len, size_t *alloc);

#endif
