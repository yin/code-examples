package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"
)

type Color int
type Face [3][3]Color

const (
	White Color = iota
	Yellow
	Blue
	Green
	Red
	Orange
)

type Cube3x3 struct {
	U Face
	D Face
	F Face
	B Face
	L Face
	R Face
}	

func (cube *Cube3x3) Init() {
	cube.U.SetFace(White)
	cube.D.SetFace(Yellow)
	cube.F.SetFace(Blue)
	cube.B.SetFace(Green)
	cube.L.SetFace(Red)
	cube.R.SetFace(Orange)
}

func (cube Cube3x3) Faces() map[string]Face {
	return map[string]Face { "U": cube.U, "D": cube.D, "F": cube.F, "B": cube.B,  "R": cube.R, "L": cube.L }
}

func (cube Cube3x3) String() string {
	var s = ""
	for name, face := range cube.Faces() {
		face = face
		s = fmt.Sprintf("%v %v:%v", s, name, face)
	}
	return s
}

func (face *Face) SetFace(c Color) {
	for x := 0; x < 3; x++ {
		for y := 0; y < 3; y++ {
			face[x][y] = c
		}
	}
}

func (face Face) String() string {
	var s = ""
	for x := 0; x < 3; x++ {
		for y := 0; y < 3; y++ {
			s = fmt.Sprintf("%v %v", s, face[x][y])
		}
	}
	return s
}

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

func Serve(addr string, ui string, srv chan(error)) {
	// http.HandleFunc("/tell", func(resp http.ResponseWriter, req *http.Request) {
	// 	io.WriteString(resp, "I am telling you.")
	// })
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
	cube.Init()
	log.Println("Cube: ", cube)

	var srv chan(error)
	log.Println("Starting server...");
	go Serve(conf.addr, conf.ui, srv)

	if conf.browser != "" {
		log.Println("Running browser...");
		go RunUI(conf.browser, conf.addr)
	}
	select {
	case err := <-srv:
		log.Fatal("Server terminated: ", err)
	}
}

