// App.js
import React, { useState, useRef } from 'react';
import './App.css';
import EncryptionService from './EncryptionService';

function App() {
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
        setKeyPlaceholder('Ключ изменен успешно!');
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

  return (
    <div id="app">
      <div id="title">
      <div id="RC5">Cipher McElice</div>
      <div id="authors">Разработано: </div>
      <div id='madeBy'>ShUE Team</div>
      </div>
      <div id='inputTextBlock'>
      <textarea ref={inputRef} type="text" id="inputText" placeholder={placeholder} value={inputText}
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
