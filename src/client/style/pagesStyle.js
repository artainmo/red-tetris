import { colors } from "./colors"
import { redOctoberRegular } from "../style/fonts";

export const redStyle = {
    color: colors.sovietRed,
    ...redOctoberRegular,
    fontSize: '72px',
    margin: 0,
    padding: 0,
}

export const whiteStyle = {
    color: colors.white,
    ...redOctoberRegular,
    fontSize: '72px',
    margin: 0,
    padding: 0,
}

export const logoRedStyle = {
    color: colors.sovietRed,
    ...redOctoberRegular,
    fontSize: '1.5rem',
    margin: 0,
    padding: 0,
}

export const logoWhiteStyle = {
    color: colors.white,
    ...redOctoberRegular,
    fontSize: '1.5rem',
    margin: 0,
    padding: 0,
}

export const welcomeWhiteStyle = {
    color: colors.white,
    ...redOctoberRegular,
    fontSize: '2rem',
    margin: 'auto',
    padding: 0,
}

export const redContainerStyle = {
    width: '100%',
    display: 'flex',
    /*justifyContent: 'flex-end',*/
    alignItems: 'center',
    margin: 0
}

export const startButtonContainerStyle = {
    width: '100%',
    height: '40px',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center'
}

export const pageMainContainerStyle = {
    width: '100vw',
    height: '100vh',
    backgroundColor: colors.backgroundDarkGrey,
    padding: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    boxSizing: 'border-box',
}