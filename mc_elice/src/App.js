import React, { useState, useEffect } from 'react';
import * as API from './API';
import './App.css'

const App = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [outputMessage, setOutputMessage] = useState('');
  const [inputPlaceholder, setInputPlaceholder] = useState('Введите текст');
  const [outputPlaceholder, setOutputPlaceholder] = useState('Зашифрованный / Расшифрованный текст');
  const [isShakingInput, setIsShakingInput] = useState(false);
  const [isShakingOutput, setIsShakingOutput] = useState(false);
  const [isShakingImgOutput, setIsShakingImgOutput] = useState(false);
  const [isShakingImgInput, setIsShakingImgInput] = useState(false);
  const [keys, setKeys] = useState(null);
  const [showKeys, setShowKeys] = useState(false); // Для отображения/скрытия ключей
  const [imageBase64, setImageBase64] = useState('');
  const [encryptedImage, setEncryptedImage] = useState('');
  const [decryptionInput, setDecryptionInput] = useState(''); // для второго textarea
  const [errorMsg, setErrorMsg] = useState('');
  const [errorMsgInputImg, setErrorMsgInputImg] = useState('')
  const [activeBlock, setActiveBlock] = useState('textWork'); // 'textWork' или 'imgWork'
  const keyWorkClasses = `keyWork${showKeys ? ' keyWorkVisible' : ''}`;

  const handleEncrypt = async () => {
    if (!inputMessage.trim()) {
      setInputPlaceholder('Пустое поле!')
      setIsShakingInput(true);
      setTimeout(() => setIsShakingInput(false), 500);
      setTimeout(() => {setInputPlaceholder('Введите текст')}, 1500)
      return;
    }
    try {
      const response = await API.encryptMessage(inputMessage);
      setOutputMessage(response.data.encrypted_message.join(', '));
    } catch (error) {
      console.error('Encryption error:', error.response?.data);
    }
  };

  const handleDecrypt = async () => {
    if (!outputMessage.trim()) {
      setInputPlaceholder('Пустое поле!')
        setIsShakingInput(true);
        setTimeout(() => setIsShakingInput(false), 500);
        setTimeout(() => {setInputPlaceholder('Зашифрованный / Расшифрованный текст')}, 1500);

      return;
    } try {
      const response = await API.decryptMessage(inputMessage.split(', ').map(Number));
      setOutputMessage(response.data.decrypted_message);
    } catch (error) {
      console.error('Decryption error:', error.response?.data);
    }
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    if (inputPlaceholder !== 'Enter your message or encrypted data here...') {
      setInputPlaceholder('Enter your message or encrypted data here...');
    }
  };

    // Функция для генерации ключей
    const handleGenerateKeys = async () => {
      try {
        const response = await fetch('/generate_keys');
        
        if (response.ok) {
          // Запрашиваем новые ключи
          const newKeysResponse = await fetch('/get_key');
          if (newKeysResponse.ok) {
            const data = await newKeysResponse.json();
            setKeys(data);
            console.log('Ключи сгенерированы и обновлены');
          } else {
            throw new Error('Ошибка при получении новых ключей');
          }
        } else {
          throw new Error('Ошибка при генерации ключей');
        }
      } catch (error) {
        console.error('Error generating keys:', error);
      }
    };
  // Вызываем генерацию ключей при монтировании компонента
  useEffect(() => {
    handleGenerateKeys();
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileContent = e.target.result;
      setInputMessage(fileContent);
    };
    reader.readAsText(file);
  };

