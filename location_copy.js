// 地点配置
const locations = [
    {
        name: '村庄',
        descriptions: [
            '一个宁静的小村庄，可以在此休息。',
            '村民们看起来友好，这里应该很安全。',
            '村庄里有一个集市，或许可以获取物资。',
            '这个村庄位于森林边缘，风景优美。'
        ],
        // 该地点特殊卡牌描述
        specialCardDescriptions: {
            clue: {
                hunger21: '村民谈论的食物来源',
                fatigue21: '村民提到的安全住所',
                dishonor21: '村民对你的看法变化',
                default: '村庄中的重要信息'
            },
            trace: {
                hungerBust: '在村庄觅食被发现',
                fatigueBust: '村民注意到你的异常行为',
                dishonorBust: '村里流传的你的恶名',
                default: '村庄中暴露的行踪'
            }
        },
        actions: [
            {
                name: '借宿在村民家中',
                description: '村民愿意让你在他们家过夜，并提供一些食物。',
                damageTypes: { hunger: true, fatigue: false, dishonor: false },
                cardDescriptions: {
                    hunger: '村民分享的食物',
                    fatigue: '舒适的休息',
                    dishonor: '友好的帮助'
                }
            },
            {
                name: '偷窃村民的生活补给',
                description: '趁夜色掩护，你悄悄潜入一户人家偷取食物。',
                damageTypes: { hunger: true, fatigue: false, dishonor: true },
                cardDescriptions: {
                    hunger: '偷来的补给',
                    fatigue: '紧张的行动',
                    dishonor: '行窃的恶名'
                }
            },
            {
                name: '在马厩凑活一夜',
                description: '你在马厩找了个角落过夜，虽然不舒适但不用花钱。',
                damageTypes: { hunger: true, fatigue: false, dishonor: false },
                cardDescriptions: {
                    hunger: '简陋的口粮',
                    fatigue: '不适的睡眠',
                    dishonor: '节省的生存'
                }
            },
            {
                name: '帮助村民干活换取食物',
                description: '你主动提出帮村民干些农活，换取了一些食物。',
                damageTypes: { hunger: true, fatigue: true, dishonor: false },
                cardDescriptions: {
                    hunger: '劳动所得食物',
                    fatigue: '劳作的疲惫',
                    dishonor: '诚实的工作'
                }
            }
        ]
    },
    {
        name: '荒野',
        descriptions: [
            '一片广阔的荒野，可能有猎物。',
            '这里地势开阔，视野良好，但资源稀缺。',
            '荒野中似乎隐藏着危险，但或许也有收获。',
            '这片荒野人迹罕至，很适合隐藏行踪。'
        ],
        // 该地点特殊卡牌描述
        specialCardDescriptions: {
            clue: {
                hunger21: '野外动物的活动痕迹',
                fatigue21: '发现隐蔽的露营地点',
                dishonor21: '旅行者的记号和标识',
                default: '荒野中的重要发现'
            },
            trace: {
                hungerBust: '狩猎活动引来关注',
                fatigueBust: '疲惫导致跌倒留下痕迹',
                dishonorBust: '荒野中的争端被目击',
                default: '荒野中留下的行踪'
            }
        },
        actions: [
            {
                name: '狩猎野兔',
                description: '你用简易的陷阱捕获了几只野兔。',
                damageTypes: { hunger: true, fatigue: true, dishonor: false },
                cardDescriptions: {
                    hunger: '新鲜的猎物',
                    fatigue: '狩猎的消耗',
                    dishonor: '野外生存'
                }
            },
            {
                name: '采集野果',
                description: '你在荒野中发现了一些可食用的浆果和蘑菇。',
                damageTypes: { hunger: true, fatigue: false, dishonor: false },
                cardDescriptions: {
                    hunger: '采集的浆果',
                    fatigue: '轻松的采集',
                    dishonor: '自然恩赐'
                }
            },
            {
                name: '露宿荒野',
                description: '你在荒野中找了个隐蔽处过夜，保持高度警惕。',
                damageTypes: { hunger: true, fatigue: true, dishonor: false },
                cardDescriptions: {
                    hunger: '节省的口粮',
                    fatigue: '警惕的疲劳',
                    dishonor: '荒野求生'
                }
            },
            {
                name: '寻找水源',
                description: '你发现了一处清澈的小溪，补充了水分。',
                damageTypes: { hunger: false, fatigue: true, dishonor: false },
                cardDescriptions: {
                    hunger: '清澈的水源',
                    fatigue: '寻水的劳累',
                    dishonor: '基本需求'
                }
            }
        ]
    },
    {
        name: '山洞',
        descriptions: [
            '一个隐蔽的山洞，可以躲避危险。',
            '山洞深处有水源，可以补充水分。',
            '这个山洞似乎曾经有人居住过。',
            '山洞内部阴暗潮湿，但很安全。'
        ],
        // 该地点特殊卡牌描述
        specialCardDescriptions: {
            clue: {
                hunger21: '山洞壁画中的食物信息',
                fatigue21: '山洞深处的栖息处',
                dishonor21: '前人留下的秘密记号',
                default: '山洞中的神秘发现'
            },
            trace: {
                hungerBust: '食物残渣引来动物',
                fatigueBust: '在山洞中迷路留下痕迹',
                dishonorBust: '山洞中的争斗回声',
                default: '山洞中留下的足迹'
            }
        },
        actions: [
            {
                name: '探索山洞深处',
                description: '你小心翼翼地探索了山洞的深处，发现了一些有趣的东西。',
                damageTypes: { hunger: true, fatigue: false, dishonor: false },
                cardDescriptions: {
                    hunger: '发现的物资',
                    fatigue: '谨慎的探索',
                    dishonor: '好奇心驱使'
                }
            },
            {
                name: '在山洞中休息',
                description: '你在山洞中找了个干燥的角落休息，恢复了体力。',
                damageTypes: { hunger: true, fatigue: true, dishonor: false },
                cardDescriptions: {
                    hunger: '山洞中的食物',
                    fatigue: '不适的睡眠',
                    dishonor: '隐蔽的栖身'
                }
            },
            {
                name: '寻找山洞中的水源',
                description: '你在山洞中找到了一处地下水源，补充了水分。',
                damageTypes: { hunger: false, fatigue: true, dishonor: false },
                cardDescriptions: {
                    hunger: '地下水源',
                    fatigue: '探索的辛劳',
                    dishonor: '生存需求'
                }
            },
            {
                name: '搜寻前人留下的物资',
                description: '你发现了一些前人留下的物资，其中有一些还能使用。',
                damageTypes: { hunger: true, fatigue: true, dishonor: true },
                cardDescriptions: {
                    hunger: '前人留下的食物',
                    fatigue: '搜索的辛苦',
                    dishonor: '侵占他人物品'
                }
            }
        ]
    },
    {
        name: '山洞1',
        descriptions: [
            '一个隐蔽的山洞，可以躲避危险。',
            '山洞深处有水源，可以补充水分。',
            '这个山洞似乎曾经有人居住过。',
            '山洞内部阴暗潮湿，但很安全。'
        ],
        // 该地点特殊卡牌描述
        specialCardDescriptions: {
            clue: {
                hunger21: '山洞壁画中的食物信息',
                fatigue21: '山洞深处的栖息处',
                dishonor21: '前人留下的秘密记号',
                default: '山洞中的神秘发现'
            },
            trace: {
                hungerBust: '食物残渣引来动物',
                fatigueBust: '在山洞中迷路留下痕迹',
                dishonorBust: '山洞中的争斗回声',
                default: '山洞中留下的足迹'
            }
        },
        actions: [
            {
                name: '探索山洞深处',
                description: '你小心翼翼地探索了山洞的深处，发现了一些有趣的东西。',
                damageTypes: { hunger: true, fatigue: false, dishonor: false },
                cardDescriptions: {
                    hunger: '发现的物资',
                    fatigue: '谨慎的探索',
                    dishonor: '好奇心驱使'
                }
            },
            {
                name: '在山洞中休息',
                description: '你在山洞中找了个干燥的角落休息，恢复了体力。',
                damageTypes: { hunger: true, fatigue: true, dishonor: false },
                cardDescriptions: {
                    hunger: '山洞中的食物',
                    fatigue: '不适的睡眠',
                    dishonor: '隐蔽的栖身'
                }
            },
            {
                name: '寻找山洞中的水源',
                description: '你在山洞中找到了一处地下水源，补充了水分。',
                damageTypes: { hunger: false, fatigue: true, dishonor: false },
                cardDescriptions: {
                    hunger: '地下水源',
                    fatigue: '探索的辛劳',
                    dishonor: '生存需求'
                }
            },
            {
                name: '搜寻前人留下的物资',
                description: '你发现了一些前人留下的物资，其中有一些还能使用。',
                damageTypes: { hunger: true, fatigue: true, dishonor: true },
                cardDescriptions: {
                    hunger: '前人留下的食物',
                    fatigue: '搜索的辛苦',
                    dishonor: '侵占他人物品'
                }
            }
        ]
    }
];

// 导出地点配置
export default locations;