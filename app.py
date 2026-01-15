from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from transformers import AutoModelForCausalLM, AutoTokenizer

app = Flask(__name__)
CORS(app)  # Enable CORS for all origins

# Load pre-trained model and tokenizer
model_name = "microsoft/DialoGPT-small"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/chat', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'OPTIONS':
        return '', 200  # Handle CORS preflight request

    data = request.json
    user_input = data.get('message')
    
    if not user_input:
        return jsonify({"error": "No input provided"}), 400

    # Generate bot response
    input_ids = tokenizer.encode(user_input + tokenizer.eos_token, return_tensors="pt")
    bot_response_ids = model.generate(input_ids, max_length=1000, pad_token_id=tokenizer.eos_token_id)
    bot_response = tokenizer.decode(bot_response_ids[:, input_ids.shape[-1]:][0], skip_special_tokens=True)
    
    return jsonify({"response": bot_response})

if __name__ == "__main__":
    app.run(debug=True)
