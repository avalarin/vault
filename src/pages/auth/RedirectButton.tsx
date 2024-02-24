import { Button } from 'grommet'

export interface IRedirectButtonProps {
    url: string,
    params: { [key: string]: string },
    buttonTitle: string
}

export const RedirectButton = (props: IRedirectButtonProps) => {
    return <form id='auth' method='GET' action={props.url}>
        { Object.entries(props.params).map(([k, v], index) => <input key={index} type='hidden' name={k} value={v} />) }
        <Button primary type='submit' form='auth' label={props.buttonTitle} />
    </form>
}
