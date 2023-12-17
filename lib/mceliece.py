import numpy as np
import encoder
import decoder
import keygen
import extra

def generate_keys():
    # Генерация открытого и закрытого ключей
    return keygen.keygen()

def encrypt(message, g_prime):
    # Шифрование сообщения
    # Преобразование строки в бинарное представление и разбиение для шифрования
    mesbin = extra.split_to_encrypt(extra.strtobin(message))
    temp = np.array([])
    for arr in mesbin:
        # Шифрование каждого блока бинарного представления
        temp = np.append(temp, encoder.encode(arr, g_prime))
    return temp

def decrypt(encoded, S, P, paritycheck):
    # Расшифровка сообщения
    # Разбиение для дешифрования
    mesbin = extra.split_to_decrypt(encoded)
    temp = np.array([])
    for arr in mesbin:
        # Дешифрование каждого блока
        temp = np.append(temp, decoder.decode(arr, S, P, paritycheck))
    binary_str = ''.join(str(int(bit)) for bit in temp)
    # Извлечение длины сообщения
    length_binary = ''.join(map(str, binary_str[:32]))
    length = int(length_binary, 2)
    # Извлечение сообщения
    message_array = temp[32:32 + length]
    # Преобразование бинарного представления в строку
    result = extra.bintostr(message_array)
    return result