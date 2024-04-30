const asyncIntervals : boolean[] = [];

export const runAsyncInterval = async (cb:Function, interval:number, intervalIndex:number) => {
    await cb();
    if (asyncIntervals[intervalIndex]) {
        setTimeout(() => runAsyncInterval(cb, interval, intervalIndex), interval);
    }
};

export const setAsyncInterval = (cb:Function, interval:number) => {
    if (cb && typeof cb === "function") {
        const intervalIndex = asyncIntervals.length;
        asyncIntervals.push(true);
        runAsyncInterval(cb, interval, intervalIndex);
        return intervalIndex;
    } else {
        throw new Error('setAsyncInterval : Callback must be a function');
    }
};

export const clearAsyncInterval = (intervalIndex:number) => {
    if (asyncIntervals[intervalIndex]) {
        asyncIntervals[intervalIndex] = false;
    }
};