from flask import Flask, request
import json

app = Flask(__name__)

def check_origin(request):
    return request.remote_addr != '127.0.0.1'


@app.route('/retrieve', methods=['GET'])
def retrieve_data():
    if check_origin(request):
        return 'You are not allowed to contact me',403
    else:
        section = request.args.get('section')
        user = request.args.get('user')
        return 'Hello, World!',200
        

@app.route('/login', methods=['POST'])
def login():
    print(request.data.decode('utf-8'))
    if check_origin(request):
        return 'You are not allowed to contact me',403
    else:
        datas = request.data.decode('utf-8')
        data_json = json.loads(datas)
        username = data_json['username']
        password = data_json['password']
        print(username, password)
        if read_user_file(username, password):
            return 'Hello, World!',200
        else:
            return '', 205
    
@app.route('/register', methods=['POST'])
def register():
    if check_origin(request):
        return 'You are not allowed to contact me',403
    else:
        datas = request.data.decode('utf-8')
        print(datas)
        data_json = json.loads(datas)
        username = data_json['username']
        password = data_json['password']
        email = data_json['email']
        print(username, password, email)
        try :
            with open('users.json', 'r') as f:
                users = json.load(f)
                for user in users:
                    if user['username'] == username:
                        return 'Username already taken', 205
                users.append({'id': len(users) ,'username': username, 'password': password , 'email': email})
                with open('users.json', 'w') as f:
                    json.dump(users, f)
                    return 'Hello, World!',200
        except FileNotFoundError:
            return '',403
        except Exception as e:
            print(e)
            return '',400
        return 'Hello, World!',200  
    
@app.route('/mas', methods=['GET'])
def mas():  
    params = request.args
    print(params)
    user_mas = get_mas_files(params['user'])
    return user_mas, 200

@app.route('/mas/add/', methods=['POST'])
def add():
    if check_origin(request):
        return 'You are not allowed to contact me',403
    else:
        data = request.data.decode('utf-8')
        data_json = json.loads(data)
        objects = []
        for url in data_json['url_list']:
            objects.append({'url': url, 'state': 'not_up_to_date', 'last_chapter_read': 0})
        try:
            with open( "./mas/" + data_json['user'] + '_MAS.json', 'r') as f:
                mas = json.load(f)
                for obj in objects:
                    mas.append(obj)
                with open( "./mas/" + data_json['user'] + '_MAS.json', 'w') as f:
                    json.dump(mas, f)
                    return 'Done',200
        except FileNotFoundError:
            return 4103
        except:
            return 4100

@app.route('/mas/update_chapter', methods=['POST'])
def update_chapter():
    if check_origin(request):
        return 'You are not allowed to contact me',403
    else:
        data = request.data.decode('utf-8')
        print(data)
        data_json = json.loads(data)
        try:
            with open( "./mas/" + data_json['user'] + '_MAS.json', 'r') as f:
                mas = json.load(f)
                for webtoon in mas:
                    if webtoon['url'] == data_json['webtoon']:
                        webtoon['last_chapter_read'] = data_json['chapter']
                with open( "./mas/" + data_json['user'] + '_MAS.json', 'w') as f:
                    json.dump(mas, f)
                    return 'Done',200
        except FileNotFoundError:
            return 4103
        except:
            return 4100

@app.route('/mas/set_finished', methods=['POST'])
def set_finished():
    if check_origin(request):
        return 'You are not allowed to contact me',403
    else:
        data = request.data.decode('utf-8')
        data_json = json.loads(data)
        try:
            with open( "./mas/" + data_json['user'] + '_MAS.json', 'r') as f:
                mas = json.load(f)
                for webtoon in mas:
                    if webtoon['url'] == data_json['webtoon']:
                        webtoon['state'] = 'finished'
                with open( "./mas/" + data_json['user'] + '_MAS.json', 'w') as f:
                    json.dump(mas, f)
                    return 'Done',200
        except FileNotFoundError:
            return 4103
        except:
            return 4100

@app.route('/mas/set_unfinished', methods=['POST'])
def set_unfinished():
    if check_origin(request):
        return 'You are not allowed to contact me',403
    else:
        data = request.data.decode('utf-8')
        data_json = json.loads(data)
        try:
            with open( "./mas/" + data_json['user'] + '_MAS.json', 'r') as f:
                mas = json.load(f)
                for webtoon in mas:
                    if webtoon['url'] == data_json['webtoon']:
                        webtoon['state'] = 'unfinished'
                with open( "./mas/" + data_json['user'] + '_MAS.json', 'w') as f:
                    json.dump(mas, f)
                    return 'Done',200
        except FileNotFoundError:
            return 4103
        except:
            return 4100

@app.route('/mas/set_dropped', methods=['POST'])
def set_dropped():
    if check_origin(request):
        return 'You are not allowed to contact me',403
    else:
        data = request.data.decode('utf-8')
        print(data)
        data_json = json.loads(data)
        try:
            with open( "./mas/" + data_json['user'] + '_MAS.json', 'r') as f:
                mas = json.load(f)
                for webtoon in mas:
                    if webtoon['url'] == data_json['webtoon']:
                        webtoon['state'] = 'dropped'
                with open( "./mas/" + data_json['user'] + '_MAS.json', 'w') as f:
                    json.dump(mas, f)
                    return 'Done',200
        except FileNotFoundError:
            return 4103
        except:
            return 4100

@app.route('/mas/set_undrop', methods=['POST'])
def set_undrop():
    if check_origin(request):
        return 'You are not allowed to contact me',403
    else:
        data = request.data.decode('utf-8')
        data_json = json.loads(data)
        try:
            with open( "./mas/" + data_json['user'] + '_MAS.json', 'r') as f:
                mas = json.load(f)
                for webtoon in mas:
                    if webtoon['url'] == data_json['webtoon']:
                        webtoon['state'] = 'not_up_to_date'
                with open( "./mas/" + data_json['user'] + '_MAS.json', 'w') as f:
                    json.dump(mas, f)
                    return 'Done',200
        except FileNotFoundError:
            return 4103
        except:
            return 4100


def read_user_file(username, password):
    try :
        with open('users.json', 'r') as f:
            users = json.load(f)
            for user in users:
                if user['username'] == username and user['password'] == password:
                    return True
            return False       
    except FileNotFoundError:
        return 4103
    except:
        return 4100

def get_mas_files(username):
    try :
        with open( "./mas/" + username + '_MAS.json', 'r') as f:
            mas = json.load(f)
            return mas
    except FileNotFoundError:
        with open( "./mas/" + username + '_MAS.json', 'w') as f:
            json.dump([], f)
            return []
    except:
        return 4100          


if __name__ == '__main__':
    app.run(port=5100)
