import numpy as np
import math

def decode(c, S, P, H):
    # Декодирование сообщения
    # Расшифровка с использованием матриц P, S и H
    decrypted = decrypt(P, S, c, H)
    return decrypted

def decrypt(P, S, c, H):
    # Расшифровка сообщения с использованием инверсий матриц P и S, а также коррекции ошибок с использованием H
    P_inv = np.linalg.inv(P)
    S_inv = np.linalg.inv(S)
    c_prime = np.matmul(c, P_inv)
    m_prime = error_correction(c_prime, H) # Коррекция ошибок
    decrypted = np.matmul(m_prime, S_inv) % 2
    return decrypted

def error_correction(c_prime, H):
    # Коррекция ошибок с использованием матрицы H
    # Проверка наличия ошибок
    parity = np.matmul(c_prime, np.transpose(H)) % 2
    parity_bits = np.ma.size(parity, 0)
    parity_total = 0
    for i in range(parity_bits):
        parity_total += 2**i * parity[i]
    if (int((parity_total - 1)) & int(parity_total)) == 0: # Проверка четности
        # Если четно, возвращаем исходное сообщение без битов четности
        return c_prime[0:(c_prime.size - parity_bits)]
    else:
        error_message = c_prime
        error_bit = int(parity_total - math.ceil(np.log2(parity_total)) - 1)
        # Если обнаружена нечетность, исправляем ошибку
        if error_message[error_bit] == 1:
            error_message[error_bit] = 0
            return error_message[0:(c_prime.size - parity_bits)]
        elif error_message[error_bit] == 0:
                error_message[error_bit] = 1
                return error_message[0:(c_prime.size - parity_bits)]
        else:
            print("Broken.")