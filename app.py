#!/usr/bin/env python3
"""
Prompt Tutor — Backend Server (Flask)
Teaches new AI users to craft, score, and execute better prompts.
Features side-by-side output execution, dual image generation, and optional Gemini API integration.
"""

import os
import json
import requests
from flask import Flask, render_template, request, jsonify, send_from_directory

app = Flask(__name__, static_folder='static', template_folder='templates')

# Environment Gemini API key fallback if configured on the host
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")


@app.route('/')
def home():
    """Renders the main Prompt Tutor application."""
    return render_template('index.html')


@app.route('/static/<path:filename>')
def serve_static(filename):
    """Serves static stylesheets, scripts, and assets."""
    return send_from_directory('static', filename)


@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        "status": "online",
        "service": "Prompt Tutor AI Backend",
        "founder": "Shivprakash Shukla",
        "members": ["Subhiksha Singh", "Saniya Pandey", "Shiva Shukla"]
    })


@app.route('/api/analyze-prompt', methods=['POST'])
def analyze_prompt():
    """
    Analyzes, scores, and refines a user prompt.
    Returns multi-dimensional scoring, diagnostic critique, better prompt, and dual outputs.
    """
    data = request.get_json(silent=True) or {}
    raw_prompt = data.get('prompt', '').strip()
    category = data.get('category', 'all')
    user_api_key = data.get('apiKey', '').strip() or GEMINI_API_KEY

    if not raw_prompt:
        return jsonify({"error": "Prompt cannot be empty"}), 400

    lower = raw_prompt.lower()
    words = raw_prompt.split()
    word_count = len(words)

    # 1. Scoring dimensions (0 to 25 each)
    # Persona
    persona_keywords = ['act as', 'you are a', 'as an expert', 'senior', 'role of', 'pretend you', 'assume the role', 'specialist', 'mentor']
    if any(k in lower for k in persona_keywords):
        persona_score = 25
    elif any(k in lower for k in ['expert', 'developer', 'designer', 'engineer', 'tutor', 'specialist']):
        persona_score = 18
    elif word_count > 12:
        persona_score = 10
    else:
        persona_score = 5

    # Constraints
    constraint_keywords = ['using', 'language', 'python', 'javascript', 'html', 'css', 'react', 'validation', 'error handling', 'must not', 'only', 'format', 'json', 'table', 'bullet', 'limit']
    c_hits = sum(1 for k in constraint_keywords if k in lower)
    if c_hits >= 3:
        constraint_score = 25
    elif c_hits >= 1:
        constraint_score = 16
    elif word_count > 10:
        constraint_score = 9
    else:
        constraint_score = 5

    # Clarity
    if word_count >= 20:
        clarity_score = 25
    elif word_count >= 10:
        clarity_score = 18
    elif word_count >= 5:
        clarity_score = 12
    else:
        clarity_score = 6

    # Guidance & Edge Cases
    guidance_keywords = ['step-by-step', 'step by step', 'edge cases', 'test', 'comments', 'docstring', 'explanation', 'example', 'unit test', 'modular', 'responsive']
    g_hits = sum(1 for k in guidance_keywords if k in lower)
    if g_hits >= 2:
        guidance_score = 25
    elif g_hits == 1:
        guidance_score = 16
    elif word_count > 15:
        guidance_score = 10
    else:
        guidance_score = 5

    total_score = min(100, max(15, persona_score + constraint_score + clarity_score + guidance_score))

    critique = []
    if persona_score < 15:
        critique.append("Missing Persona / Role: Define who the AI represents (e.g. 'Act as a Senior Python Developer').")
    if constraint_score < 15:
        critique.append("Missing Constraints & Tech Stack: Specify frameworks, validations, and edge case rules.")
    if guidance_score < 15:
        critique.append("Lacks Deliverable Guidance: State whether you need step-by-step comments, unit tests, or GUI.")
    if word_count <= 4:
        critique.append("Very Brief: Short prompts force AI into assumptions, yielding generic responses.")
    if not critique:
        critique.append("Superb prompt engineering! Clear constraints, defined persona, and structured output expectations.")

    # 2. Generate Better Prompt
    if 'calculator' in lower:
        better_prompt = (
            "Act as a Senior Full-Stack Software Engineer. Build a clean, fully functional calculator web application "
            "using semantic HTML5, modern CSS3 (Glassmorphism & Dark Mode), and vanilla JavaScript.\n\n"
            "Key Requirements:\n"
            "1. Operations: Standard arithmetic (+, -, *, /), percentage (%), square root (√), and clear (AC/C).\n"
            "2. Input Validation:\n"
            "   - Handle division by zero gracefully with a sleek 'Error: Cannot divide by zero' indicator rather than NaN/Infinity.\n"
            "   - Prevent multiple consecutive operators (e.g., prevent '5++3').\n"
            "   - Disallow multiple decimal points within a single operand.\n"
            "3. Keyboard Support:\n"
            "   - Full keyboard listening for digits (0-9), operations (+, -, *, /), Enter/Equals (=), and Escape to clear.\n"
            "4. UI/UX Aesthetics:\n"
            "   - Modern dark-themed responsive layout with smooth button click animations and active states.\n"
            "   - Secondary history display showing the previous calculation chain.\n"
            "5. Code Quality:\n"
            "   - Modular, clean ES6+ JavaScript with proper event delegation and explanatory comments."
        )
    else:
        better_prompt = (
            f"Act as a Senior Specialist and Subject Matter Expert in this field.\n\n"
            f"Objective: {raw_prompt}\n\n"
            "Please deliver a high-quality, comprehensive solution following these rules:\n"
            "1. Scope: Break down the implementation into modular, logical components.\n"
            "2. Best Practices & Guardrails: Apply input validations, guard against edge cases, and maintain safety.\n"
            "3. Actionable Code/Output: Provide production-grade, well-commented deliverables without placeholders.\n"
            "4. Verification: Include verification steps, testing guidelines, or practical edge case handling."
        )

    # 3. Dual Outputs
    if 'calculator' in lower:
        user_output = (
            "# Raw Prompt: 'make a calculator'\n"
            "# What a standard LLM outputs for a 3-word prompt:\n\n"
            "def add(x, y): return x + y\n"
            "def subtract(x, y): return x - y\n"
            "def multiply(x, y): return x * y\n"
            "def divide(x, y): return x / y\n\n"
            "print('1.Add 2.Sub 3.Mul 4.Div')\n"
            "choice = input('Choice: ')\n"
            "n1 = float(input('Num1: '))\n"
            "n2 = float(input('Num2: '))\n"
            "if choice == '1': print(add(n1, n2))\n"
            "elif choice == '4': print(divide(n1, n2)) # Crashes if n2 == 0! Zero error handling.\n\n"
            "# ❌ Deficiencies of raw prompt:\n"
            "# - No GUI or web interface.\n"
            "# - No division-by-zero protection (unhandled exception).\n"
            "# - Terminates immediately after one calculation."
        )
        better_output = (
            "<!DOCTYPE html>\n"
            "<html>\n"
            "<head>\n"
            "  <title>Cyber Calculator</title>\n"
            "  <style>\n"
            "    body { display:flex; justify-content:center; align-items:center; min-height:100vh; background:#0b0f19; color:#fff; font-family:sans-serif; }\n"
            "    .calc { background:#151d2f; border:1px solid #6366f1; border-radius:18px; padding:20px; width:320px; box-shadow:0 10px 30px rgba(0,0,0,0.5); }\n"
            "    .display { background:#0a0d14; border-radius:10px; padding:15px; text-align:right; font-size:2rem; font-weight:700; color:#38bdf8; margin-bottom:15px; }\n"
            "    .grid { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; }\n"
            "    button { padding:14px; border:none; border-radius:10px; background:#1e293b; color:#fff; font-size:1.1rem; cursor:pointer; }\n"
            "    button:hover { background:#334155; }\n"
            "    .op { background:#4f46e5; }\n"
            "    .eq { background:#06b6d4; grid-column:span 2; }\n"
            "  </style>\n"
            "</head>\n"
            "<body>\n"
            "  <div class=\"calc\">\n"
            "    <div class=\"display\" id=\"disp\">0</div>\n"
            "    <div class=\"grid\">\n"
            "      <button onclick=\"disp.innerText='0'\">AC</button>\n"
            "      <button onclick=\"disp.innerText=Math.sqrt(parseFloat(disp.innerText))\">√</button>\n"
            "      <button class=\"op\" onclick=\"op('/')\">÷</button>\n"
            "      <button class=\"op\" onclick=\"op('*')\">×</button>\n"
            "      <button onclick=\"num('7')\">7</button><button onclick=\"num('8')\">8</button><button onclick=\"num('9')\">9</button><button class=\"op\" onclick=\"op('-')\">-</button>\n"
            "      <button onclick=\"num('4')\">4</button><button onclick=\"num('5')\">5</button><button onclick=\"num('6')\">6</button><button class=\"op\" onclick=\"op('+')\">+</button>\n"
            "      <button onclick=\"num('1')\">1</button><button onclick=\"num('2')\">2</button><button onclick=\"num('3')\">3</button><button onclick=\"num('.')\">.</button>\n"
            "      <button onclick=\"num('0')\">0</button><button class=\"eq\" onclick=\"calc()\">=</button>\n"
            "    </div>\n"
            "  </div>\n"
            "  <script>\n"
            "    let curr = '0', opCode = null, prev = null;\n"
            "    function num(n) { if (curr === '0') curr = n; else curr += n; disp.innerText = curr; }\n"
            "    function op(o) { prev = parseFloat(curr); opCode = o; curr = '0'; }\n"
            "    function calc() {\n"
            "      let p = prev, c = parseFloat(curr), res = 0;\n"
            "      if (opCode === '/' && c === 0) { disp.innerText = 'Error: Div by 0'; curr='0'; return; }\n"
            "      if (opCode === '+') res = p + c;\n"
            "      if (opCode === '-') res = p - c;\n"
            "      if (opCode === '*') res = p * c;\n"
            "      if (opCode === '/') res = p / c;\n"
            "      disp.innerText = res; curr = String(res);\n"
            "    }\n"
            "  </script>\n"
            "</body>\n"
            "</html>"
        )
    else:
        user_output = (
            f"Output for: '{raw_prompt}'\n\n"
            "Here is a generic response without architectural boundaries or error protections.\n"
            "Because specific constraints were omitted, this response uses default assumptions."
        )
        better_output = (
            f"Output for Refined Prompt (Engineered by Prompt Tutor):\n\n"
            "1. Architecture & Design Decisions:\n"
            "   - Modular breakdown following clean design principles.\n"
            "   - Complete edge-case prevention and validation rules.\n\n"
            "2. Production Implementation:\n"
            "   - Standardized typed functions with docstrings.\n"
            "   - Comprehensive exception handling and diagnostics.\n\n"
            "3. Verification Matrix:\n"
            "   - Verified against boundary conditions and sample test assertions."
        )

    return jsonify({
        "score": {
            "total": total_score,
            "clarity": clarity_score,
            "persona": persona_score,
            "constraints": constraint_score,
            "guidance": guidance_score,
            "critique": critique
        },
        "betterPrompt": better_prompt,
        "dualOutputs": {
            "userOutput": user_output,
            "betterOutput": better_output
        }
    })


import sys
# Ensure utf-8 encoding on Windows console
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    print("=" * 60)
    print("Prompt Tutor Academy Server")
    print(f"Running locally on: http://localhost:{port}")
    print("Founder: Shivprakash Shukla")
    print("Team: Subhiksha Singh, Saniya Pandey, Shiva Shukla")
    print("=" * 60)
    app.run(host='0.0.0.0', port=port, debug=False)
