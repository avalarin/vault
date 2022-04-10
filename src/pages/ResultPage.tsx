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

export const ResultPage = (props: IResultPageProps) => {
    const url = `${props.urlBase}/decrypt?data=${props.data}`
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
                { dataObj.comment && <Box pad={{ bottom: 'small' }}>
                    <Text>{dataObj.comment}</Text>
                </Box> }
                <Box pad={{ bottom: 'small' }}>
                    <QRCode value={url} />
                </Box>
                <Box direction="row" gap="medium">
                    <Button primary label="decode" onClick={() => props.goToDecode(props.data)} />
                    <Button primary label="print" />
                </Box>
            </CardBody>
        </Card>
    </Box>
}