// Конвертация файла в Base64 и сохранение в state
  function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageBase64(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

// Функция для шифрования данных изображения
const handleEncryptImage = async () => {
  if (!imageBase64) {
    setErrorMsg('Вы не вставили картинку!')
    setIsShakingImgOutput(true);
    setTimeout(() => setIsShakingImgOutput(false), 500);
    setTimeout(() => {
      setErrorMsg('Зашифрованное изображение')}, 1500)
    } else {
      setErrorMsg('Подождите...')
      // Stripping out the header from data URL: 'data:image/png;base64,....'
      const base64Data = imageBase64.split(',')[1];
      try {
        const response = await API.encryptMessage(base64Data);
        setEncryptedImage(response.data.encrypted_message.join(', '));
      } catch (error) {
        console.error('Encryption error:', error.response?.data);
      }}
  };

// Функция для расшифровки данных и получения изображения
  async function handleDecryptImage() {
    if (!encryptedImage){
      setErrorMsgInputImg('Пустое поле!');
      setIsShakingImgInput(true);
      setTimeout(() => {
        setErrorMsgInputImg('Введите исходный зашифрованный массив здесь...')
      }, 1500);
      setTimeout(() => setIsShakingImgInput(false), 500);
    } else {
      setDecryptionInput('Подождите...')
      const encryptedDataArray = decryptionInput.split(',').map(Number);
      
      try {
        const response = await API.decryptMessage(encryptedDataArray);
        const decryptedImageBase64 = `data:image/jpeg;base64,${response.data.decrypted_message}`;
        // Создание ссылки для скачивания файла
        
        const downloadLink = document.createElement("a");
        downloadLink.href = decryptedImageBase64;
        downloadLink.download = "decrypted_image.jpg";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        setDecryptionInput('Изображение расшифровано!')
      } catch (error) {
        console.error('Decryption error:', error.response?.data);
      }
    }};
    // Функция для копирования текста
  function copyToClipboard(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(
        () => console.log('Содержимое скопировано в буфер обмена!'),
        (err) => console.error('Ошибка при копировании текста: ', err)
      );
    } else {
      console.log('navigator.clipboard не поддерживается вашим браузером.');
    }
  }

  const handleSwitchToImageWork = () => {
    setActiveBlock('imgWork');
  };

  const handleSwitchToTextWork = () => {
    setActiveBlock('textWork');
  };

  return (
    <div>
      <div className={activeBlock === 'textWork' ? 'textWork active' : 'textWork offscreen-right'}>
        <textarea id = 'inputText'
        className={isShakingInput ? 'shake-animation' : ''}
        value={inputMessage}
        onChange={handleInputChange}
        placeholder={inputPlaceholder}
        />
        <button id='textEncryptBtn' onClick={handleEncrypt}>Зашифровать</button>
        <button id='textDecryptBtn' onClick={handleDecrypt}>Расшифровать</button>
        <textarea id='outputText'
        className={isShakingOutput ? 'shake-animation' : ''}
        readOnly
        value={outputMessage}
        placeholder={outputPlaceholder}
      />
      <button id='decryptCopyBtn' onClick={() => copyToClipboard(outputMessage)}>Копировать</button>
      <button id='keysBtn' onClick={() => setShowKeys(prevShowKeys => !prevShowKeys)}>
          {showKeys ? 'Спрятать ключи' : 'Показать ключи'}
          </button>
          <input id='selectFileTxt' type="file" name='file' accept=".txt" onChange={handleFileUpload} />
          <button id='changeBlockImg' onClick={handleSwitchToImageWork}>
          Переключиться в режим работы с изображением
        </button>
      </div>

      <div className={activeBlock === 'imgWork' ? 'imgWork active' : 'imgWork offscreen-left'}>
        <input id='selectFileImg' type="file" accept="image/*" onChange={handleImageUpload} ></input>
        <button id='imgEncryptBtn' onClick={handleEncryptImage}>Зашифровать</button>
        <textarea id='inputImg'
        placeholder={errorMsg || 'Зашифрованное изображение'}
        value={encryptedImage}
        className={isShakingImgOutput ? 'shake-animation' : ''}
        readOnly/>
        <button id='encryptCopyBtn' onClick={() => copyToClipboard(encryptedImage)}>Копировать</button>
        <textarea id='outputImg'
        placeholder={errorMsgInputImg ||'Введите исходный зашифрованный массив здесь...'}
        className={isShakingImgInput ? 'shake-animation' :  ''}
        value={decryptionInput}
        onChange={(e) => setDecryptionInput(e.target.value)}/>
        <button id='imgDecryptBtn' onClick={handleDecryptImage}>Расшифровать</button>
        <button id='keysImgBtn' onClick={() => setShowKeys(prevShowKeys => !prevShowKeys)}>
          {showKeys ? 'Спрятать ключи' : 'Показать ключи'}
          </button>
          <button id='changeBlockText' onClick={handleSwitchToTextWork}>
          Переключиться в режим работы с текстом
        </button>
      </div>

      <div div className={keyWorkClasses}>
          {showKeys && keys && (
          <div>
            <button onClick={handleGenerateKeys}>Пересоздать ключи</button>
            {Object.entries(keys).map(([keyName, keyValue]) => (
            <div key={keyName}>
              <strong>{keyName}:</strong>
              <textarea id='keyArea' readOnly value={keyValue.join(', ')} />
              <button onClick={() => copyToClipboard(keyValue.join(', '))}>Копировать</button>
              </div>)
            )}
          </div>
          )}
        </div>
    </div>
  );
};
export default App;