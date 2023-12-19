from flask import Flask, request, session, jsonify
import lib.mceliece as mceliece
import numpy as np

app = Flask(__name__, static_folder="mc_elice/build", static_url_path='')
app.secret_key = 'sh_u_e_new'  # Новый секретный ключ


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/generate_keys', methods=['GET'])
def generate_encryption_keys():
    Ghat, S, P, H = mceliece.generate_keys()
    session['Ghat'] = Ghat.tolist()
    session['S'] = S.tolist()
    session['P'] = P.tolist()
    session['H'] = H.tolist()
    return jsonify({'message': 'Ключи успешно сгенерированы'})


@app.route('/encrypt', methods=['POST'])
def encrypt_message():
    message = request.json['message']
    Ghat = session.get('Ghat')
    if Ghat is None:
        return jsonify({'error': 'Открытый ключ шифрования отсутствует'}), 400
    encrypted_message = mceliece.encrypt(message, np.array(Ghat))
    return jsonify({'encrypted_message': encrypted_message.tolist()})


@app.route('/decrypt', methods=['POST'])
def decrypt_message():
    message = request.json['message']
    S = session.get('S')
    P = session.get('P')
    H = session.get('H')
    if None in [S, P, H]:
        return jsonify({'error': 'Закрытый ключ шифрования отсутствует'}), 400
    decrypted_message = mceliece.decrypt(np.array(message), np.array(S), np.array(P), np.array(H))
    return jsonify({'decrypted_message': decrypted_message})


@app.route('/get_key', methods=['GET'])
def get_encryption_key():
    keys = {'Ghat': session.get('Ghat', []),
             'S': session.get('S', []),
             'P': session.get('P', []),
             'H': session.get('H', [])}
    return jsonify(keys)


@app.route('/change_key', methods=['POST'])
def change_encryption_key():
    # Для McEliece ключи должны быть сгенерированы заново, так как они не выбираются пользователем
    Ghat, S, P, H = mceliece.generate_keys()
    session['Ghat'] = Ghat.tolist()
    session['S'] = S.tolist()
    session['P'] = P.tolist()
    session['H'] = H.tolist()
    return jsonify({'message': 'Ключи шифрования успешно изменены'})


if __name__ == '__main__':
    app.run()