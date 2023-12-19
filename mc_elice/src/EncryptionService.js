// EncryptionService.js

const EncryptionService = {
  async encrypt(message) {
    const response = await fetch('/encrypt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({ message }),
    });
    const data = await response.json();
  if (!response.ok) {
    throw new Error(`Ошибка сервера: ${response.status}. Сообщение: ${data.error}`);
  }
  if (typeof data.encrypted_message === 'string') {
    data.encrypted_message = data.encrypted_message.replace(/,/g, '.');
  }
  return data;
},

  async decrypt(message) {
    const response = await fetch('/decrypt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
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

  async generateKeys() {
    const response = await fetch('/generate_keys', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },


  async changeKey() {
    const response = await fetch('/change_key', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },
};

export default EncryptionService;
