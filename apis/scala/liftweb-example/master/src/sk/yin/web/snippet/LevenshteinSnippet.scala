package sk.yin.web.snippet

import net.liftweb._
import http._
import js.JsCmds._
import util.Helpers._
import scala.xml.NodeSeq
import net.liftweb.http.SHtml
import sk.yin.algorithms.levenstein.Levenshtein
import scala.xml.Text
import scala.xml.Elem
//import scala.xml.

object LevenshteinSnippet {
  var str1 = "Danger"
  var str2 = "Angel"

  def form(xhtml : NodeSeq) = {
	  val (dist, distArray) = Levenshtein.computeMatrix(str2, str1)

	  bind("levenshtein", xhtml,
	      // TODO(yin): Find a way to get the id attribute into the template
	      "string1" -> SHtml.text(str1, str1 = _, "id" -> "str1"),
	      "string2" -> SHtml.text(str2, str2 = _, "id" -> "str2"),
	      "submit" -> SHtml.submit("Calculate difference", () => "hi"),
	      "result" -> Text(dist.toString),	
	      "table" -> makeTable(distArray)
	      )
  }

  def makeTable(distArray : Array[Array[Int]]) : Elem =
    <table class="levenshtein">
      <tbody>
        <tr>
  			<th></th>
  			<th></th>
  			{ str1 map { (c) => <th>{ c toString }</th> } }
  		</tr>
        {
          (distArray zip (' '+str2)) map { (row) =>
            <tr>
              <th>{ row._2 toString }</th>
              {
                row._1 map { (i) => <td>{ i }</td> }
              }
            </tr>
          }
        }
      </tbody>
    </table>
}
