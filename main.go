package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"
)

type Config struct {
	addr string
	ui string
	browser string
}

func Args(args []string) Config {
	var ret = Config { addr: "localhost:8080", ui: "static" }
	var opt string
	var arg string
	var l = len(args)
	for i := 1; i < l; i++ {
		opt = os.Args[i]
		if i < l-1 {
			arg = os.Args[i+1]
			if opt == "-b" {
				ret.browser = arg
				i++
			} else if opt == "-a" {
				ret.addr = arg
				i++
			} else if opt == "-ui" {
				ret.ui = arg
				i++;
			}
		}
	}
	return ret
}

func Serve(addr string, ui string, handler http.Handler, srv chan(error)) {
	// http.HandleFunc("/tell", func(resp http.ResponseWriter, req *http.Request) {
	// 	io.WriteString(resp, "I am telling you.")
	// })
	http.Handle("/set", handler)
	http.Handle("/", http.FileServer(http.Dir(ui)))
	err := http.ListenAndServe(addr, nil)
	if err != nil {
		srv <- err
	}
	close(srv)
}

func RunUI(browser string, addr string) {
	fmt.Println("Running browser: ", browser, addr)
	err := exec.Command(browser, addr).Start()
	log.Fatal(err)
}

func main() {
	var conf = Args(os.Args)
	var cube = new(Cube3x3)
	var handler = CubeHandler { cube: cube }
	cube.Init()
	log.Println("Cube: ", cube)

	var srv chan(error)
	log.Println("Starting server...");
	go Serve(conf.addr, conf.ui, handler, srv)

	if conf.browser != "" {
		log.Println("Running browser...");
		go RunUI(conf.browser, conf.addr)
	}
	select {
	case err := <-srv:
		log.Fatal("Server terminated: ", err)
	}
}

