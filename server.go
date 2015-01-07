package main

import (
	"fmt"
	"log"
	"net/http"
	"io"
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

func (cube Cube3x3) String() string {
	return fmt.Sprintf("U:%v", cube.B)
}

func (face *Face) SetFace(c Color) {
	for x := 0; x < 3; x++ {
		for y := 0; y < 3; y++ {
			fmt.Println("Setting: %v,%v to %v", x, y, c);
			face[x][y] = c
		}
	}
}

func (face Face) String() string {
	var s = ""
	for x := 0; x < 3; x++ {
		for y := 0; y < 3; y++ {
			fmt.Println("Reading: %v,%v to %v", x, y, face[x][y]);
			s = s + string(face[x][y]) + " "  
		}
	}
	return s
}

func main() {
	var cube = new(Cube3x3)
	cube.Init()
	fmt.Println("Cube: ", cube)
	fmt.Println("Here we go.. starting server");
	http.Handle("/", http.FileServer(http.Dir("static")))
	http.HandleFunc("/tell", func(resp http.ResponseWriter, req *http.Request) {
		io.WriteString(resp, "I am telling you.")
	})
	log.Fatal(http.ListenAndServe(":8080", nil))
}

