from flask import Flask, request, redirect
import requests
import json
from datetime import datetime, timedelta

app = Flask(__name__)

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
    user_mas = requests.get("http://127.0.0.1:5100/mas", params=params)
    user_mas_json = json.loads(user_mas.text)
    webtoons = requests.get("http://127.0.0.1:5000/get_all")
    webtoons_json = json.loads(webtoons.text)
    #double comparaison de json (si une url de user_mas_json apparait dans webtoon_json l'ajouter a une liste)
    converged = []
    for webtoon in user_mas_json:
        for scraped_webtoon in webtoons_json:
            if webtoon['url'] == scraped_webtoon['url']:
                if webtoon['state'] != 'finished' and webtoon['state'] != 'dropped':
                    is_innactive = False
                    if (int(scraped_webtoon['chapter_list'][0]["chapter"].strip("Chapter ")) - len(scraped_webtoon['chapter_list'])) > - 10:
                        is_innactive = isinnactive(scraped_webtoon['chapter_list'][0]['date'])
                    if webtoon['last_chapter_read'] != int(scraped_webtoon['chapter_list'][0]['chapter'].strip("Chapter ")):
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
    all = requests.get("http://127.0.0.1:5000/get_all")
    return json.dumps(json.loads(all.text)),200

@app.route('/mas/add', methods=['POST'])
def add():
    params = request.data.decode('utf-8')
    res_scrape = requests.post("http://127.0.0.1:5000/add_webtoons", data=params)
    res = requests.post("http://127.0.0.1:5100/mas/add", data=params)
    return str(res.status_code) + str(res_scrape.status_code), 200

@app.route('/mas/update_chapter', methods=['POST'])
def update_chapter():
    params = request.data.decode('utf-8')
    res = requests.post("http://127.0.0.1:5100/mas/update_chapter", data=params)
    return str(res.status_code), 200

@app.route('/mas/set_finished', methods=['POST'])
def set_finished():
    params = request.data.decode('utf-8')
    res = requests.post("http://127.0.0.1:5100/mas/set_finished", data=params)
    return str(res.status_code), 200

@app.route('/mas/set_unfinished', methods=['POST'])
def set_unfinished():
    params = request.data.decode('utf-8')
    res = requests.post("http://127.0.0.1:5100/mas/set_unfinished", data=params)
    return str(res.status_code), 200

@app.route('/mas/set_dropped', methods=['POST'])
def set_dropped():
    params = request.data.decode('utf-8')
    res = requests.post("http://127.0.0.1:5100/mas/set_dropped", data=params)
    return str(res.status_code), 200

@app.route('/mas/set_undrop', methods=['POST'])
def set_reading():
    params = request.data.decode('utf-8')
    res = requests.post("http://127.0.0.1:5100/mas/set_undrop", data=params)
    return str(res.status_code), 200

@app.route('/login', methods=['POST'])
def login():
    params = request.data.decode('utf-8')
    res = requests.post("http://127.0.0.1:5100/login", data=params)
    return str(res.status_code), 205 if res.status_code == 205 else 200

@app.route('/register', methods=['POST'])
def register():
    params = request.data.decode('utf-8')
    res = requests.post("http://127.0.0.1:5100/register", data=params)
    print(res.status_code)
    return str(res.status_code), 205 if res.status_code == 205 else 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6000)
