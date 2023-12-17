import numpy as np

def keygen():
    # Параметры криптосистемы МакЭлиса
    kgen = 3
    k = 2**kgen - kgen - 1
    n = 2**kgen - 1

    # Генерация ключей
    (G, paritycheck) = getGoppa(kgen, k)
    S = genInvertibleMatrix(k)
    P = genPermuteMatrix(n)
    Gcarat = np.matmul(np.matmul(S, G), P) % 2 # Вычисление открытого ключа
    return (Gcarat, S, P, paritycheck)

def getGoppa(kgen, k):
    # Создание идентичности
    identity = np.identity(kgen)
    identityk = np.identity(k)

    # Формирование матрицы left
    left = np.zeros((kgen, 2**kgen - 1 - kgen)).T
    rowcount = 0
    for i in range(2**kgen):
        if i + 1 != 1:
            if (i + 1) & i != 0:
                # Представление числа в бинарной форме
                binarystring = np.binary_repr(i+1)
                column = np.zeros((len(binarystring), 1))
                for i in range(len(binarystring)):
                    column[-i - 1] = binarystring[i]
                # Дополнение нулями до нужной длины
                column = np.pad(column, (0, kgen - len(binarystring)), 'constant')
                left[rowcount] = column.T[0]
                rowcount += 1
    left = left.T

    # Построение матрицы проверки четности и генератора
    paritycheck = np.block([left, identity])
    generator = np.block([identityk, np.transpose(left)])
    return (generator, paritycheck)

def genInvertibleMatrix(k):
    # Генерация случайной обратимой матрицы
    S = np.random.randint(0,2,(k, k), dtype=np.uint)
    while np.linalg.det(S) == 0:
        S = np.random.randint(0,2,(k, k), dtype=np.uint)
    return S

def genPermuteMatrix(n):
    # Генерация случайной перестановочной матрицы
    P = np.identity(n, dtype=np.uint)
    return P[np.random.permutation(n)]
