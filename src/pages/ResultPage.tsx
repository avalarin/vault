import { Card, CardBody, Box, Button, Text } from 'grommet'
import QRCode from 'react-qr-code'
import { Message } from '../components'
import { ICryptoService } from '../services'
import { IValidationResult } from '../services/crypto'

export interface IResultPageProps {
    urlBase: string,
    data: string,
    goToDecode: (data: string) => void,
    cryptoService: ICryptoService
}

function printQrCode(data: IValidationResult, qrCodeElementId: string){
    var qrCode = document.getElementById(qrCodeElementId)
    if (!qrCode) return

    var printWindow = window.open('', '', 'width=900,height=650')
    if (!printWindow) return

    printWindow.document.write('<div style="max-width: 256px; padding: 8px; border: dotted 1px black;">')
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

export const ResultPage = (props: IResultPageProps) => {
    const url = `${props.urlBase}/qr/decrypt?data=${props.data}`
    const dataObj = props.cryptoService.validate(props.data)

    if (!dataObj.valid) {
        return  <Box justify="center" align="center">
            <Card>
                <CardBody pad="medium" >
                    <Message type="error">
                        Error: unable to parse data
                    </Message>
                </CardBody>
            </Card>
        </Box>
    }

    return <Box justify="center" align="center">
        <Card>
            <CardBody pad="medium" >
                <div>
                    <Box pad={{ bottom: 'small' }} style={{ maxWidth: '256px' }}>
                        <Text>Created on {dataObj.createdAt.toDateString()}</Text>
                        { dataObj.comment && <Text>Comment: {dataObj.comment}</Text> }
                    </Box>
                    <Box id="qrcode" pad={{ bottom: 'small' }}>
                        <QRCode value={url} />
                    </Box>
                </div>
                <Box direction="row" gap="medium">
                    <Button primary label="decode" onClick={() => props.goToDecode(props.data)} />
                    <Button primary label="print" onClick={() => printQrCode(dataObj, 'qrcode')} />
                </Box>
            </CardBody>
        </Card>
    </Box>
}
