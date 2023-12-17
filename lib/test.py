import mceliece as mc

message = 'Hamuda habibi hamud hamuda habibi'
#---------------------------------------------------------------
(g_prime, S, P, paritycheck) = mc.generate_keys()
#---------------------------------------------------------------
encoded = mc.encrypt(message, g_prime)
#---------------------------------------------------------------
decoded = mc.decrypt(encoded, S, P, paritycheck)
#---------------------------------------------------------------
print(decoded)