import { atom, useRecoilState } from "recoil"
import { recoilPersist } from "recoil-persist"

const { persistAtom } = recoilPersist()

const CURRENCIES = ['ETH', 'USD', 'BTC']
const BASE_CURRENCIES = [...CURRENCIES, 'SOL']

const conversionsState = atom({
    key: 'conversions',
    default: {
        USD: 1
    }
})
const targetCurrencyState = atom({
    key: 'targetCurrency',
    default: 'ETH',
    effects_UNSTABLE: [persistAtom],
})

const useCurrencyConverter = () => {
    const [conversions, setConversions] = useRecoilState(conversionsState)
    const [targetCurrency, setTargetCurrency] = useRecoilState(targetCurrencyState)

    for (const currency of BASE_CURRENCIES) {
        if (conversions[currency] === undefined && currency != 'USD') {
            setConversions(currentConversions => ({...currentConversions, [currency]: null})) // To prevent querying again
            fetch(`https://api.coinbase.com/v2/prices/${currency}-USD/buy`)
                .then(res => res.json())
                .then(res => 
                    setConversions(currentConversions => ({...currentConversions, [currency]: parseFloat(res.data.amount)}))
                )
        }
    }

    const convert = (value, from, to) => {
        if (value === undefined || value === null) {
            return value
        }
        if (to === undefined) {
            to = targetCurrency
        }

        if (from == to) {
            return value + ' ' + to
        }

        /*if (!CURRENCIES.includes(from)) {
            throw new Error(`from currency "${from}" not among list of currencies.`)
        }
        if (!CURRENCIES.includes(to)) {
            throw new Error(`to currency "${to}" not among list of currencies.`)
        }*/
        if (!BASE_CURRENCIES.includes(from) || !BASE_CURRENCIES.includes(to)) {
            return value + ' ' + from
        }

        const usdValue = value * conversions[from]

        const convertedValue = usdValue / conversions[to]

        return convertedValue.toFixed(2) + ' ' + to
    }

    return convert
}

export {
    CURRENCIES,
    targetCurrencyState,
    useCurrencyConverter
}