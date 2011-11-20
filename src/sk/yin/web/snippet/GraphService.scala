package sk.yin.web.snippet

import net.liftweb.http._
import net.liftweb.http.rest._
import net.liftweb.json.JsonAST.JString
import net.liftweb.json.JObject
import net.liftweb.json.JsonAST.JField

object GraphService extends RestHelper {
  
  serve {
    case Req("api" :: "json" :: _, _, _) =>
      JObject(JField("msg", JString("Hello world!")) :: Nil)
      
    // List
    case "api" :: "graphs" :: Nil JsonGet _ => JString("Hello world!")
    // Get (named)
//    case "api" :: "graphs" :: id :: _ JsonGet _ => JString("Hello world!")
    // Create (named)
    case "api" :: "graphs" :: id :: _ JsonPut _ => store(id)
    // (named)
    case "api" :: "graphs" :: "dijkstra" :: _ JsonGet _ => JString("Hello world!")
  }
  
  def store(name: String): JObject = {
    
  }
}