package com.github.yin.angular.prototype;

import org.apache.catalina.WebResourceRoot;
import org.apache.catalina.Wrapper;
import org.apache.catalina.core.StandardContext;
import org.apache.catalina.startup.ContextConfig;
import org.apache.catalina.startup.Tomcat;
import org.apache.catalina.webresources.DirResourceSet;
import org.apache.catalina.webresources.StandardRoot;

import java.io.File;

public class MinimalTomcatMain {
    private static final boolean USE_DEFAULT_WEBAPP_CONFIG = false;
    private static final boolean USE_JAR_SCANNING = true;
    private static final boolean SERVE_FILES = true;
    private static final boolean USE_INDEX_HTML = true;
    private static final boolean USE_INDEX_HTM = false;
    private static final boolean SERVE_JSPS = false;
    private static final boolean USE_INDEX_JSP = false;
    private static final boolean USE_DEFAULT_MIMETYPES = true;
    private static final boolean ENABLE_JSON_REST = true;

    public static final int PORT = 8080;
    public static final String SRC_WEBAPP = "src/main/webapp/";
    public static final int SESSION_TIMEOUT = 30;
    private static final boolean ENABLE_REST_API = true;
    private static final boolean ENABLE_SOAP_API = true;

    public static void main(String[] args) throws Exception {
        Tomcat tomcat = new Tomcat();
        tomcat.setPort(PORT);
        StandardContext ctx =
                (StandardContext) tomcat.addContext("/", new File(SRC_WEBAPP).getAbsolutePath());
        System.out.println("Webapp document base: " + new File("./" + SRC_WEBAPP).getAbsolutePath());

        setupWebapp(tomcat, ctx);
        setupCustom(ctx);
        setupResources(ctx);
        tomcat.start();
        tomcat.getServer().await();
    }

    private static void setupCustom(StandardContext ctx) {
        if (ENABLE_REST_API) {
            Wrapper restServlet = ctx.createWrapper();
            restServlet.setName("rest");
            restServlet.setServletClass(com.sun.jersey.spi.container.servlet.ServletContainer.class.getCanonicalName());
            restServlet.addInitParameter("com.sun.jersey.config.property.packages", "com.github.yin.angular.prototype");
            if (ENABLE_JSON_REST) restServlet.addInitParameter("com.sun.jersey.api.json.POJOMappingFeature", "true");
            restServlet.setLoadOnStartup(2);
            ctx.addChild(restServlet);
            ctx.addServletMapping("/rest/*", "rest");
        }
    }

    private static void setupWebapp(Tomcat tomcat, StandardContext ctx) {
        if (USE_DEFAULT_WEBAPP_CONFIG) {
            ctx.addLifecycleListener(new Tomcat.DefaultWebXmlListener());
        } else {
            ctx.setSessionTimeout(SESSION_TIMEOUT);

            if (USE_JAR_SCANNING) {
                ContextConfig ctxCfg = new ContextConfig();
                ctx.addLifecycleListener(ctxCfg);
                // prevent it from looking ( if it finds one - it'll have dup error )
                ctxCfg.setDefaultWebXml(tomcat.noDefaultWebXmlPath());
            }
            if (SERVE_FILES) {
                Wrapper defaultServlet = ctx.createWrapper();
                defaultServlet.setName("default");
                defaultServlet.setServletClass("org.apache.catalina.servlets.DefaultServlet");
                defaultServlet.setLoadOnStartup(1);
                defaultServlet.setOverridable(true);
                ctx.addChild(defaultServlet);
                ctx.addServletMapping("/", "default");
                if (USE_INDEX_HTML) ctx.addWelcomeFile("index.html");
                if (USE_INDEX_HTM) ctx.addWelcomeFile("index.htm");
            }
            if (SERVE_JSPS) {
                Wrapper jspServlet = ctx.createWrapper();
                jspServlet.addInitParameter("fork", "false");
                jspServlet.setLoadOnStartup(4);
                jspServlet.setOverridable(true);
                ctx.addServletMapping("*.jsp", "jsp");
                ctx.addServletMapping("*.jspx", "jsp");
                if (USE_INDEX_JSP) ctx.addWelcomeFile("index.jsp");
            }
            if (USE_DEFAULT_MIMETYPES) {
                for (int i = 0; i < Constants.DEFAULT_MIME_MAPPINGS.length; ) {
                    ctx.addMimeMapping(Constants.DEFAULT_MIME_MAPPINGS[i++], Constants.DEFAULT_MIME_MAPPINGS[i++]);
                }
            }
        }
    }

    private static void setupResources(StandardContext ctx) {
        // Declare an alternative location for your "WEB-INF/classes" dir
        // HelloServlet 3.0 annotation will work
        File additionWebInfClasses = new File("target/classes");
        WebResourceRoot resources = new StandardRoot(ctx);
        resources.addPreResources(new DirResourceSet(resources, "/WEB-INF/classes",
                additionWebInfClasses.getAbsolutePath(), "/"));
        ctx.setResources(resources);
    }
}