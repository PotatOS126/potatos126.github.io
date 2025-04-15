// 道具配置
const items = [
    // 常规道具
    {
        id: 'medkit',
        type: '♥', // 红桃
        value: 5,
        name: '医疗包',
        description: '一个小型急救包，包含基本的医疗用品。使用后可以恢复一定的体力，降低疲劳值。',
        usage: ['fatigue'] // 可用于疲劳牌堆
    },
    {
        id: 'map',
        type: '♠', // 黑桃
        value: 3,
        name: '地图碎片',
        description: '一张破旧的地图碎片，上面标记了某个区域的地形。使用后可以获得关于特定区域的信息，有助于探索。',
        usage: ['clue'] // 可用于线索牌堆
    },
    {
        id: 'food_ration',
        type: '♥', // 红桃
        value: 7,
        name: '食物口粮',
        description: '一包紧急口粮，虽然味道不佳但能提供足够的能量。降低饥饿值，但可能略微增加口渴值。',
        usage: ['hunger'] // 可用于饥饿牌堆
    },
    {
        id: 'disguise_kit',
        type: '♣', // 梅花
        value: 4,
        name: '伪装工具',
        description: '一套简易的伪装工具，可以帮助你改变外貌。使用后暂时降低被识别的风险，减少恶名值。',
        usage: ['dishonor'] // 可用于恶名牌堆
    },
    {
        id: 'lockpick',
        type: '♦', // 方块
        value: 6,
        name: '撬锁工具',
        description: '一套精巧的撬锁工具，对开启锁住的门或箱子很有用。可以打开锁住的容器，但使用时有被发现的风险。',
        usage: ['trace', 'clue'] // 可用于行踪和线索牌堆
    },
    {
        id: 'strange_amulet',
        type: '♠', // 黑桃
        value: 'A', // A可作为1或11
        name: '奇怪的护身符',
        description: '一个造型古怪的护身符，散发着微弱的能量。佩戴时似乎能带来一些神秘的保护效果，但具体作用不明。',
        usage: ['fatigue', 'dishonor'] // 可用于疲劳和恶名牌堆
    },
    {
        id: 'old_journal',
        type: '♣', // 梅花
        value: 'J', // J=10
        name: '破旧的日记',
        description: '一本被时间侵蚀的日记，记录了某人的旅程和发现。阅读后可能获得关于游戏世界的重要线索或背景故事。',
        usage: ['clue'] // 可用于线索牌堆
    }
];

// 调试道具
const debugItems = [
    {
        id: 'debug_test',
        type: '♥', // 填写♠♥♣♦
        value: 'A', // 填写A2345678910JQK
        name: '测试道具',
        description: '测试道具系统的工具。用于验证道具系统是否正常工作。',
        usage: ['hunger', 'fatigue', 'dishonor', 'clue', 'trace'] // 可用于所有牌堆
    },
    {
        id: 'debug_tool',
        type: '♠', // 填写♠♥♣♦
        value: 'K', // 填写A2345678910JQK
        name: '测试工具',
        description: '测试道具系统的工具。用于验证道具系统是否正常工作。',
        usage: ['hunger', 'fatigue', 'dishonor', 'clue', 'trace'] // 可用于所有牌堆
    }
];

// 导出道具配置
export { items, debugItems };
export default items; 