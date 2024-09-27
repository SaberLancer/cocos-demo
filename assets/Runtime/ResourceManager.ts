import { resources, SpriteFrame } from "cc"
import Singleton from "../Base/Singleton"

export default class ResourceManager extends Singleton {

    static get instance() {
        return super.getInstance<ResourceManager>()
    }

    public loadDir(path: string, type: typeof SpriteFrame = SpriteFrame) {
        return new Promise<SpriteFrame[]>((resolve, reject) => {
            resources.loadDir(path, type, (err, assets) => {
                if (err) {
                    reject(err);
                    return
                }
                resolve(assets);
            })
        })
    }
}
