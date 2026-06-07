import requests

BASE_URL = "http://127.0.0.1:8000"

print("[ТЕСТ1] Проверка связи с сервером:")
try:
    response = requests.get(f"{BASE_URL}/items")
    if response.status_code == 200:
        print("Все в порядке")
        print(f"Найдено товаров: {len(response.json())}")
    else:
        print(f"ошибка {response.status_code}")
except requests.exceptions.ConnectionError:
    print("сервер не запустен")