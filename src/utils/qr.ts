export type QRCorrectionLevelCode = 'L' | 'M' | 'Q' | 'H'

export interface IQRCorrectionLevel {
    code: QRCorrectionLevelCode,
    level: number,
    label: string,
    percent: number,
    maxBytes: number,

    compare(b: IQRCorrectionLevel): number
    toString(): string
}

class QRCorrectionLevel implements IQRCorrectionLevel {
    constructor(
        public code: QRCorrectionLevelCode,
        public level: number,
        public label: string,
        public percent: number,
        public maxBytes: number
    ) {}

    compare(b: IQRCorrectionLevel): number {
        if (this.level < b.level) return -1
        if (this.level > b.level) return 1
        return 0
    }

    toString() {
        return `Level ${this.code} (${this.label}) ${this.percent}% of data bytes can be restored`
    }
}

export const L = new QRCorrectionLevel('L', 0,  'Low',      7,  2956)
export const M = new QRCorrectionLevel('M', 20, 'Medium',   15, 2334)
export const Q = new QRCorrectionLevel('Q', 50, 'Quartile', 25, 1666)
export const H = new QRCorrectionLevel('H', 70, 'High',     30, 1276)

class QRCorrectionLevelsArray {
    public levels: IQRCorrectionLevel[] = [L, M, Q, H]

    private levelsMap = new Map<QRCorrectionLevelCode, IQRCorrectionLevel>(this.levels.map(l => [l.code, l]))

    public minLevel: IQRCorrectionLevel = this.levels.sort((a, b) => a.compare(b))[0]

    findMaxAvailableLevel(dataSize: number): IQRCorrectionLevel | null {
        return this.levels.filter(l => l.maxBytes > dataSize).slice(-1)[0]
    }

    findByCode(code: QRCorrectionLevelCode): IQRCorrectionLevel {
        const level = this.levelsMap.get(code)
        if (!level) {
            throw new Error(`Unknown QR correction level ${code}`)
        }
        return level
    }
}

export const QRCorrectionLevels = new QRCorrectionLevelsArray()
