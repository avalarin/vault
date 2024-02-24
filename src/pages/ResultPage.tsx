import { useEffect, useState } from 'react'
import { Card, CardBody, Box, Button, Text } from 'grommet'
import { Print, Insecure, Next } from 'grommet-icons'
import QRCode from 'react-qr-code'
import { ErrorBoundary, Message, QRCodeReliabilitySelect } from '../components'
import { ICryptoService } from '../services/crypto'
import { IUrlService } from '../services'
import { IContainer } from '../services/crypto'
import { QRCorrectionLevelCode, QRCorrectionLevels } from '../utils/qr'

export interface IResultPageProps {
    data: string,
    goToDecode: (container: IContainer) => void,
    goToUsage?: ((container: IContainer) => void) | null,
    cryptoService: ICryptoService,
    urlService: IUrlService
}

function printQrCode(data: IContainer, qrCodeElementId: string, size: string){
    var qrCode = document.getElementById(qrCodeElementId)
    if (!qrCode) return

    var printWindow = window.open('', '', 'width=900,height=650')
    if (!printWindow) return

    printWindow.document.write(`<div style="max-width: ${size}; padding: 8px; border: dotted 1px black;">`)
    printWindow.document.write('<div style="font-family: monospace; font-size: 14px; margin-bottom: 8px;">')
    printWindow.document.write('<span>Created on ', data.createdAt.toDateString(), '</span>')
    if (data.comment) {
        printWindow.document.write('<br/><span>Comment: ', data.comment, '</span>')
    }
    printWindow.document.write('</div>')
    printWindow.document.write(qrCode.innerHTML)
    printWindow.document.write('</div>')
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
}

const ErrorBox = (props: {error: any}) => <Box justify="center" align="center">
    <Card>
        <CardBody pad="medium" >
            <Message type="error">
                Error: {props.error}
            </Message>
        </CardBody>
    </Card>
</Box>

export const ResultPage = (props: IResultPageProps) => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [url, setUrl] = useState<string | null>(null)
    const [container, setContainer] = useState<IContainer | null>(null)
    const [correctionLevel, setCorrectionLevel] = useState<QRCorrectionLevelCode>('L')
    const [maxCorrectionLevel, setMaxCorrectionLevel] = useState<QRCorrectionLevelCode>('H')
    
    useEffect(() => {
        const container = props.cryptoService.parseContainer(props.data, 'base64')
        if (!container || !container.valid) {
            setLoading(false)
            setError('unable to parse data')
            return
        }
        
        const url = props.urlService.formUrl(container)
        setContainer(container)
        setUrl(url)

        const max = QRCorrectionLevels.findMaxAvailableLevel(url.length)
        if (!max) {
            setLoading(false)
            setError('unable to create qr')
            return
        }

        setMaxCorrectionLevel(max.code)
        setCorrectionLevel(max.code)
        setLoading(false)
    }, [props.data, props.cryptoService, props.urlService])

    if (loading) {
        return <></>
    }

    if (error) {
        return <ErrorBox error={error} />
    }

    if (!url || !container) {
        throw new Error('unexpected state')
    }

    return <Box justify="center" align="center">
        <Box>
            <Box pad="medium">
                <Box style={{ maxWidth: '320px' }}>
                    <Text>Size: {url.length} bytes</Text>
                    <QRCodeReliabilitySelect maxAvailable={maxCorrectionLevel} value={correctionLevel} onChange={setCorrectionLevel} />
                </Box>
            </Box>

            <Card>
                <CardBody pad="medium" >
                    <Box style={{ maxWidth: '320px' }}>
                        <Box pad={{ bottom: 'small' }}>
                            <Text>Created on {container.createdAt.toDateString()}</Text>
                            { container.comment && <Text>Comment: {container.comment}</Text> }
                        </Box>
                        <Box id="qrcode" pad={{ bottom: 'small' }}>
                            <ErrorBoundary key={correctionLevel} handle={() => 'failed to render qr code'}>
                                <QRCode size={320} level={correctionLevel} value={url} />
                            </ErrorBoundary>
                        </Box>
                    </Box>

                    <Box direction="row" gap="small">
                        <Button primary icon={<Insecure size="small" />} label="decrypt" onClick={() => props.goToDecode(container)} />
                        <Button primary icon={<Print size="small" />} label="print" onClick={() => printQrCode(container, 'qrcode', '320px')} />
                        { props.goToUsage && 
                            <Button primary icon={<Next size="small" />} label="next" onClick={() => props.goToUsage!(container)} />
                        }
                    </Box>
                </CardBody>
            </Card>
        </Box>
    </Box>
}
