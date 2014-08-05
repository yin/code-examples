liftweb-example
===============

My Apps Engine site written in Scala and Liftweb framework.

I used to work fine, when I first uploaded the code to Apps Engine.
But unfortunetly, I run into problem with Apps Engine refusing to update to my second version
of the liftweb example. The update was supposed to contain demo of my Scala implementation of
Dijkstra's shortest-path algorithm. You can find a working example of this algorithm
implemented in Dart here:
[https://github.com/yin/dart-examples/tree/master/web/dijkstra]

Yet there is another problem. I can not reproduce it always, but when I lately navigated to
[http://yinotaurus.appspot.com/levenstein], the stupid server engine kept reseting my input
to the defaults - 'Angel' and 'Danger'. It does it at random, sometimes it takes my input,
sometimes it resets it.

I am not going through the process of setting up a full-blown Scala IDE again, because I
don't need it. Anyway, liftweb is so slow to start-up that it's just horrible combination
with App Engine anyway. Especially for such low frequency sites as this deprecated example is.
