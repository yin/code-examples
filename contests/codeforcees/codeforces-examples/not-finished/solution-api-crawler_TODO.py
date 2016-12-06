#!/usr/bin/env python

# Requires
# ========
#
# - System packages: libxml2-dev, libxslt-dev
# - Python packages: mechanize, lxml, cssselect

from sys import argv
import shelve
import json

import mechanize
import urllib2
import lxml.html# import etree

class Crawler:
    API_SUBMISSIONS_URL = 'http://codeforces.com/api/contest.status'
    CACHE_PATH = '.cache'
    SLICE_SIZE = 100
    def __init__(self, contest, problem):
        self.submissions_url = self.API_SUBMISSIONS_URL
        self.contest = contest
        self.problem = problem
        self.cache_path = self.CACHE_PATH
        self.initialize()

    def initialize(self):
        self.a = mechanize.Browser()
        self.a.set_handle_robots(False)
        self.a.set_handle_refresh(False)
        self.cache = shelve.open(self.cache_path);

    def crawl_solutions(self, count=100, start=0):
        for i in range(0, count/self.SLICE_SIZE):
            start = i * self.SLICE_SIZE + 1
            end = start + self.SLICE_SIZE
            found = self.crawl_slice(start, end)
            if found != None:
                for f in found:
                    yield f

    def crawl_slice(self, start, end):
        url = self.submissions_url.format(self.contest)
        content = self.fetch_submitions(url)
        data = json.loads(content)
        for sub in data:
            if sub['problem']['index'] == self.problem:
                
        doc = lxml.html.document_fromstring(content)#.getroottree().getroot()
        print dir(doc)
        solutions = doc.cssselect('.status-frame-datatable')
        matches = []
        for sol in solutions:
            solution_names = sol.xpath('//tr[td[position()=3]]');
            for solrow in solution_names:
                if self.check_tr(solrow):
                    matches += solrow
        for tr in matches:
            solution = self.create_solution(solrow.getchildren())
            solution['source'] = self.get_source(solution)
            yield solution

    def get_source(self, solution):
        sid = solution['id']
        content = self.fetch_submission(self.submission_url, sid)
        return data.source

    @staticmethod
    def create_solution(tds):
        print tds[0].text.strip()
        return {
            'id': tds[0].text.strip(),
            'timestamp': tds[1].text_content().strip(),
            'author': tds[2].text_content().strip(),
            'problem': tds[3].text_content().strip(),
            'lang': tds[4].text_content().strip(),
            'status': tds[5].text_content().strip(),
            'time': tds[6].text_content().strip(),
            'memory': tds[7].text_content().strip(),
        }

    def check_tr(self, tr):
        tds = tr.getchildren()
        td_name = tds[3].text_content()
        td_status = tds[5].text_content()
        return td_name.find(self.search_term) >= 0 \
            and td_status.find(self.ACCEPTED)

    def fetch_listing(self, url):
        try:
            # TODO yin: use hashkeys
            info("Cache lookup for {0}".format(url))
            src = self.cache[url]
        except KeyError:
            info("Hitting server for {0}".format(url))
            resp = self.a.open(url)
            src = resp.get_data()
            self.cache[url] = src
            self.cache.sync()
        return src
        
    def fetch_submission(self, url, params):
        try:
            # TODO yin: use hashkeys
            info("Cache lookup for {0}".format(url))
            src = self.cache[url+'@'+str(params)]
        except KeyError:
            info("Hitting server for {0}@{1}".format(url, params))
            headers = {"Content-type": "application/json"}
            req = urllib2.Request(url, params, headers)
            resp = self.a.open(req)
            src = resp.get_data()
            self.cache[url] = src
            self.cache.sync()
        return src

def info(str):
    print str

if __name__ == '__main__':
    if len(argv) < 2 or len(argv[1]) != 4:
        print "solution-crawlet.py <problem>"
        print "<problem is in the format XXXY, X = [0-9], Y = [A-E]"
        exit(1)
    solutions = Crawler(argv[0][:3], argv[0:4]).crawl_solutions(range(0, 1000))
    if solutions != None:
        for f in solutions:
            print f
