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
        return 'Hello, World!',200  
    
@app.route('/mas', methods=['GET'])
def mas():  
    params = request.args
    print(params)
    user_mas = get_mas_files(params['user'])
    return user_mas, 200


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
        return 4103
    except:
        return 4100          


if __name__ == '__main__':
    app.run(port=5100)
