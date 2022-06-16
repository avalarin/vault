import crypto from 'crypto-js'

class Utf8Encoder {
    private encoder = new TextDecoder("utf-8")

    stringify(wordArray: crypto.lib.WordArray): string {
        var words = wordArray.words;
        var bytes = [];
        for (var i = 0; i < wordArray.sigBytes; i++) {
            var byte = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff
            bytes.push(byte)
        }
        return this.encoder.decode(new Uint8Array(bytes))
    }
    
    parse(str: string): crypto.lib.WordArray {
        const bytes = new TextEncoder().encode(str)
        const words: number[] = []
        for (var i = 0; i < bytes.length; i++) {
            words[i >>> 2] |= (bytes[i] & 0xff) << (24 - (i % 4) * 8);
        }
        return crypto.lib.WordArray.create(words, bytes.length)
    }
}

export const Utf8 = new Utf8Encoder()
