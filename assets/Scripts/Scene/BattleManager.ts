import { _decorator, Component, Node } from 'cc';
import { TileMapManager } from '../Tile/TileMapManager';
import { createUINode } from '../../Utils';
import Levels, { ILevel } from '../../Levels';
import DataManager from '../../Runtime/DataManager';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';
import EventManager from '../../Runtime/EventManager';
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from '../../Enums';
import { PlayerManager } from '../Player/PlayerManager';
import { WoodenSkeletonManager } from '../WoodenSkeleton/WoodenSkeletonManager';
import { DoorManager } from '../Door/DoorManager';
import { IronSkeletonManager } from '../IronSkeleton/IronSkeletonManager';
import { BurstManager } from '../Burst/BurstManager';
const { ccclass, property } = _decorator;

@ccclass('BattleManager')
export class BattleManager extends Component {
    level: ILevel
    stage: Node

    onLoad() {
        // DataManager.instance.levelIndex = 2
        EventManager.instance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this)
        EventManager.instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.checkArrived, this)
    }

    onDestroy() {
        super.onDestroy()
        EventManager.instance.off(EVENT_ENUM.NEXT_LEVEL, this.nextLevel)
        EventManager.instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.checkArrived)
    }

    start() {
        this.generateStage()
        this.initLevel();
    }

    async initLevel() {
        const level = Levels[`level${DataManager.instance.levelIndex}`]

        if (level) {
            this.clearLevel()

            this.level = level

            DataManager.instance.mapInfo = level.mapInfo;
            DataManager.instance.mapRowCount = level.mapInfo.length;
            DataManager.instance.mapColumnCount = level.mapInfo[0].length;

            this.generateMap();
            // this.generateBurst()
            this.generateDoor();
            this.generateEnemies()
            this.generatePlayer()
        }
    }

    nextLevel() {
        DataManager.instance.levelIndex++
        this.initLevel()
    }

    clearLevel() {
        this.stage.destroyAllChildren();
        DataManager.instance.reset()
    }

    generateStage() {
        this.stage = createUINode();
        this.stage.parent = this.node;
    }

    async generateMap() {
        const tileMap = createUINode();
        tileMap.parent = this.stage;
        const tileMapManager = tileMap.addComponent(TileMapManager);
        await tileMapManager.init();

        this.adaptPos()
    }

    async generateDoor() {
        const door = createUINode();
        door.parent = this.stage;
        const doorManager = door.addComponent(DoorManager);
        await doorManager.init(this.level.door);
        DataManager.instance.door = doorManager
    }

    async generateBurst() {
        const bursts = this.level.bursts
        let promises = []
        for (let index = 0; index < bursts.length; index++) {
            const burst = bursts[index];

            const node = createUINode();
            node.parent = this.stage;
            const burstManager = node.addComponent(BurstManager)
            promises.push(burstManager.init(burst))
            DataManager.instance.bursts.push(burstManager)

        }
        await Promise.all(promises)
    }

    async generatePlayer() {
        const player = createUINode();
        player.parent = this.stage;
        const playerManager = player.addComponent(PlayerManager)
        await playerManager.init(this.level.player);
        DataManager.instance.player = playerManager
        EventManager.instance.emit(EVENT_ENUM.PLAYER_BORN, true)
    }

    async generateEnemies() {
        const enemies = this.level.enemies
        let promises = []
        for (let index = 0; index < enemies.length; index++) {
            const enemy = enemies[index];

            const node = createUINode();
            node.parent = this.stage;
            const Manager = enemy.type === ENTITY_TYPE_ENUM.SKELETON_WOODEN ? WoodenSkeletonManager : IronSkeletonManager
            const manager = node.addComponent(Manager)
            promises.push(manager.init(enemy))
            DataManager.instance.enemies.push(manager)

        }
        await Promise.all(promises)
    }

    checkArrived() {
        if (!DataManager.instance.player) return
        const { x: playerX, y: playerY } = DataManager.instance.player
        const { x: doorX, y: doorY, state: doorState } = DataManager.instance.door

        if (playerX === doorX && playerY === doorY && doorState === ENTITY_STATE_ENUM.DEATH) {
            EventManager.instance.emit(EVENT_ENUM.NEXT_LEVEL)
        }
    }

    adaptPos() {

        const { mapRowCount, mapColumnCount } = DataManager.instance

        const disX = mapColumnCount * TILE_WIDTH / 2
        const disY = mapRowCount * TILE_HEIGHT / 2 + 80

        this.stage.setPosition(-disX, disY)
    }
}

