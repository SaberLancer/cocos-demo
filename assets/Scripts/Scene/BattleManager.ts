import { _decorator, Component, Node } from 'cc';
import { TileMapManager } from '../Tile/TileMapManager';
import { createUINode } from '../../Utils';
import Levels, { ILevel } from '../../Levels';
import DataManager from '../../Runtime/DataManager';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';
import EventManager from '../../Runtime/EventManager';
import { EVENT_ENUM } from '../../Enums';
import { PlayerManager } from '../Player/PlayerManager';
const { ccclass, property } = _decorator;

@ccclass('BattleManager')
export class BattleManager extends Component {
    level: ILevel
    stage: Node

    onLoad() {
        EventManager.instance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this)
    }

    onDestroy() {
        EventManager.instance.off(EVENT_ENUM.NEXT_LEVEL, this.nextLevel)
    }

    start() {
        this.generateStage()
        this.initLevel();
    }

    initLevel() {
        const level = Levels[`level${DataManager.instance.levelIndex}`]

        if (level) {
            this.clearLevel()

            this.level = level

            DataManager.instance.mapInfo = level.mapInfo;
            DataManager.instance.mapRowCount = level.mapInfo.length;
            DataManager.instance.mapColumnCount = level.mapInfo[0].length;

            this.generateMap();
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

    generatePlayer() {
        const player = createUINode();
        player.parent = this.stage;
        const playerManager = player.addComponent(PlayerManager)
        playerManager.init()
    }

    generateMap() {
        const tileMap = createUINode();
        tileMap.parent = this.stage;
        const tileMapManager = tileMap.addComponent(TileMapManager);
        tileMapManager.init();

        this.adaptPos()
    }

    adaptPos() {

        const { mapRowCount, mapColumnCount } = DataManager.instance

        const disX = mapColumnCount * TILE_WIDTH / 2
        const disY = mapRowCount * TILE_HEIGHT / 2 + 80

        this.stage.setPosition(-disX, disY)
    }
}

