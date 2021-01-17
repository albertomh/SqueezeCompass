#
# Alberto MH 2021
#


class Util():
    def __init__(self):
        pass

    @staticmethod
    def encode_url(url: str) -> list:
        return list(map(bin, bytearray(url, 'utf8')))

    @staticmethod
    def decode_url(source: list) -> str:
        return ''.join([chr(int(f"00{c[2:]}", 2)) for c in source])
