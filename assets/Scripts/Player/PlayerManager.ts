import { _decorator, Component, Node, Sprite, UITransform, Animation, AnimationClip, animation, SpriteFrame, math } from 'cc';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';
import ResourceManager from '../../Runtime/ResourceManager';
import { CONTROLLER_ENUM, DIRECTION_ENUM, DIRECTION_ORIGIN_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM } from '../../Enums';
import EventManager from '../../Runtime/EventManager';
import { PlayerStateMachine } from './PlayerStateMachine';
import { EntityManager } from '../../Base/EntityManager';
import DataManager from '../../Runtime/DataManager';
import { IENTITY } from '../../Levels';
const { ccclass, property } = _decorator;

const ANIMATION_SPEED = 1 / 8

@ccclass('PlayerManager')
export class PlayerManager extends EntityManager {
    TargetX: number = 0
    TargetY: number = 0

    private readonly speed: number = 1 / 10

    isMoving: boolean = false

    async init(params: IENTITY) {
        this.fsm = this.addComponent(PlayerStateMachine)
        await this.fsm.init()
        super.init(params)
        this.TargetX = this.x
        this.TargetY = this.y

        EventManager.instance.on(EVENT_ENUM.PLAYER_CTRL, this.inputHandler, this)
        EventManager.instance.on(EVENT_ENUM.ATTACK_PLAYER, this.onDeath, this)
    }

    protected onDestroy(): void {
        super.onDestroy()
        EventManager.instance.off(EVENT_ENUM.PLAYER_CTRL, this.inputHandler)
        EventManager.instance.off(EVENT_ENUM.ATTACK_PLAYER, this.onDeath)
    }

    protected update(dt: number): void {
        this.updateXY()
        super.update(dt)
    }

    updateXY() {
        if (this.TargetX < this.x) {
            this.x -= this.speed
        } else if (this.TargetX > this.x) {
            this.x += this.speed
        }

        if (this.TargetY < this.y) {
            this.y -= this.speed
        } else if (this.TargetY > this.y) {
            this.y += this.speed
        }

        if (Math.abs(this.x - this.TargetX) < this.speed && Math.abs(this.y - this.TargetY) < this.speed && this.isMoving) {
            this.isMoving = false
            this.x = this.TargetX
            this.y = this.TargetY

            EventManager.instance.emit(EVENT_ENUM.PLAYER_MOVE_END)
        }
    }

    inputHandler(playerDirection: CONTROLLER_ENUM) {
        if (this.isMoving) return
        if (this.state === ENTITY_STATE_ENUM.ATTACK) return
        const id = this.willAttack(playerDirection)
        if (id) {
            EventManager.instance.emit(EVENT_ENUM.ATTACK_ENEMY, id)
            EventManager.instance.emit(EVENT_ENUM.OPEN_DOOR)
            return
        }
        if (this.willblock(playerDirection)) {
            return
        }
        this.move(playerDirection)
    }

    onDeath(type: ENTITY_STATE_ENUM) {
        this.state = type
        EventManager.instance.off(EVENT_ENUM.PLAYER_CTRL, this.inputHandler)
    }

    move(playerDirection: CONTROLLER_ENUM) {
        if (playerDirection === CONTROLLER_ENUM.TOP) {
            this.isMoving = true
            this.TargetY -= 1
        } else if (playerDirection === CONTROLLER_ENUM.BOTTOM) {
            this.isMoving = true
            this.TargetY += 1
        } else if (playerDirection === CONTROLLER_ENUM.LEFT) {
            this.isMoving = true
            this.TargetX -= 1
        } else if (playerDirection === CONTROLLER_ENUM.RIGHT) {
            this.isMoving = true
            this.TargetX += 1
        } else if (playerDirection === CONTROLLER_ENUM.TURNLEFT) {
            if (this.direction === DIRECTION_ENUM.TOP) {
                this.direction = DIRECTION_ENUM.LEFT
            } else if (this.direction === DIRECTION_ENUM.LEFT) {
                this.direction = DIRECTION_ENUM.BOTTOM
            } else if (this.direction === DIRECTION_ENUM.BOTTOM) {
                this.direction = DIRECTION_ENUM.RIGHT
            } else if (this.direction === DIRECTION_ENUM.RIGHT) {
                this.direction = DIRECTION_ENUM.TOP
            }
            this.state = ENTITY_STATE_ENUM.TURNLEFT
            EventManager.instance.emit(EVENT_ENUM.PLAYER_MOVE_END)
        } else if (playerDirection === CONTROLLER_ENUM.TURNRIGHT) {
            if (this.direction === DIRECTION_ENUM.TOP) {
                this.direction = DIRECTION_ENUM.RIGHT
            } else if (this.direction === DIRECTION_ENUM.LEFT) {
                this.direction = DIRECTION_ENUM.TOP
            } else if (this.direction === DIRECTION_ENUM.BOTTOM) {
                this.direction = DIRECTION_ENUM.LEFT
            } else if (this.direction === DIRECTION_ENUM.RIGHT) {
                this.direction = DIRECTION_ENUM.BOTTOM
            }
            this.state = ENTITY_STATE_ENUM.TURNRIGHT
            EventManager.instance.emit(EVENT_ENUM.PLAYER_MOVE_END)
        }
    }

