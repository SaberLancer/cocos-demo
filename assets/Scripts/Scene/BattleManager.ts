import { _decorator, Component, director, Node } from 'cc';
import { TileMapManager } from '../Tile/TileMapManager';
import { createUINode } from '../../Utils';
import Levels, { ILevel } from '../../Levels';
import DataManager from '../../Runtime/DataManager';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';
import EventManager from '../../Runtime/EventManager';
import { CONTROLLER_ENUM, DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, SCENE_ENUM } from '../../Enums';
import { PlayerManager } from '../Player/PlayerManager';
import { WoodenSkeletonManager } from '../WoodenSkeleton/WoodenSkeletonManager';
import { DoorManager } from '../Door/DoorManager';
import { IronSkeletonManager } from '../IronSkeleton/IronSkeletonManager';
import { BurstManager } from '../Burst/BurstManager';
import { SmokeManager } from '../Smoke/SmokeManager';
import FadeManager from '../../Runtime/FadeManager';
const { ccclass, property } = _decorator;

@ccclass('BattleManager')
export class BattleManager extends Component {
    level: ILevel
    stage: Node
    private smokeLayer: Node
    private inited: boolean = false

    onLoad() {
        // DataManager.instance.levelIndex = 2
        EventManager.instance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this)
        EventManager.instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.checkArrived, this)
        // EventManager.instance.on(EVENT_ENUM.SHOW_SMOKE, this.generateSmoke, this)
        EventManager.instance.on(EVENT_ENUM.RECORD_STEP, this.record, this)
        EventManager.instance.on(EVENT_ENUM.REVOKE_STEP, this.revoke, this)
        EventManager.instance.on(EVENT_ENUM.RESET_LEVEL, this.initLevel, this)
        EventManager.instance.on(EVENT_ENUM.OUT_BATTLE, this.outBattle, this)
    }

    onDestroy() {
        EventManager.instance.off(EVENT_ENUM.NEXT_LEVEL, this.nextLevel)
        EventManager.instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.checkArrived)
        EventManager.instance.off(EVENT_ENUM.SHOW_SMOKE, this.generateSmoke)
        EventManager.instance.off(EVENT_ENUM.RECORD_STEP, this.record)
        EventManager.instance.off(EVENT_ENUM.REVOKE_STEP, this.revoke)
        EventManager.instance.off(EVENT_ENUM.RESET_LEVEL, this.initLevel)
        EventManager.instance.off(EVENT_ENUM.OUT_BATTLE, this.outBattle)
    }

    start() {
        this.generateStage()
        this.initLevel();
    }

    async initLevel() {
        const level = Levels[`level${DataManager.instance.levelIndex}`]

        if (level) {
            if (this.inited) {
                await FadeManager.instance.fadeIn()
            }
            this.clearLevel()

            this.level = level

            DataManager.instance.mapInfo = level.mapInfo;
            DataManager.instance.mapRowCount = level.mapInfo.length;
            DataManager.instance.mapColumnCount = level.mapInfo[0].length;

            await Promise.all([
                this.generateMap(),
                this.generateSmokeLayer(),
                // this.generateBurst()
                this.generateDoor(),
                this.generateEnemies(),
                this.generatePlayer()
            ])

            await FadeManager.instance.fadeOut()
            this.inited = true
        }
    }

    async outBattle() {
        await FadeManager.instance.fadeIn(300)
        director.loadScene(SCENE_ENUM.Start)
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

    async generateSmokeLayer() {
        this.smokeLayer = createUINode();
        this.smokeLayer.parent = this.stage;
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

    async generateSmoke(type: DIRECTION_ENUM) {
        const smoke = DataManager.instance.smokes.find((smoke) => smoke.state === ENTITY_STATE_ENUM.DEATH)
        const { x: playerX, y: playerY } = DataManager.instance.player
        if (smoke) {
            smoke.x = playerX
            smoke.y = playerY
            smoke.direction = type
            smoke.state = ENTITY_STATE_ENUM.IDLE
            this.node.setPosition(playerX * TILE_WIDTH - 1.5 * TILE_WIDTH, -playerY * TILE_HEIGHT + 1.5 * TILE_HEIGHT)
        } else {
            const smoke = createUINode();
            smoke.parent = this.smokeLayer;
            const smokeManager = smoke.addComponent(SmokeManager)
            await smokeManager.init({
                type: ENTITY_TYPE_ENUM.SMOKE,
                state: ENTITY_STATE_ENUM.IDLE,
                x: playerX,
                y: playerY,
                direction: DIRECTION_ENUM.TOP
            });

            DataManager.instance.smokes.push(smokeManager)
        }
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

    record() {
        const { x: playerX, y: playerY, state: playerState, direction: playerDirection, type: playerType } = DataManager.instance.player
        const { x: doorX, y: doorY, state: doorState, direction: doorDirection, type: doorType } = DataManager.instance.door

        const item = {
            player: {
                x: playerX,
                y: playerY,
                state: playerState === ENTITY_STATE_ENUM.IDLE ||
                    playerState === ENTITY_STATE_ENUM.DEATH ||
                    playerState === ENTITY_STATE_ENUM.AIRDEATH ? playerState : ENTITY_STATE_ENUM.IDLE,
                direction: playerDirection,
                type: playerType
            },
            door: {
                x: doorX,
                y: doorY,
                state: doorState,
                direction: doorDirection,
                type: doorType
            },
            enemies: DataManager.instance.enemies.map((enemy) => {
                return {
                    x: enemy.x,
                    y: enemy.y,
                    state: enemy.state,
                    direction: enemy.direction,
                    type: enemy.type
                }
            }),
            bursts: DataManager.instance.bursts.map((burst) => {
                return {
                    x: burst.x,
                    y: burst.y,
                    state: burst.state,
                    direction: burst.direction,
                    type: burst.type
                }
            })
        }

        DataManager.instance.records.push(item)
    }

    revoke() {
        const item = DataManager.instance.records.pop()

        DataManager.instance.player.x = DataManager.instance.player.TargetX = item.player.x
        DataManager.instance.player.y = DataManager.instance.player.TargetY = item.player.y
        DataManager.instance.player.state = item.player.state
        DataManager.instance.player.direction = item.player.direction
        DataManager.instance.player.type = item.player.type

        DataManager.instance.door.x = item.door.x
        DataManager.instance.door.y = item.door.y
        DataManager.instance.door.state = item.door.state
        DataManager.instance.door.direction = item.door.direction
        DataManager.instance.door.type = item.door.type

        for (let index = 0; index < item.enemies.length; index++) {
            const enemy = item.enemies[index];
            DataManager.instance.enemies[index].x = enemy.x
            DataManager.instance.enemies[index].y = enemy.y
            DataManager.instance.enemies[index].state = enemy.state
            DataManager.instance.enemies[index].direction = enemy.direction
            DataManager.instance.enemies[index].type = enemy.type
        }

        for (let index = 0; index < item.bursts.length; index++) {
            const burst = item.bursts[index];
            DataManager.instance.bursts[index].x = burst.x
            DataManager.instance.bursts[index].y = burst.y
            DataManager.instance.bursts[index].state = burst.state
            DataManager.instance.bursts[index].direction = burst.direction
            DataManager.instance.bursts[index].type = burst.type
        }
    }
}

