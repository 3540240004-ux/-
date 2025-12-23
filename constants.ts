
import { GameStage, LevelData, Bird } from './types';

export const INITIAL_STATE = {
  stage: GameStage.START,
  budget: 5000,
  satisfaction: 80,
  birdSaved: 0,
  birdDeaths: 0,
  isBirdView: false,
  unlockedBirds: [],
};

export const BIRDS: Record<string, Bird> = {
  'oriental-stork': {
    id: 'oriental-stork',
    name: '东方白鹳',
    scientificName: 'Ciconia boyciana',
    description: '大型涉禽，全球濒危物种。喜欢在高处筑巢，极易受电线干扰。',
    rarity: 'Endangered',
    image: 'https://picsum.photos/seed/stork/300/200'
  },
  'fairy-pitta': {
    id: 'fairy-pitta',
    name: '仙八色鸫',
    scientificName: 'Pitta nympha',
    description: '色彩极其艳丽的林候鸟。由于飞行路径低，常因镜面反射撞向大楼。',
    rarity: 'Rare',
    image: 'https://picsum.photos/seed/pitta/300/200'
  },
  'bluethroat': {
    id: 'bluethroat',
    name: '蓝喉歌鸲',
    scientificName: 'Luscinia svecica',
    description: '喉部具有醒目的蓝色。夜间迁徙，极易受光污染误导。',
    rarity: 'Common',
    image: 'https://picsum.photos/seed/bird3/300/200'
  }
};

export const LEVELS: Partial<Record<GameStage, LevelData>> = {
  [GameStage.MORNING]: {
    id: GameStage.MORNING,
    name: '幻影迷局',
    problem: 'CBD玻璃幕墙导致鸟撞',
    scenario: '这是一个由镜面玻璃幕墙组成的CBD商业区。旁边就是一个绿意盎然的公园。鸟类看到玻璃里的树木反射，全速撞向大楼。',
    choices: [
      {
        id: 'A',
        title: '挂稻草人与风铃',
        description: '在窗外布置传统驱鸟工具。',
        cost: 200,
        satisfactionChange: -5,
        successRate: 0.1,
        isCorrect: false,
        feedback: '失败。高空鸟类看不见，且习惯后无效。鸟撞率极高。'
      },
      {
        id: 'B',
        title: '更换为水泥墙',
        description: '拆除玻璃，彻底消除反射。',
        cost: 4000,
        satisfactionChange: -50,
        successRate: 1.0,
        isCorrect: false,
        feedback: '失败。市民对采光极度不满，预算几乎耗尽。'
      },
      {
        id: 'C',
        title: '防鸟撞贴纸 (5x10规则)',
        description: '布置间距不大于手掌的波点矩阵。',
        cost: 1500,
        satisfactionChange: -5,
        successRate: 0.95,
        isCorrect: true,
        feedback: '成功！鸟类在飞近时注意到了图案，一个华丽侧身避开了大楼。'
      }
    ]
  },
  [GameStage.NOON]: {
    id: GameStage.NOON,
    name: '光之陷阱',
    problem: '光污染导致夜间迁徙迷失',
    scenario: '夜晚城市灯火通明，景观探照灯照亮夜空。候鸟利用星光导航，强光让它们迷失方向，不停盘旋直到力竭。',
    choices: [
      {
        id: 'A',
        title: '增加照明',
        description: '照亮鸟儿飞行的路。',
        cost: 500,
        satisfactionChange: 10,
        successRate: 0.05,
        isCorrect: false,
        feedback: '惨败。更多鸟被吸引过来，引发群体撞击。'
      },
      {
        id: 'B',
        title: '防空警报驱赶',
        description: '用巨大的噪音吓跑鸟群。',
        cost: 100,
        satisfactionChange: -30,
        successRate: 0.2,
        isCorrect: false,
        feedback: '失败。噪音污染严重，且惊吓导致鸟类乱飞撞墙。'
      },
      {
        id: 'C',
        title: '熄灯计划与光源改造',
        description: '关闭装饰灯，路灯加装遮光罩，改为暖黄光。',
        cost: 800,
        satisfactionChange: -10,
        successRate: 0.9,
        isCorrect: true,
        feedback: '成功！混乱的鸟群重新找到了星光，排成“人”字形飞向远方。'
      }
    ]
  },
  [GameStage.NIGHT]: {
    id: GameStage.NIGHT,
    name: '空中罗网',
    problem: '杂物、风筝线与无人机',
    scenario: '湿地公园上方布满高压线。这里还有乱飞的无人机和挂在树梢的废弃风筝线。',
    choices: [
      {
        id: 'A',
        title: '网兜接力',
        description: '派人拿着网兜在空中尝试接住鸟。',
        cost: 2000,
        satisfactionChange: 5,
        successRate: 0.01,
        isCorrect: false,
        feedback: '滑稽且失败。效率极低，反而干扰鸟类。'
      },
      {
        id: 'B',
        title: '禁止人类进入',
        description: '彻底封锁公园。',
        cost: 500,
        satisfactionChange: -60,
        successRate: 0.7,
        isCorrect: false,
        feedback: '部分有效，但引发市民大规模抗议。'
      },
      {
        id: 'C',
        title: '设施可视化与空域管理',
        description: '挂驱鸟彩球，清理风筝线，设立无人机禁飞区。',
        cost: 600,
        satisfactionChange: -5,
        successRate: 0.98,
        isCorrect: true,
        feedback: '成功！鸟类远远看到了标记，提升飞行高度越过了障碍。'
      }
    ]
  }
};