    willAttack(playerDirection: CONTROLLER_ENUM) {
        const enemies = DataManager.instance.enemies.filter((enemy) => enemy.state !== ENTITY_STATE_ENUM.DEATH)
        for (let index = 0; index < enemies.length; index++) {
            const { x: enemyX, y: enemyY, id: enemyId } = enemies[index]
            if (
                playerDirection === CONTROLLER_ENUM.TOP &&
                this.direction === DIRECTION_ENUM.TOP &&
                enemyX === this.x &&
                enemyY === this.y - 2
            ) {
                this.state = ENTITY_STATE_ENUM.ATTACK
                return enemyId
            } else if (
                playerDirection === CONTROLLER_ENUM.BOTTOM &&
                this.direction === DIRECTION_ENUM.BOTTOM &&
                enemyX === this.x &&
                enemyY === this.y + 2
            ) {
                this.state = ENTITY_STATE_ENUM.ATTACK
                return enemyId
            } else if (
                playerDirection === CONTROLLER_ENUM.LEFT &&
                this.direction === DIRECTION_ENUM.LEFT &&
                enemyX === this.x - 2 &&
                enemyY === this.y
            ) {
                this.state = ENTITY_STATE_ENUM.ATTACK
                return enemyId
            } else if (
                playerDirection === CONTROLLER_ENUM.RIGHT &&
                this.direction === DIRECTION_ENUM.RIGHT &&
                enemyX === this.x + 2 &&
                enemyY === this.y
            ) {
                this.state = ENTITY_STATE_ENUM.ATTACK
                return enemyId
            }

        }
        return ''
    }

