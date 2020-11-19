from flask import Flask,jsonify,request
import os
from subprocess import PIPE,Popen
app = Flask(__name__)

@app.route("/",methods=["GET"])
def home():
    return "Working"

@app.route("/sendcode",methods=["POST"])
def sendCode():
    print(request.json)
    owd = os.getcwd() # chdir into this once done executing.
    username = request.json['username']
    code = request.json['code']
    os.chdir('users')
    userFolders=os.listdir()
    if username not in userFolders:
        os.mkdir(username)
    os.chdir(username)
    with open(f"{username}.py","w") as f:
        f.write(code)
    os.system(f'docker run -it --name {username}container --detach --rm python:3')
    os.system(f'docker cp {username}.py {username}container:/{username}.py')
    # result = os.popen(f'docker exec {username}container python {username}.py').read()
    p = Popen(f"docker exec {username}container python {username}.py",shell=True,stdout=PIPE,stderr=PIPE)
    stdout,stderr = p.communicate()
    os.system(f'docker kill {username}container')
    os.chdir(owd)#switching back to original directory
    print(os.path.abspath(os.curdir))
    return jsonify({"message":stdout.decode(),"error":stderr.decode()})

if __name__=='__main__':
    app.run(port=5555,debug=True)