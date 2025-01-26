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