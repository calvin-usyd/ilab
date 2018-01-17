#!/usr/bin/python
print "Content-type: text/html\n\n";

import cgi
fs = cgi.FieldStorage();

import subprocess;

p = subprocess.Popen("../data/patrus.exe ../data/"+fs['u'].value+"/"+fs['p'].value, stdout=subprocess.PIPE, shell=True)
(output, err) = p.communicate()
print "Output:<br/>", output
