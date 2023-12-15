// EncryptionService.js
const EncryptionService = {
  async encrypt(message) {
    const response = await fetch('/encrypt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    return response.json();
  },

  async decrypt(message) {
    const response = await fetch('/decrypt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    if (!response.ok) {
      // Можно также добавить response.status, чтобы увидеть код ошибки
      const errorText = await response.text(); // или response.json(), если сервер возвращает JSON
      throw new Error(`Ошибка сервера: ${response.status}. Сообщение: ${errorText}`);
    }
    return response.json();
  },

  async getKey() {
    const response = await fetch('/get_key', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  async changeKey(newKey) {
    // Отправка запроса на изменение ключа
    const response = await fetch('/change_key', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ new_key: newKey }),
    });
    return response.json();
  },
};

export default EncryptionService;
