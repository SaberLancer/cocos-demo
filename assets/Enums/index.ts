export enum TILE_TYPE_ENUM {
    WALL_ROW = 'WALL_ROW',
    WALL_COLUMN = 'WALL_COLUMN',
    WALL_LEFT_TOP = 'WALL_LEFT_TOP',
    WALL_RIGHT_TOP = 'WALL_RIGHT_TOP',
    WALL_LEFT_BOTTOM = 'WALL_LEFT_BOTTOM',
    WALL_RIGHT_BOTTOM = 'WALL_RIGHT_BOTTOM',
    CLIFF_LEFT = 'CLIFF_ROW_START',
    CLIFF_CENTER = 'CLIFF_ROW_CENTER',
    CLIFF_RIGHT = 'CLIFF_ROW_END',
    FLOOR = 'FLOOR',
}

export enum EVENT_ENUM {
    NEXT_LEVEL = 'NEXT_LEVEL',
    PLAYER_CTRL = 'PLAYER_CTRL',
    PLAYER_MOVE_END = 'PLAYER_MOVE_END',
    PLAYER_BORN = 'PLAYER_BORN',
    ATTACK_PLAYER = 'ATTACK_PLAYER',
    ATTACK_ENEMY = 'ATTACK_ENEMY',
    OPEN_DOOR = 'OPEN_DOOR',
    SHOW_SMOKE = 'SHOW_SMOKE',
    RECORD_STEP = 'RECORD_STEP',
    REVOKE_STEP = 'REVOKE_STEP',
    RESET_LEVEL = 'RESET_LEVEL',
    OUT_BATTLE = 'OUT_BATTLE',
}

export enum CONTROLLER_ENUM {
    TOP = 'TOP',
    BOTTOM = 'BOTTOM',
    LEFT = 'LEFT',
    RIGHT = 'RIGHT',
    TURNLEFT = 'TURNLEFT',
    TURNRIGHT = 'TURNRIGHT'
}

export enum FSM_PARAM_TYPE_ENUM {
    TRIGGER = 'TRIGGER',
    NUMBER = 'NUMBER'
}

export enum PARAMS_NAME_ENUM {
    IDLE = 'IDLE',
    TURNLEFT = 'TURNLEFT',
    TURNRIGHT = 'TURNRIGHT',
    DIRECTION = 'DIRECTION',
    BLOCKFRONT = 'BLOCKFRONT',
    BLOCKTURNLEFT = 'BLOCKTURNLEFT',
    ATTACK = 'ATTACK',
    DEATH = 'DEATH',
    AIRDEATH = 'AIRDEATH',
}

export enum DIRECTION_ENUM {
    TOP = 'TOP',
    BOTTOM = 'BOTTOM',
    LEFT = 'LEFT',
    RIGHT = 'RIGHT'
}

export enum ENTITY_STATE_ENUM {
    IDLE = 'IDLE',
    TURNLEFT = 'TURNLEFT',
    TURNRIGHT = 'TURNRIGHT',
    BLOCKFRONT = 'BLOCKFRONT',
    BLOCKTURNLEFT = 'BLOCKTURNLEFT',
    ATTACK = 'ATTACK',
    DEATH = 'DEATH',
    AIRDEATH = 'AIRDEATH',
}

export enum DIRECTION_ORIGIN_ENUM {
    TOP = 0,
    BOTTOM = 1,
    LEFT = 2,
    RIGHT = 3
}

export enum ENTITY_TYPE_ENUM {
    PLAYER = 'PLAYER',
    SKELETON_WOODEN = 'SKELETON_WOODEN',
    SKELETON_IRON = 'SKELETON_IRON',
    SPIKES = 'SPIKES',
    BURST = 'BURST',
    DOOR = 'DOOR',
    WALL = 'WALL',
    SMOKE = 'SMOKE',
    SPIKES_ONE = 'SPIKES_ONE',
    SPIKES_TWO = 'SPIKES_TWO',
    SPIKES_THREE = 'SPIKES_THREE',
    SPIKES_FOUR = 'SPIKES_FOUR'
}

export enum SCENE_ENUM {
    Start = 'Start',
    Battle = 'Battle',
    Loading = 'Loading'
}
