import urllib.request
import urllib.error
import json

req = urllib.request.Request(
    'http://127.0.0.1:8000/api/predict',
    data=json.dumps({'gene':'BRAF', 'mutation':'V600E'}).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)

try:
    urllib.request.urlopen(req)
except urllib.error.HTTPError as e:
    print(e.read().decode('utf-8'))
