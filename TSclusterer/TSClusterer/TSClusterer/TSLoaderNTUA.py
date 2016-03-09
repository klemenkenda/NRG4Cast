import urllib.request
import json

# CONFIG
startdate = "2015-06-01"
enddate = "2015-07-01"

print("Getting all NTUA nodes ...")
nodesB = urllib.request.urlopen("http://demo3.nrg4cast.org/api/get-sensors").read()
n = json.loads(nodesB.decode("utf-8"))

sensors = []

for node in n:
    if 'ntua' in node['str'] and 'power' in node['str']:
        sensors.append(node['str'])

print(sensors)
exit

f = open("series.csv", "w")

for sensor in sensors:
    print("Getting measurements for: " + sensor)

    content = urllib.request.urlopen("http://demo3.nrg4cast.org/api/get-aggregates?p=" + sensor + ":ma:1h:" + startdate + ":" + enddate).read()
    j = json.loads(content.decode("utf-8"))

    i = 0
    for m in j:
        i = i + 1
        if i != 1: f.write(",")
        f.write(str(m['Val']))
    
    f.write("\n")


f.close()
