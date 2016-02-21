package main

import (
	"errors"
	"flag"
	"fmt"
	"strings"
	"time"
)

type color int

const (
	Red color = iota
	Green
	Blue
)

type ColorWheel struct {
	Available bool
	Color     color
}

func main() {
	var num = flag.Int("num", -1, "An integer number passed to the program")
	var bool = flag.Bool("force", false, "Force all operation, even if it means beaking the laws of physics")
	var name = flag.String("name", "", "A name or something textual")
	var delay = flag.Duration("delay", 0*time.Second, "How long to wait before destroying the Earth")
	var color = ColorWheel{Available: false}
	flag.Var(&color, "color", "One of those base colors a usual human eye can see...")

	flag.Parse()

	fmt.Printf("In %d seconds the operation will be force=%t %d times on %s until he's %s\n", *delay, *bool, *num, *name, color.String())
}

func (r ColorWheel) String() string {
	if r.Available {
		switch r.Color {
		case Red:
			return "red"
		case Green:
			return "green"
		case Blue:
			return "blue"
		}
	}
	return "N/A"
}

// WATCH-OUT: This needs to be a pointer receiver
func (r *ColorWheel) Set(Val string) error {
	r.Available = true
	fmt.Println(Val)
	switch strings.ToLower(Val) {
	case "red":
		r.Color = Red
	case "reen":
		r.Color = Green
	case "blue":
		r.Color = Blue
	default:
		r.Available = false
		return errors.New("Possible choives are red, green and blue, none of them mtch input")
	}
	return nil
}
