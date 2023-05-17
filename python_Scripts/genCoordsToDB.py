from urllib.request import Request, urlopen
import googlemaps
import xmltodict
import json
from supabase import create_client, Client

url: str = "https://pxnygwevxcopvxpdeaxg.supabase.co"
key: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4bnlnd2V2eGNvcHZ4cGRlYXhnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY3NDg3MTM4OCwiZXhwIjoxOTkwNDQ3Mzg4fQ.d-blaf4yf3aYGlOCFJ1hWPgaPbSJ1YK31_dN-OVSIm0"
supabase: Client = create_client(url, key)

gmaps = googlemaps.Client(key='AIzaSyAaLVvD99DfxJn_vnFkBWoRGyFFU6Ww4E8')

notSatisfied = True
while notSatisfied:
    req = Request(
        url='http://api.3geonames.org/?randomland=yes', 
        headers={'User-Agent': 'Mozilla/5.0'}
    )
    data = urlopen(req).read()
    try:    
        data = xmltodict.parse(data)
        #print(data['geodata']['nearest']['latt'],data['geodata']['nearest']['longt'])
        if (data['geodata']['nearest']['latt'] is not None):
            apiRequestString = "https://maps.googleapis.com/maps/api/streetview/metadata?key=AIzaSyAaLVvD99DfxJn_vnFkBWoRGyFFU6Ww4E8&location="+data['geodata']['nearest']['latt']+","+data['geodata']['nearest']['longt']
            req = Request(
                url=apiRequestString, 
                headers={'User-Agent': 'Mozilla/5.0'}
            )
            data2 = urlopen(req).read()
            json_data = json.loads(data2)
            if(json_data['status'] == 'OK'):
                print(json_data['location']['lat'],json_data['location']['lng'])
                dataToInsert = supabase.table("acceptedLocs").insert({"lat":json_data['location']['lat'],"lng":json_data['location']['lng']}).execute()
                assert len(dataToInsert.data) > 0
    except:
        print("Unsupported Data types!")