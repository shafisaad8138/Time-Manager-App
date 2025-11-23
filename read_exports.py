import json

try:
    with open(r"c:\Users\aryaa\Desktop\portfolio website\time-manager-app\node_modules\firebase\package.json", "r") as f:
        data = json.load(f)
        print(json.dumps(data.get("exports"), indent=2))
        print(json.dumps(data.get("react-native"), indent=2))
except Exception as e:
    print(e)
