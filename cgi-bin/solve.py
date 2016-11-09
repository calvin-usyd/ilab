#!/usr/bin/python
print "Content-type: text/html\n\n";

import cgi
fs = cgi.FieldStorage();

import subprocess;
import sys, string, os, arcgisscripting
#!os.chdir( 'c:\\documents and settings\\flow_model' )
os.system("../data/"+fs['s'].value+".exe")

print "../data/"+fs['s'].value+".exe ../data/"+fs['u'].value+"/"+fs['p'].value;
p = subprocess.Popen("../data/"+fs['s'].value+".exe ../data/"+fs['u'].value+"/"+fs['p'].value, stdout=subprocess.PIPE, shell=True)
(output, err) = p.communicate()
print "Output:<br/>", output
