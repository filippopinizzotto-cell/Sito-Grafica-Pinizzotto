"""
Test Script - Verifica che tutto sia installato correttamente
Esegui: python test_chatbot.py
"""

import sys
import subprocess
from pathlib import Path

def print_header(text):
    print("\n" + "="*50)
    print(text)
    print("="*50)

def test_python_version():
    """Verifica versione Python"""
    print_header("1️⃣  TEST VERSIONE PYTHON")
    print(f"Python: {sys.version}")
    if sys.version_info >= (3, 8):
        print("✅ Python version OK")
        return True
    else:
        print("❌ Necessario Python 3.8+")
        return False

def test_import(module_name, pretty_name):
    """Verifica che un modulo sia installato"""
    try:
        __import__(module_name)
        print(f"✅ {pretty_name} installato")
        return True
    except ImportError:
        print(f"❌ {pretty_name} NON installato")
        print(f"   Installa con: pip install {module_name}")
        return False

def test_imports():
    """Verifica tutte le dipendenze"""
    print_header("2️⃣  TEST DIPENDENZE")
    
    modules = [
        ('flask', 'Flask'),
        ('flask_cors', 'Flask-CORS'),
        ('google.generativeai', 'google-generativeai'),
        ('dotenv', 'python-dotenv'),
    ]
    
    all_ok = True
    for module, name in modules:
        if not test_import(module, name):
            all_ok = False
    
    return all_ok

def test_api_key():
    """Verifica che la API key sia presente"""
    print_header("3️⃣  TEST API KEY")
    
    # Controlla nel file backend_chatbot.py
    try:
        with open('backend_chatbot.py', 'r') as f:
            content = f.read()
            if 'AIzaSyAJJz2soC2FeI8LpsnVv8pJ-qvZaZqoqRc' in content:
                print("✅ API Key trovata in backend_chatbot.py")
                return True
            else:
                print("❌ API Key non trovata")
                print("   Aggiungi: GEMINI_API_KEY = 'AIzaSyAJJz2soC2FeI8LpsnVv8pJ-qvZaZqoqRc'")
                return False
    except FileNotFoundError:
        print("❌ File backend_chatbot.py non trovato")
        return False

def test_files():
    """Verifica che i file necessari esistano"""
    print_header("4️⃣  TEST FILE STRUTTURA")
    
    files_needed = [
        'backend_chatbot.py',
        'requirements.txt',
        'assets/js/chatbot.js',
        'assets/js/chatbot.css',
        'index.html',
        'servizi.html',
        'preventivo.html',
        'contatti.html',
    ]
    
    all_ok = True
    for file in files_needed:
        path = Path(file)
        if path.exists():
            print(f"✅ {file}")
        else:
            print(f"❌ {file} - NON TROVATO")
            all_ok = False
    
    return all_ok

def test_html_integration():
    """Verifica che il chatbot sia integrato nell'HTML"""
    print_header("5️⃣  TEST INTEGRAZIONE HTML")
    
    html_files = ['index.html', 'servizi.html', 'preventivo.html', 'contatti.html']
    all_ok = True
    
    for html_file in html_files:
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()
                has_css = 'assets/js/chatbot.css' in content
                has_js = 'assets/js/chatbot.js' in content
                
                if has_css and has_js:
                    print(f"✅ {html_file} - Chatbot integrato")
                else:
                    print(f"⚠️  {html_file} - Integrazione incompleta")
                    if not has_css:
                        print(f"   Manca: chatbot.css")
                    if not has_js:
                        print(f"   Manca: chatbot.js")
                    all_ok = False
        except FileNotFoundError:
            print(f"❌ {html_file} - NON TROVATO")
            all_ok = False
    
    return all_ok

def run_all_tests():
    """Esegui tutti i test"""
    print("\n")
    print("╔════════════════════════════════════════════════════════╗")
    print("║     TEST SETUP CHATBOT PINIZZOTTO                      ║")
    print("║     24 Dicembre 2025                                    ║")
    print("╚════════════════════════════════════════════════════════╝")
    
    results = {
        'Python Version': test_python_version(),
        'Dependencies': test_imports(),
        'API Key': test_api_key(),
        'File Structure': test_files(),
        'HTML Integration': test_html_integration(),
    }
    
    # Risultato finale
    print_header("📊 RISULTATI FINALI")
    
    all_passed = all(results.values())
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test_name}")
    
    print("\n")
    if all_passed:
        print("🎉 TUTTI I TEST PASSATI!")
        print("\n📖 Prossimi Step:")
        print("   1. Esegui: python backend_chatbot.py")
        print("   2. Apri: http://localhost:5000/")
        print("   3. Apri il tuo sito e prova il chatbot!")
    else:
        print("❌ ALCUNI TEST FALLITI")
        print("\n🔧 Azioni Consigliate:")
        print("   1. Leggi gli errori sopra")
        print("   2. Esegui: pip install -r requirements.txt")
        print("   3. Riprova: python test_chatbot.py")
    
    print("\n")
    return all_passed

if __name__ == '__main__':
    success = run_all_tests()
    sys.exit(0 if success else 1)
