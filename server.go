package main

import (
	"log"
	"net/http"
)

type CubeHandler struct {
	cube *Cube3x3
}

func (h CubeHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	var c Color
	req.ParseForm()
	log.Println(req.Form)
	if req.Form["c"][0] == "white" {
		c = White
	} else {
		c = Yellow
	}
	h.cube.U[0][0] = c
	log.Println(h.cube)
}
