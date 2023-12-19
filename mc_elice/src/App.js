// App.js
import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import EncryptionService from './EncryptionService';

function App() {
  const [fileInfo, setFileInfo] = useState(null);
  const [inputText, setInputText] = useState('');
  const [encrypt , setEncryptedText] = useState('');
  const [key_word, setKeyText] = useState('')
  const [placeholder, setPlaceholder] = useState('Введите текст');
  const [inputError, setInputError] = useState(false);
  const [isKeyVisible, setIsKeyVisible] = useState(false); // Добавляем useState для отслеживания видимости ключа
  const [newKey, setNewKey] = useState(''); // Для ввода нового ключа
  const inputRef = useRef(null); // Создание ref для текстового поля
  const [isEncrypted, setIsEncrypted] = useState(false); // Добавлено новое состояние
  const encryptedTextRef = useRef(null);
  const keyWord = useRef(null);
  const [keyError, setKeyError] = useState(false);
  const [keyPlaceholder, setKeyPlaceholder] = useState('Введите новый ключ');
  const [encryptError, setEncryptError] = useState('Зашифрованный / Расшифрованный текст')
  const [inputEncryptError, setEncryptInputError] = useState(false);
  const [outputText, setOutputText] = useState('');
  const [keyAnimation, setKeyAnimation] = useState('');
  const [keys, setKeys] = useState({
    Ghat: [],
    S: [],
    P: [],
    H: []
  });

  const focusTextInput = () => {
    if (inputRef.current) {
      inputRef.current.focus(); // Установка фокуса на input элемент
    }
  };

    // Функция для анимации "дрожания"
    const shakeInput = () => {
      setKeyError(true);
      setKeyPlaceholder("Не удалось поменять ключ")
      setTimeout(() => {
        setKeyError(false);
      }, 500);
      setTimeout(() => {
        setKeyPlaceholder('Введите новый ключ')
      }, 1500);
    };

    // Обработчики копирования текста
    const copyToClipboard = (ref) => {
      if (ref && ref.current) {
        ref.current.select();
        document.execCommand('copy');
      }
    };

    useEffect(() => {
      fetchKeys();
    }, []);
  
    const fetchKeys = async () => {
      try {
        const newKeys = await EncryptionService.getKey();
        setKeys(newKeys);
      } catch (error) {
        console.error('Ошибка при получении ключей: ', error);
      }
    };

  const handleEncrypt = async () => {
    if (!inputText.trim()) {
      setInputError(true);
      setPlaceholder('Пожалуйста, введите текст!');
      setIsEncrypted(false); // Устанавливаем состояние isEncrypted в false
      setTimeout(() => setInputError(false), 500); // Скрываем ошибку через 0.5 секунды
      focusTextInput();
      return;
    }
    else{
      setIsEncrypted(true); // Устанавливаем состояние isEncrypted в true
    }
    try {
      const data = await EncryptionService.encrypt(inputText);
      if (data === ""){
        setPlaceholder('Введите текст');
      }
      setOutputText(data.encrypted_message);
      setPlaceholder('Введите текст'); // Сбрасываем placeholder обратно
    } catch (error) {
      setEncryptedText('Ошибка: ' + (error.message || 'что-то пошло не так'));
    }
  };
    const handleDragOver = (e) => {
      e.preventDefault(); // Необходимо для того, чтобы разрешить сброс
      setPlaceholder('вставьте файл сюда'); // Меняем placeholder у textarea
    };

  const handleDrop = (e) => {
    e.preventDefault();
    setPlaceholder('Введите текст'); // Возвращаем оригинальный placeholder

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      // Добавляем информацию о файле в состояние
      setFileInfo({
        name: file.name,
        size: file.size,
        type: file.type
      });

      const reader = new FileReader();
      reader.onload = event => {
        setInputText(event.target.result); // Содержимое файла
      };
      reader.readAsText(file);

      e.dataTransfer.clearData();
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    // Восстанавливаем состояния
    setPlaceholder('Введите текст');
    setFileInfo(null);
  };
  const handleDragEnter = (e) => {
    setPlaceholder('вставьте файл сюда');
  };

  const handleDecrypt = async () => {
    if (!inputText.trim()) {
      setInputError(true);
      setPlaceholder('Пожалуйста, введите текст!');
      setTimeout(() => setInputError(false), 500); // Скрываем ошибку через 0.5 секунды
      focusTextInput();
      return;
    }
    try {
      const data = await EncryptionService.decrypt(inputText);
      setOutputText(data.decrypted_message);
      setPlaceholder('Введите текст'); // Сбрасываем placeholder обратно
    } catch (error) {
      setEncryptedText("ошибка")
    }
  };
  

// функция для переключения видимости ключа
const toggleKeyVisibility = async () => {
  if (isKeyVisible) {
    // Начинаем анимацию скрытия
    setKeyAnimation('slide-out');
    // Даем время анимации завершиться перед сменой видимости
    setTimeout(() => {
      setIsKeyVisible(false)}, 500); // 500мс - время анимации в CSS
  } else {
    // Начинаем анимацию появления и делаем ключ видимым
    setIsKeyVisible(true);
    setKeyAnimation('slide-in');
    try {
      const data = await EncryptionService.getKey();
      setKeyText(data.encryption_key);
    } catch (error) {
      setKeyText('Ошибка: ' + (error.message || 'что-то пошло не так'));
    }
  }
};

// Обработчик для изменения ключа
  const handleChangeKey = async () => {
    if (!newKey.trim()) {
      shakeInput();
      setKeyPlaceholder('Не удалось поменять ключ');
      return;
    } try {
      const response = await EncryptionService.changeKey(newKey);
      if (response.error) {
        shakeInput();
        setKeyPlaceholder('Не удалось поменять ключ');
      } else {
        setKeyText(newKey);
        setNewKey('');
        setIsKeyVisible(true);
        setKeyPlaceholder('Ключи шифрования успешно изменены');
        fetchKeys();
        setTimeout(() => {
          setKeyPlaceholder('Введите новый ключ')}, 1500);
      }
    } catch (error) {
      shakeInput();
      setKeyPlaceholder('Ошибка: ' + (error.message || 'что-то пошло не так'));
    }
  };

  const handleEncryptError = async () =>{
    if (!outputText.trim()){
      setEncryptInputError(true);
      setEncryptError('Пустое поле!');
      setTimeout(() => setEncryptInputError(false), 500);
      setTimeout(() => setEncryptError('Зашифрованный / Расшифрованный текст'), 1500 )
    }
  };

  const handleGenerateKeys = async () => {
    try {
      const response = await EncryptionService.generateKeys();
      if (response.message) {
        // Теперь нужно получить ключи, так как они генерируются и хранятся в сессии на сервере
        const keysResponse = await EncryptionService.getKey();
        setKeys(keysResponse);
      }
    } catch (error) {
      console.error('Ошибка при генерации ключей:', error);
    }
  };

  return (
    <div id="app">
      <div id="title">
      <div id="RC5">Cipher McElice</div>
      <div id="authors">Разработано: </div>
      <div id='madeBy'>ShUE Team</div>
      </div>
      <div id='inputTextBlock' onDragOver={handleDragOver} onDrop={handleDrop} onDragEnter={handleDragOver} onDragLeave={handleDragLeave}>
        {fileInfo && (
            <div className="file-info">
              <strong>Файл:</strong> {fileInfo.name} ({(fileInfo.size / 1024).toFixed(1)} KB)
            </div>
        )}
        <textarea ref={inputRef}
                  type="text"
                  id="inputText"
                  placeholder={placeholder}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className={inputError ? 'input-error' : ''}
        />
        <button id="encryptButton" onClick={handleEncrypt}>Зашифровать</button>
        <button id="decryptButton" onClick={handleDecrypt}>Расшифровать</button>
      </div>

      <div id="encryptedTextContainer">
        <textarea ref={encryptedTextRef} type="text" placeholder={encryptError} id="encryptedText"
          value={outputText} className={inputEncryptError ? 'input-error' : ''} readOnly />
        <button id="toggleKeyButton" onClick={toggleKeyVisibility} title='Скрыть/показать ключ'
          className={isKeyVisible ? '' : ''}>{isKeyVisible ? 'Скрыть ключ' : 'Показать ключ'}
        </button>
        <button onClick={() => {copyToClipboard(encryptedTextRef); handleEncryptError()}}
          id ="encryptKeyButton" title='Копировать'>Копировать</button>
      </div>

      <div>
      <button onClick={handleGenerateKeys}>Генерировать ключи</button>
      <div id="keys">
        <p>Открытый ключ (Ghat): {keys.Ghat.join(', ')}</p>
        <p>Матрица перестановок (P): {keys.P.join(', ')}</p>
        <p>Подстановка (S): {keys.S.join(', ')}</p>
        <p>Проверочная матрица (H): {keys.H.join(', ')}</p>
      </div>
    </div>
        {isKeyVisible && (
        <div id="keyContainer" className={keyAnimation}>
          <textarea type="text" id='keyText' placeholder="Ключ неизвестен" ref={keyWord} value={key_word} readOnly/>
          <button onClick={() => copyToClipboard(keyWord)} id='copyKeyButton' title='Копировать'></button>
          <input type="text" placeholder={keyPlaceholder} value={newKey} id='changeKey' onChange={(e) => setNewKey(e.target.value)}
            className={keyError ? 'shake-animation1' : ''}/>
          <button onClick={handleChangeKey} id='changeButton' title='Изменить ключ'></button>
        </div>
      )}
      </div>
  );
}

export default App;
