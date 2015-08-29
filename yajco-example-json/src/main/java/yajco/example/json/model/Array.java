package yajco.example.json.model;

import yajco.annotation.After;
import yajco.annotation.Before;
import yajco.annotation.Separator;

import java.util.List;

public class Array extends Node {
    private List<Node> nodes;


    @Before("ZACPOLE")
    @After("KONPOLE")
    public Array() {

        System.out.println("Zaciatok pola");
        System.out.println("Koniec pola_________prazdne");

    }

    @Before("ZACPOLE")
    @After("KONPOLE")
    public Array(@Separator(",") List<Node> node) {
        nodes = node;
        System.out.println("Zaciatok pola");
        System.out.println("Koniec pola");

    }


}
