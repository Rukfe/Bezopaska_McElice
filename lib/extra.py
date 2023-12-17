import numpy as np

def strtobin(str):
    # Конвертация строки в бинарное представление
    # Преобразование каждого символа строки в 8-битное бинарное представление
    bin = ''.join(format(ord(i), '08b') for i in str)
    # Преобразование бинарной строки в список целых чисел
    intbin = [int(x) for x in bin]
    return np.array(intbin)
    
def bintostr(bits):
    # Конвертация бинарного представления в строку
    # Преобразование списка бит в строку
    binary_str = ''.join(str(int(bit)) for bit in bits)
    # Преобразование 8-битных блоков в символы
    chars = [chr(int(binary_str[i:i+8], 2)) for i in range(0, len(binary_str), 8)]
    result_str = ''.join(chars)
    return result_str

def split_to_encrypt(message):
    # Разбиение сообщения для шифрования
    arr_length = len(message)
    remainder = arr_length % 4
    if remainder != 0:
        padding = [0] * (4 - remainder)
        # Добавление нулевых битов для выравнивания по 4-битным блокам
        message = np.concatenate((message, padding), axis=0)
    # Преобразование длины сообщения в бинарную строку из 32 бит
    length_binary = format(arr_length, '032b')
    # Преобразование бинарной строки в список целых чисел
    length_binary_list = [int(x) for x in length_binary]
    # Добавление длины сообщения в начало
    message = np.concatenate((length_binary_list, message), axis=0)
    # Разбиение на 4-битные блоки
    split_arrays = np.split(message, len(message) // 4)
    return split_arrays

def split_to_decrypt(message):
    # Разбиение сообщения для дешифрования
    # Разбиение на 7-битные блоки
    split_arrays = np.split(message, len(message) // 7)
    return split_arrays