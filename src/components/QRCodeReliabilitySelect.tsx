import { Box, Button, Text } from 'grommet'
import {IQRCorrectionLevel, QRCorrectionLevelCode, QRCorrectionLevels} from '../utils/qr'

export interface IQRCodeReliabilitySelectProps {
    maxAvailable: QRCorrectionLevelCode,
    value: QRCorrectionLevelCode,
    onChange: (value: QRCorrectionLevelCode) => void
}
const isGreaterThan = (a: IQRCorrectionLevel, b: IQRCorrectionLevel) => { return a.compare(b) > 0 }

export const QRCodeReliabilitySelect = (props: IQRCodeReliabilitySelectProps) => {
    const max = QRCorrectionLevels.findByCode(props.maxAvailable)
    const current = QRCorrectionLevels.findByCode(props.value)

    return <>
        <Box direction="row" gap="small" align="center">
            <Text>QR correction level: </Text>
            {QRCorrectionLevels.levels.map(value => {
                return <Button key={value.code} size="small" 
                    primary={value.compare(current) === 0} 
                    disabled={isGreaterThan(value, max)} 
                    label={value.code} 
                    onClick={() => props.onChange(value.code)}
                />
            })}
        </Box>
        <Text size="small">{current.toString()}</Text>
    </>
}
