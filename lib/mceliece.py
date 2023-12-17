import numpy as np
from lib import encoder
from lib import decoder
from lib import keygen
from lib import extra

def generate_keys():
    # Генерация открытого и закрытого ключей
    testmessage = 'Key Test'
    flag = False
    while flag == False:
        (Ghat, S, P, H) = keygen.keygen()
        testencrypt = encrypt(testmessage, Ghat)
        testdecrypt = decrypt(testencrypt, S, P, H)
        if (testdecrypt == testmessage):
            flag = True
    return (Ghat, S, P, H)

def encrypt(message, g_prime):
    # Шифрование сообщения
    # Преобразование строки в бинарное представление и разбиение для шифрования
    mesbin = extra.split_to_encrypt(extra.strtobin(message))
    temp = np.array([])
    for arr in mesbin:
        # Шифрование каждого блока бинарного представления
        temp = np.append(temp, encoder.encode(arr, g_prime))
    return temp

def decrypt(encoded, S, P, H):
    # Расшифровка сообщения
    # Разбиение для дешифрования
    mesbin = extra.split_to_decrypt(encoded)
    temp = np.array([])
    for arr in mesbin:
        # Дешифрование каждого блока
        temp = np.append(temp, decoder.decode(arr, S, P, H))
    binary_str = ''.join(str(int(bit)) for bit in temp)
    # Извлечение длины сообщения
    length_binary = ''.join(map(str, binary_str[:32]))
    length = int(length_binary, 2)
    # Извлечение сообщения
    message_array = temp[32:32 + length]
    # Преобразование бинарного представления в строку
    result = extra.bintostr(message_array)
    return result