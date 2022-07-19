import { useState } from "react"

const useReset = () => {
    const [resetCount, setResetCount] = useState(0)

    const reset = () => {
        setResetCount(currentCount => currentCount + 1)
    }
    const resetHandler = {key: resetCount}
    return [reset, resetHandler]
}

export {
    useReset
}