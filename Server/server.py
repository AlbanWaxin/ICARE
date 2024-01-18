from flask import Flask, request, redirect
import requests
import json
from datetime import datetime, timedelta

app = Flask(__name__)

scrape = "5000"
storage = "5100"
riot = "5200"
local = "http://127.0.0.1:"

def isinnactive(date):
    input_date = datetime.strptime(date, "%d/%m/%Y")
    now = datetime.now()
    timedelta = now - input_date
    if timedelta.days > 30:
        return True
    else:
        return False


@app.route('/mas', methods=['GET'])
def mas():
    params = request.args
    user_mas = requests.get(local + storage + "/mas", params=params)
    user_mas_json = json.loads(user_mas.text)
    webtoons = requests.get(local + scrape + "/get_all")
    webtoons_json = json.loads(webtoons.text)
    #double comparaison de json (si une url de user_mas_json apparait dans webtoon_json l'ajouter a une liste)
    converged = []
    for webtoon in user_mas_json:
        for scraped_webtoon in webtoons_json:
            if webtoon['url'] == scraped_webtoon['url']:
                if webtoon['state'] != 'finished' and webtoon['state'] != 'dropped':
                    is_innactive = False
                    if (float(scraped_webtoon['chapter_list'][0]["chapter"].strip("Chapter ")) - len(scraped_webtoon['chapter_list'])) > - 10:
                        is_innactive = isinnactive(scraped_webtoon['chapter_list'][0]['date'])
                    if webtoon['last_chapter_read'] != float(scraped_webtoon['chapter_list'][0]['chapter'].strip("Chapter ")):
                        #print(webtoon['last_chapter_read'], scraped_webtoon['chapter_list'][0]['chapter'].strip("Chapter "), scraped_webtoon['name'])
                        webtoon['state'] = 'up_innactive' if is_innactive  else'not_up_to_date'
                    else :
                        webtoon['state'] = 'innactive' if is_innactive else 'up_to_date'
                data = {
                    'url': webtoon['url'],
                    'state': webtoon['state'],
                    'last_chapter_read': webtoon['last_chapter_read'],
                    'name': scraped_webtoon['name'],
                    'chapter_list' : scraped_webtoon['chapter_list'],
                    'image': scraped_webtoon['image']
                }
                converged.append(data)
    return json.dumps(converged), 200

@app.route('/mas/all', methods=['GET'])
def all():
    all = requests.get(local + scrape + "/get_all")
    return json.dumps(json.loads(all.text)),200

@app.route('/mas/add', methods=['POST'])
def add():
    params = request.data.decode('utf-8')
    res_scrape = requests.post(local + scrape + "/add_webtoons", data=params)
    res = requests.post(local + storage + "/mas/add", data=params)
    return str(res.status_code) + str(res_scrape.status_code), 200

@app.route('/mas/update_chapter', methods=['POST'])
def update_chapter():
    params = request.data.decode('utf-8')
    res = requests.post(local + storage + "/mas/update_chapter", data=params)
    return str(res.status_code), 200

@app.route('/mas/set_finished', methods=['POST'])
def set_finished():
    params = request.data.decode('utf-8')
    res = requests.post(local + storage + "/mas/set_finished", data=params)
    return str(res.status_code), 200

@app.route('/mas/set_unfinished', methods=['POST'])
def set_unfinished():
    params = request.data.decode('utf-8')
    res = requests.post(local + storage + "/mas/set_unfinished", data=params)
    return str(res.status_code), 200

@app.route('/mas/set_dropped', methods=['POST'])
def set_dropped():
    params = request.data.decode('utf-8')
    res = requests.post(local + storage + "/mas/set_dropped", data=params)
    return str(res.status_code), 200

@app.route('/mas/set_undrop', methods=['POST'])
def set_reading():
    params = request.data.decode('utf-8')
    res = requests.post(local + storage + "/mas/set_undrop", data=params)
    return str(res.status_code), 200

@app.route('/login', methods=['POST'])
def login():
    params = request.data.decode('utf-8')
    res = requests.post(local + storage + "/login", data=params)
    return str(res.status_code), 205 if res.status_code == 205 else 200

@app.route('/register', methods=['POST'])
def register():
    params = request.data.decode('utf-8')
    res = requests.post(local + storage + "/register", data=params)
    print(res.status_code)
    return str(res.status_code), 205 if res.status_code == 205 else 200

@app.route('/riot/get_followed', methods=['GET'])
def followed():
    params = request.args
    print(params)
    res = requests.get(local + storage + "/riot/follow", params=params)
    res = requests.post(local + riot + "/get_followed", data=res.text)
    res_json = json.loads(res.text)
    return json.dumps(res_json), 200

@app.route('/riot/start_follow', methods=['GET'])
def start_follow():
    params = request.args
    print(params)
    res = requests.get(local + riot + "/start_follow", params={'player': params.get('player')})
    res = requests.post(local + storage + "/riot/start_follow", data=json.dumps({'user':params.get('user'),'riot':res.text}))
    return str(res.status_code), 200

@app.route('/riot/add_follow', methods=['POST'])
def add_follow():
    params = json.loads(request.data.decode('utf-8'))
    print(params[0]['list'])
    players = []
    for player in range(len(params[0]['list'])):
        players.append({"player": params[0]['list'][player]["player" + str(player + 1)]})
    print(players)
    res = requests.post(local + riot + "/add_follow", data=json.dumps(players))
    res = requests.post(local + storage + "/riot/add_follow", data=json.dumps({'user':params[0]['user'],'riot':res.text}))
    return str(res.status_code), 200




if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6000)
