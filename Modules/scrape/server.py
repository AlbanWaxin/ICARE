from flask import Flask, request
from Sites.manhuascan import ManhuaScan
from Sites.fstkissmanga import Fstkissmanga
import json


#All sites that can provide information and scrape
manhuascan = ManhuaScan()
fstkissmanga = Fstkissmanga() 

app = Flask(__name__)

def check_origin(request):
    return request.remote_addr != '127.0.0.1'

def routing_to_site(url):
    
    if url.startswith('https://manhuascan.io/') or url.startswith('https://kaliscan.io') or url.startswith('https://manhuascan.net/'):
        return manhuascan
    if url.startswith('https://1st-kissmanga.net/'):
        return fstkissmanga
    return None

@app.route('/update', methods=['GET'])
def update():
    if check_origin(request):
        return 'You are not allowed to contact me',403
    else:
        code = manhuascan.update()
        print(code[1])
        if (code[1]//2000 != 1 and code[1]%2000>=1000): return str(code[1]), 400
        code2 = fstkissmanga.update()
        print(code2[1])
        return code[0] + code2[0],200

@app.route('/get_all', methods=['GET'])
def get_all():
    if check_origin(request):
        return 'You are not allowed to contact me',403
    else:
        return manhuascan.get_webtoon_list() + fstkissmanga.get_webtoon_list(),200
    
@app.route('/get_all_r', methods=['GET'])
def get_all_r():
    if check_origin(request):
        return 'You are not allowed to contact me',403
    else:
        return manhuascan.get_r_webtoon_list(),200

@app.route('/get_some', methods=['GET'])
def get_some():
    if check_origin(request):
        return 'You are not allowed to contact me',403
    else:
        params = request.args
        webtoons = []
        for url in params:
            site = routing_to_site(url)
            if site == None: return 'Site not supported', 400
            webtoon = site.get_webtoon(url)
            webtoons.append(webtoon)
        return webtoons,200

@app.route('/get_some_r', methods=['GET'])
def get_some_r():
    if check_origin(request):
        return 'You are not allowed to contact me',403
    else:
        params = request.args
        webtoons = []
        for url in params:
            site = routing_to_site(url)
            if site == None: return 'Site not supported', 400
            webtoon = site.get_webtoon(url)
            webtoons.append(webtoon)
        return webtoons,200            
        
@app.route('/add_webtoon', methods=['POST'])
def add_webtoon():
    if check_origin(request):
        return 'You are not allowed to contact me',403
    else:
        if len(request.data) == 0: return 'No data', 400
        url = json.loads(request.data.decode("utf-8"))[0]['url']
        if url == None: return 'No url', 400
        site = routing_to_site(url)
        if site == None: return 'Site not supported', 400
        code = site.add_webtoon(url)
        if (code//2000 != 1 and code%2000 < 1000) : return str(code), 400
        return 'Added',200

@app.route('/add_webtoons', methods=['POST'])
def add_webtoons():
    if check_origin(request):
        return 'You are not allowed to contact me',403
    else:
        if len(request.data) == 0: return 'No data', 400
        url_list = json.loads(request.data.decode("utf-8"))['url_list']
        print(url_list)
        if url_list == None: return 'No url', 400
        results = [2001] * len(url_list)
        for url in url_list:
            site = routing_to_site(url)
            if site == None: 
                results[url_list.index(url)] = (url,4101)
                continue
            code = site.add_webtoon(url)
            results[url_list.index(url)] = (url,code)
            (code), 400
        print(results)
        return str(results), 200



@app.route('/add_r_webtoon', methods=['POST'])
def add_r_webtoon():
    if check_origin(request):
        return 'You are not allowed to contact me',403
    else:
        print(len(request.data))
        if len(request.data) == 0: return 'No data', 400
        url = json.loads(request.data.decode("utf-8"))['url']
        if url == None: return 'No url', 400
        site = routing_to_site(url)
        code = site.add_r_webtoon(url)
        if code != 2001: return str(code), 400
        return 'Added',200
    


if __name__ == '__main__':
    app.run(host='0.0.0.0' ,port=5000)
