import { EnemyManager } from "../Base/EnemyManager"
import Singleton from "../Base/Singleton"
import { ITile } from "../Levels"
import { PlayerManager } from "../Scripts/Player/PlayerManager"
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

    player: PlayerManager
    enemies: Array<EnemyManager> = []

    reset() {
        this.mapInfo = []
        this.mapRowCount = 0
        this.mapColumnCount = 0
        this.tileInfo = []
        this.player = null
        this.enemies = []
    }
}
