import { EnemyManager } from "../Base/EnemyManager"
import Singleton from "../Base/Singleton"
import { ILevel, ITile } from "../Levels"
import { BurstManager } from "../Scripts/Burst/BurstManager"
import { DoorManager } from "../Scripts/Door/DoorManager"
import { PlayerManager } from "../Scripts/Player/PlayerManager"
import { SmokeManager } from "../Scripts/Smoke/SmokeManager"
import { TileManager } from "../Scripts/Tile/TileManager"

export type IRecords = Omit<ILevel, 'mapInfo'>

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

    bursts: Array<BurstManager> = []
    smokes: Array<SmokeManager> = []

    door: DoorManager

    records: IRecords[] = []

    reset() {
        this.mapInfo = []
        this.mapRowCount = 0
        this.mapColumnCount = 0
        this.tileInfo = []
        this.player = null
        this.enemies = []
        this.smokes = []
        this.bursts = []
        this.door = null
        this.records = []
    }
}
