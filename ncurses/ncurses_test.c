#include <stdlib.h>
#include <ncurses.h>

#define XMIN 1
#define XMAX 10
#define YMIN 1
#define YMAX 10
#define RAND_TRESHOLD (RAND_MAX / 2)

int main(int argc, char** argv) {
  initscr();
  //cbreak();
  //noecho();
  do {
    for(int x = XMIN; x < XMAX+1; x++) {
      for (int y = YMIN; y < YMAX+1; y++) {
        if (rand() > RAND_TRESHOLD)
          continue;
        int num = ((float)rand()) / RAND_MAX * 10;
        mvprintw(y * 2, x * 2, "%d", num);
      }
    }
    refresh();
  } while(((char)getchar()) != 'q');
  endwin();
}

