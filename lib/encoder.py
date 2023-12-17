import numpy as np

def encode(m, g_prime, t=1):
    # Функция кодирования сообщения
    message = m
    (_,n) = g_prime.shape
    z = generate_errors(n, t) # Генерация случайных ошибок
    # Кодирование с использованием входного сообщения, матрицы g_prime и ошибок
    (encoded,_) = encoder(message, g_prime, z)
    return encoded

def generate_errors(n, t):
    # Генерация случайных ошибок
    z = np.zeros(n)
    # Выбор t случайных позиций без повторений
    idx_list = np.random.choice(n, t, replace=False)
    for idx in idx_list:
        z[idx] = 1
    return z

def encoder(message, g_prime, z):
    # Кодирование сообщения с использованием матрицы g_prime и ошибок z
    # Произведение матрицы сообщения на g_prime по модулю 2
    c_prime = np.matmul(message, g_prime) % 2
    # Добавление ошибок и взятие по модулю 2
    c = (c_prime + z) % 2
    return (c, c_prime)
