package com.github.yin.angular.prototype;

import org.apache.catalina.Context;
import org.apache.catalina.startup.Tomcat;

import java.io.File;

public class Main {

    public static final int PORT = 8080;
    public static final String SRC_WEBAPP = "src/main/webapp/";

    public static void main(String[] args) throws Exception {
        Tomcat tomcat = new Tomcat();
        tomcat.setPort(PORT);

        Context ctx = tomcat.addWebapp("/", new File(SRC_WEBAPP).getAbsolutePath());
        System.out.println("Serving files from path: " + new File("./" + SRC_WEBAPP).getAbsolutePath());
        System.out.println(ctx.getServletContext().toString());

        tomcat.start();
        tomcat.getServer().await();
    }
}