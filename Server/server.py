from flask import Flask, request, redirect
import requests
import json

app = Flask(__name__)

@app.route('/mas', methods=['GET'])
def mas():
    params = request.args
    print(params)
    user_mas = requests.get("http://127.0.0.1:5100/mas", params=params)
    user_mas_json = json.loads(user_mas.text)
    webtoons = requests.get("http://127.0.0.1:5000/get_all")
    webtoons_json = json.loads(webtoons.text)
    #double comparaison de json (si une url de user_mas_json apparait dans webtoon_json l'ajouter a une liste)
    converged = []
    for webtoon in user_mas_json:
        for scraped_webtoon in webtoons_json:
            if webtoon['url'] == scraped_webtoon['url']:
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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6000)
