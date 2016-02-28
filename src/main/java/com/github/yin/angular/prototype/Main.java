package com.github.yin.angular.prototype;

import java.io.File;

import org.apache.catalina.WebResourceRoot;
import org.apache.catalina.core.StandardContext;
import org.apache.catalina.startup.Tomcat;
import org.apache.catalina.webresources.DirResourceSet;
import org.apache.catalina.webresources.StandardRoot;

public class Main {

    public static final int PORT = 8080;
    public static final String SRC_WEBAPP = "src/main/webapp/";

    public static void main(String[] args) throws Exception {
        Tomcat tomcat = new Tomcat();
        tomcat.setPort(PORT);

        StandardContext ctx = (StandardContext) tomcat.addWebapp("/", new File(SRC_WEBAPP).getAbsolutePath());
        System.out.println("Serving files from path: " + new File("./" + SRC_WEBAPP).getAbsolutePath());

        // Declare an alternative location for your "WEB-INF/classes" dir
        // Servlet 3.0 annotation will work
        File additionWebInfClasses = new File("target/classes");
        WebResourceRoot resources = new StandardRoot(ctx);
        resources.addPreResources(new DirResourceSet(resources, "/WEB-INF/classes",
                additionWebInfClasses.getAbsolutePath(), "/"));
        ctx.setResources(resources);

        tomcat.start();
        tomcat.getServer().await();
    }
}