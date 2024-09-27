import Singleton from "../Base/Singleton"
import { ITile } from "../Levels"
import { TileManager } from "../Scripts/Tile/TileManager"

export default class DataManager extends Singleton {

    static get instance() {
        return super.getInstance<DataManager>()
    }

    mapInfo: Array<Array<ITile>>
    mapRowCount: number = 0
    mapColumnCount: number = 0
    levelIndex: number = 1

    tileInfo: Array<Array<TileManager>> = []

    reset() {
        this.mapInfo = []
        this.mapRowCount = 0
        this.mapColumnCount = 0
    }
}
