import { atom, useRecoilState } from "recoil";
import { ethers, providers } from "ethers";
import { ensProvider } from "./provider";

const ensInfoState = atom({
    key: "ensInfo",
    default: {},
});
const queriesState = atom({
    key: "queries",
    default: [],
});

const cacheExpiration = 1000 * 60 * 2 // 2 minutes

const useEns = () => {
    const [ensInfo, setEnsInfo] = useRecoilState(ensInfoState);
    const [queries, setQueries] = useRecoilState(queriesState);

    const updateEns = async (address) => {
        setQueries([...queries, address]);

        const ensAddress = await ensProvider.lookupAddress(address);

        setEnsInfo((currentEnsInfo) => ({
            ...currentEnsInfo,
            [address]: {
                value: ensAddress,
                expiration: new Date(
                    new Date().getTime() + cacheExpiration
                ),
            },
        }));

        setQueries((currentQueries) =>
            currentQueries.filter((query) => query !== address)
        );

        return ensAddress;
    };

    const addressShouldBeUpdated = (address) => {
        return (
            (!ensInfo[address] ||
                new Date(ensInfo[address].expiration) < new Date()) &&
            !queries.includes(address)
        );
    };

    const invalidateEns = (address) => {
        setEnsInfo((currentEnsInfo) => ({
            ...currentEnsInfo,
            [address]: null,
        }));
    };

    const lookupEns = (address) => {
        if (!address) return address;

        const update = addressShouldBeUpdated(address);

        if (update) {
            // Note: this doesn't block the function's execution
            updateEns(address);
        }

        return ensInfo[address]?.value;
    };

    const lookupEnsAsync = async (address, forceUpdate) => {
        if (!address) return address;

        if (forceUpdate) {
            invalidateEns(address);
        }

        // Note: we still need to check forceUpdate because React doesn't update state until the next render
        const update = addressShouldBeUpdated(address) || forceUpdate;
        let ensAddress = undefined;
        if (update) {
            ensAddress = await updateEns(address);
        } else {
            ensAddress = ensInfo[address]?.value;
        }

        return ensAddress;
    };

    const resolveAsync = async (address) => {
        return await ensProvider.resolveName(address)
    }

    const getAvatarAsync = async (address) => {
        return await ensProvider.getAvatar(address)
    }

    const getTextAsync = async (address, field) => {
        try{
            if (address.startsWith('0x')) {
                address = await lookupEnsAsync(address)
            }
            const resolver = await ensProvider.getResolver(address)
            return await resolver.getText(field)
        } catch (e) {
            console.log(e)
            return null
        }
    }

    return { lookupEns, lookupEnsAsync, invalidateEns, resolveAsync, getAvatarAsync, getTextAsync };
};

export { useEns };
