import Singleton from "../Base/Singleton"

interface Iitem {
    func: Function,
    ctx?: any
}

export default class EventManager extends Singleton {

    static get instance() {
        return super.getInstance<EventManager>()
    }

    private eventDic: Map<string, Array<Iitem>> = new Map()

    on(key: string, func: Function, ctx?: any) {
        if (!this.eventDic.has(key)) {
            this.eventDic.set(key, [])
        }
        this.eventDic.get(key).push({ func, ctx })
    }

    off(key: string, func: Function) {
        if (this.eventDic.has(key)) {
            const index = this.eventDic.get(key).findIndex((item: Iitem) => item.func === func)
            index > -1 && this.eventDic.get(key).splice(index, 1)
        }
    }

    emit(key: string, ...args: any[]) {
        if (this.eventDic.has(key)) {
            this.eventDic.get(key).forEach((item: Iitem) => {
                item.ctx ? item.func.apply(item.ctx, args) : item.func(...args)
            })
        }
    }

    clear() {
        this.eventDic.clear()
    }
}
