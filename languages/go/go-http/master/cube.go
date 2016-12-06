package main

import (
	"fmt"
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
