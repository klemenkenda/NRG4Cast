import json
import http.client

# SELECT * FROM auction_de WHERE price_type = 'spot' AND auction_type = 'Physical' AND period = 'Profile'

# NOTE: Naredi HTTP GET zahtevek, pri cemer je reqStr oblike "?data=..."
def post(reqStr):
	request = "/enstream/add-measurement"+reqStr
	request = request.replace(" ", "%20")
	print("Waiting for connection ...")
	conn = http.client.HTTPConnection("localhost:9889")
	print("Executing GET")
	conn.request(method="GET", url=request)
	print("Getting response ...")
	r = conn.getresponse()
	print("Got response")
	print(r.status)
	print(r.reason)
	print(r.read())

# NOTE: Sestavi eno meritev za senzor s ceno 
def p_measurement(val, ts):
	crr = {"sensorid": "Electricity-Price", "value": val, "timestamp": ts, "type": {"id": "Electricity-Price", "name": "Price", "phenomenon": "price", "UoM": "EUR" }}
	return crr # json.dumps(crr)

# NOTE: Sestavi eno meritev za senzor s kolicino 
def q_measurement(quant, ts):
	crr = {"sensorid": "Electricity-Quantity", "value": quant, "timestamp": ts, "type": {"id": "Electricity-Quantity", "name": "Quantity", "phenomenon": "quantity", "UoM": "MW" }}
	return crr # json.dumps(crr)

# NOTE: Vstopna tocka 
if __name__ == '__main__':
	node = { "id" : "1", "name" : "ElectricityVirtual", "subjectid" : "Building1", "lat" : 52.0, "lng" : 10.0 } # NOTE: rahlo spremenjeno
	# load the data 
	data = json.loads(open("auction_de.json", 'r').read())
	rec_n = 1
	for record in data:
		ts = record["trading"]
		measurements = []
		for i in range(24):
			crr_price = float(record["p"+str(i+1).zfill(2)])
			crr_quant = float(record["q"+str(i+1).zfill(2)])
			crr_ts = ts+"T"+str(i).zfill(2)+":00:00.000"
			print(crr_ts)
			measurements.append(p_measurement(crr_price, crr_ts))
			measurements.append(q_measurement(crr_quant, crr_ts))
			if i % 1 == 0:
				node["measurements"] = measurements
				# get ready to send the data 
				crr_dat = json.dumps([{"node": node}])
				# print crr_dat # NOTE: Tukaj vidis kaksen JSON je sestavila skripta 
				post("?data="+crr_dat)
				print("Sent", rec_n, "th record")
				rec_n = rec_n+1
				measurements = []
	print("Done")
	