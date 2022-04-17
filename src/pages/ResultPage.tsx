import { Card, CardBody, Box, Button, Text } from 'grommet'
import QRCode from 'react-qr-code'
import { Message } from '../components'
import { ICryptoService } from '../services'

export interface IResultPageProps {
    urlBase: string,
    data: string,
    goToDecode: (data: string) => void,
    cryptoService: ICryptoService
}

function printPageArea(areaID: string){
    var printContent = document.getElementById(areaID)
    if (!printContent) return
    var printWindow = window.open('', '', 'width=900,height=650')
    if (!printWindow) return
    printWindow.document.write(printContent.innerHTML)
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
                <div id="printArea">
                    { dataObj.comment && <Box pad={{ bottom: 'small' }}>
                        <Text>{dataObj.comment}</Text>
                    </Box> }
                    <Box pad={{ bottom: 'small' }}>
                        <QRCode value={url} />
                    </Box>
                </div>
                <Box direction="row" gap="medium">
                    <Button primary label="decode" onClick={() => props.goToDecode(props.data)} />
                    <Button primary label="print" onClick={() => printPageArea("printArea")} />
                </Box>
            </CardBody>
        </Card>
    </Box>
}
