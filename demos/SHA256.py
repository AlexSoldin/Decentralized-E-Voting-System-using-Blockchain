import hashlib

def encrypt(encryption_string):
    signatures = []
    for value in encryption_string:
        sha_signature = hashlib.sha256(value.encode()).hexdigest()
        signatures.append(sha_signature)
        print(f'{value}: {sha_signature}')
    return signatures

encryption_string = ['Data', 'data']
output_hash = encrypt(encryption_string)
print(output_hash)