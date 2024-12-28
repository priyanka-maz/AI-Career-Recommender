from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

# Logic App Trigger
url = "https://prod-19.centralindia.logic.azure.com:443/workflows/a9eed72e023b4a48b5ca82ccd78a5fe0/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=GQMElIuRLscdzpVMFVJwRoLRPQHXULOet48Znetl8JI"

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route('/generate', methods=['POST'])
def generate():
    try:
        data = request.get_json()
        skills = ", ".join(f"'{item}'" for item in data["options"])
        
        # body = {"Skills" : skills}
        # response = requests.post(url, json=body)
        
        response = {"Recommended_Career":["Game Developer"],"status_code":200}
        return jsonify({"career": response["Recommended_Career"][0]}), 200
    
        # if response.status_code == 200:
        #     print(f"success with status code {response.status_code}: {response.text}")
        #     return jsonify({"career": response.json()["Recommended_Career"][0]}), 200
        # else:
        #     print(f"Failed with status code {response.status_code}: {response.text}")
        #     return jsonify({"msg": response.text}), response.status_code

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=8000, host='0.0.0.0')