    willblock(playerDirection: CONTROLLER_ENUM) {
        const { TargetX: x, TargetY: y, direction } = this
        // const { TargetX: x, TargetY: y, direction } = DataManager.instance.player
        const tileInfo = DataManager.instance.tileInfo
        let playerTile
        let weaponTile
        let nextX
        let nextY
        if (playerDirection === CONTROLLER_ENUM.TOP) {
            if (direction === DIRECTION_ENUM.TOP) {
                let playerNextY = y - 1
                let weaponNextY = y - 2

                playerTile = tileInfo[x][playerNextY]
                weaponTile = tileInfo[x][weaponNextY]

            }
            if (direction === DIRECTION_ENUM.BOTTOM) {
                let playerNextY = y - 1
                let weaponNextY = y

                playerTile = tileInfo[x][playerNextY]
                weaponTile = tileInfo[x][weaponNextY]
            }
            if (direction === DIRECTION_ENUM.LEFT) {
                let playerNextY = y - 1
                let weaponNextX = x - 1

                playerTile = tileInfo[x][playerNextY]
                weaponTile = tileInfo[weaponNextX][playerNextY]

            }
            if (direction === DIRECTION_ENUM.RIGHT) {
                let playerNextY = y - 1
                let weaponNextX = x + 1

                playerTile = tileInfo[x][playerNextY]
                weaponTile = tileInfo[weaponNextX][playerNextY]

            }


            if ((playerTile && playerTile.moveable && (!weaponTile || weaponTile.turnable))) {

            } else {
                this.state = ENTITY_STATE_ENUM.BLOCKFRONT
                return true
            }
        } else if (playerDirection === CONTROLLER_ENUM.BOTTOM) {
            if (direction === DIRECTION_ENUM.TOP) {
                let playerNextY = y + 1
                let weaponNextY = y

                playerTile = tileInfo[x][playerNextY]
                weaponTile = tileInfo[x][weaponNextY]

            }
            if (direction === DIRECTION_ENUM.BOTTOM) {
                let playerNextY = y + 1
                let weaponNextY = y + 2

                playerTile = tileInfo[x][playerNextY]
                weaponTile = tileInfo[x][weaponNextY]
            }
            if (direction === DIRECTION_ENUM.LEFT) {
                let playerNextY = y + 1
                let weaponNextX = x - 1

                playerTile = tileInfo[x][playerNextY]
                weaponTile = tileInfo[weaponNextX][playerNextY]

            }
            if (direction === DIRECTION_ENUM.RIGHT) {
                let playerNextY = y + 1
                let weaponNextX = x + 1

                playerTile = tileInfo[x][playerNextY]
                weaponTile = tileInfo[weaponNextX][playerNextY]

            }


            if ((playerTile && playerTile.moveable && (!weaponTile || weaponTile.turnable))) {

            } else {
                this.state = ENTITY_STATE_ENUM.BLOCKFRONT
                return true
            }
        } else if (playerDirection === CONTROLLER_ENUM.LEFT) {
            if (direction === DIRECTION_ENUM.TOP) {
                let playerNextX = x - 1
                let weaponNextY = y - 1

                playerTile = tileInfo[playerNextX][y]
                weaponTile = tileInfo[playerNextX][weaponNextY]

            }
            if (direction === DIRECTION_ENUM.BOTTOM) {
                let playerNextX = x - 1
                let weaponNextY = y + 1

                playerTile = tileInfo[playerNextX][y]
                weaponTile = tileInfo[playerNextX][weaponNextY]
            }
            if (direction === DIRECTION_ENUM.LEFT) {
                let playerNextX = x - 1
                let weaponNextX = x - 2

                playerTile = tileInfo[playerNextX][y]
                weaponTile = tileInfo[weaponNextX][y]

            }
            if (direction === DIRECTION_ENUM.RIGHT) {
                let playerNextX = x - 1
                let weaponNextX = x

                playerTile = tileInfo[playerNextX][y]
                weaponTile = tileInfo[weaponNextX][y]

            }


            if ((playerTile && playerTile.moveable && (!weaponTile || weaponTile.turnable))) {

            } else {
                this.state = ENTITY_STATE_ENUM.BLOCKFRONT
                return true
            }
        } else if (playerDirection === CONTROLLER_ENUM.RIGHT) {
            if (direction === DIRECTION_ENUM.TOP) {
                let playerNextX = x + 1
                let weaponNextY = y - 1

                playerTile = tileInfo[playerNextX][y]
                weaponTile = tileInfo[playerNextX][weaponNextY]

            }

            if (direction === DIRECTION_ENUM.BOTTOM) {
                let playerNextX = x + 1
                let weaponNextY = y + 1

                playerTile = tileInfo[playerNextX][y]
                weaponTile = tileInfo[playerNextX][weaponNextY]

            }

            if (direction === DIRECTION_ENUM.LEFT) {
                let playerNextX = x + 1
                let weaponNextX = x

                playerTile = tileInfo[playerNextX][y]
                weaponTile = tileInfo[weaponNextX][y]

            }

            if (direction === DIRECTION_ENUM.RIGHT) {
                let playerNextX = x + 1
                let weaponNextX = x + 2

                playerTile = tileInfo?.[playerNextX]?.[y]
                weaponTile = tileInfo?.[weaponNextX]?.[y]

            }

            if ((playerTile && playerTile.moveable && (!weaponTile || weaponTile.turnable))) {

            } else {
                this.state = ENTITY_STATE_ENUM.BLOCKFRONT
                return true
            }
        } else if (playerDirection === CONTROLLER_ENUM.TURNLEFT) {
            if (direction === DIRECTION_ENUM.TOP) {
                nextX = x - 1
                nextY = y - 1
            } else if (direction === DIRECTION_ENUM.LEFT) {
                nextX = x - 1
                nextY = y + 1
            } else if (direction === DIRECTION_ENUM.BOTTOM) {
                nextX = x + 1
                nextY = y + 1
            } else if (direction === DIRECTION_ENUM.RIGHT) {
                nextX = x + 1
                nextY = y - 1
            }

            if (
                (!tileInfo[x][nextY] || tileInfo[x][nextY].turnable) &&
                (!tileInfo[nextX][nextY] || tileInfo[nextX][nextY].turnable) &&
                (!tileInfo[nextX][y] || tileInfo[nextX][y].turnable)
            ) { } else {
                this.state = ENTITY_STATE_ENUM.BLOCKTURNLEFT
                return true
            }
        } else if (playerDirection === CONTROLLER_ENUM.TURNRIGHT) {
            if (direction === DIRECTION_ENUM.TOP) {
                nextX = x + 1
                nextY = y - 1
            } else if (direction === DIRECTION_ENUM.LEFT) {
                nextX = x - 1
                nextY = y - 1
            } else if (direction === DIRECTION_ENUM.BOTTOM) {
                nextX = x - 1
                nextY = y + 1
            } else if (direction === DIRECTION_ENUM.RIGHT) {
                nextX = x + 1
                nextY = y + 1
            }

            if (
                (!tileInfo[x][nextY] || tileInfo[x][nextY].turnable) &&
                (!tileInfo[nextX][nextY] || tileInfo[nextX][nextY].turnable) &&
                (!tileInfo[nextX][y] || tileInfo[nextX][y].turnable)
            ) { } else {
                this.state = ENTITY_STATE_ENUM.BLOCKTURNLEFT
                return true
            }
        }

        return false
    }
}

