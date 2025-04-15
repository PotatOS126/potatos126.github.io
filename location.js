// 地点配置
const locations = [
    {
        name: '破败村庄',
        descriptions: [
            '村口的矮墙上布满兵器的凿痕，车辙里的积水中混着些暗红色的泥沙。',
            '田埂上的稻草人歪斜着，身上挂着的破布在风中发出簌簌的响声。',
            '薄雾笼罩着山脚下的小村，几处被烧毁的房屋在雾中露出焦黑的骨架。',
            '村外的小路杂草丛生，盖住了几处简易的坟墓。',
            '寂静的山谷中，一缕稀薄的炊烟从倒塌的房屋间缓缓升起。',
            '寒风穿过几处漏洞的房屋，发出低沉的呼啸。',
            '一条小溪穿过村子里的磨坊，摇摇欲坠的水车下缠满了水草。',
            '羊圈的的围栏倒伏在泥土中，只有一条瘦狗趴在牧羊人的脚边。'
        ],
        // 该地点特殊卡牌描述
        specialCardDescriptions: {
            clue: {
                hunger21: ['分享多余食物得来的情报', '一点余粮换来的有用消息', '饥民得到食物后提供的信息'],
                fatigue21: ['充分的休息', '消除的疲劳', '清晰的思维'],
                dishonor21: ['逼问村民得来的情报', '村民迫于威胁交出的线索', '村民出于恐惧而吐露情报'],
                default: ['村庄中的意外发现']
            },
            trace: {
                hungerBust: ['在村庄附近寻找食物', '驻留在村庄准备口粮', '驻留在村庄搜集补给'],
                fatigueBust: ['在村中恢复体力', '在村中休整', '在村中恢复精神'],
                dishonorBust: ['恶名在坊间流传', '被目睹犯罪', '匆忙逃走的目击证人'],
                default: ['村庄中的意外暴露']
            }
        },
        specialCardDetailDescriptions: {
            clue: {
                hunger21: [
                    '“我们的粮食必须供奉给那位大人，否则他将不再保护我们。”',
                    '“如果停止上供，他的怒火一定会将这里夷为平地。”',
                    '“他们几天前才来过这里，什么都没给我们留下。”',
                    '“他的士兵们在这里驻扎两个星期，胆敢不从他们的人都被吊死了。”',
                    '“有人反对过献祭，可是隔天他就死在了井底。”',
                    '“我曾经也不相信他说的话，但之后连着三个月没有下雨。”',
                    '“大家都病倒了，只能用我们的口粮去换这种药水来治病。”'
                ],
                fatigue21: [
                    '整理了旅途中的见闻，发现了新的线索。',
                    '回顾了过去的疏漏，发现了新的线索。',
                    '回想了曾经的对话，发现了新的线索。'
                    ],
                dishonor21: [
                    '要完成你在做的事情不可能没有牺牲。', 
                    '你所做的一切都是为了将那些非人之物驱逐。', 
                    '比起你的目标，他们的命运无足挂齿。'
                ],
                default: ['得来全不费工夫。']
            },
            trace: {
                hungerBust: [
                    '腹中空空，你又该如何战斗。', 
                    '连肚子都无法填饱，更无法继续前行。', 
                    '腹中的空虚使你难以前进。'
                ],
                fatigueBust: [
                    '你睡得比平时更沉，醒来得也比平时更晚。', 
                    '你的双脚连身体都无法支撑，这样要如何战斗。', 
                    '身后武器的重量似乎要将你压倒。', 
                    '每向前踏出一步，身上的旧伤口都似乎要撕裂开来。'
                ],
                dishonorBust: [
                    '“村里来了一位不速之客......”', 
                    '“他的所作所为与魔鬼无异......”', 
                    '“不敢想象他还会做出什么事情......”'
                ],
                default: ['“我们知道你来了。”']
            }
        },
        actions: [
            {
                name: '在村庄角落入睡',
                description: [
                    '马厩里还有些干草，能够让你息一晚。',
                    '房屋的主人早已逃离，一半的屋顶已经倒塌，但可以帮你遮挡风雨。',
                    '畜棚早已没有动物留下，但里面的草垛能帮助你过夜。',
                    '酒馆内散落着桌椅的碎片，但还有一条长凳没有被当柴火烧掉。'
                ],
                actionType: 'normal', // 填写normal或special
                probability: 90, // 填写概率
                damageTypes: { hunger: 1, fatigue: 0, dishonor: 0 }, // 填写活动后抽牌的牌堆
                itemDrops: [
                    { id: 'nothing', weight: 0 },
                ],
                cardDescriptions: {
                    hunger: [
                        '饥饿感袭来',
                        '没有获取食物'
                    ]
                },
                cardDetailDescriptions: {
                    hunger: [
                        '你只吃了些沿途采来的野果便匆匆睡去。',
                        '你抖了抖干粮袋，却只倒出一些食物残渣。',
                        '有人在这里留下了几颗腐烂的水果。'
                    ]
                }
            },
            // {
            //     name: '普通活动1',
            //     description: [
            //         '普通活动1描述1',
            //         '普通活动1描述2',
            //         '普通活动1描述3',
            //         '普通活动1描述4'
            //     ],
            //     actionType: 'normal', // 填写normal或special
            //     probability: 90, // 填写概率
            //     damageTypes: { hunger: 1, fatigue: 1, dishonor: 1 }, // 填写活动后抽牌的牌堆
            //     itemDrops: [
            //         { id: 'nothing', weight: 0 },
            //         { id: 'nothing', weight: 0 }, 
            //         { id: 'nothing', weight: 0 } 
            //     ],
            //     cardDescriptions: {
            //         hunger: [
            //             '普通活动1创建的饥饿卡牌名称1',
            //             '普通活动1创建的饥饿卡牌名称2',
            //             '普通活动1创建的饥饿卡牌名称3',
            //             '普通活动1创建的饥饿卡牌名称4'
            //         ],
            //         fatigue: [
            //             '普通活动1创建的疲劳卡牌名称1',
            //             '普通活动1创建的疲劳卡牌名称2',
            //             '普通活动1创建的疲劳卡牌名称3',
            //             '普通活动1创建的疲劳卡牌名称4'
            //         ],
            //         dishonor: [
            //             '普通活动1创建的恶名卡牌名称1',
            //             '普通活动1创建的恶名卡牌名称2',
            //             '普通活动1创建的恶名卡牌名称3',
            //             '普通活动1创建的恶名卡牌名称4'
            //         ]
            //     },
            //     cardDetailDescriptions: {
            //         hunger: [
            //             '普通活动1创建的饥饿卡牌描述1',
            //             '普通活动1创建的饥饿卡牌描述2',
            //             '普通活动1创建的饥饿卡牌描述3',
            //             '普通活动1创建的饥饿卡牌描述4'
            //         ],
            //         fatigue: [
            //             '普通活动1创建的疲劳卡牌描述1',
            //             '普通活动1创建的疲劳卡牌描述2',
            //             '普通活动1创建的疲劳卡牌描述3',
            //             '普通活动1创建的疲劳卡牌描述4'
            //         ],
            //         dishonor: [
            //             '普通活动1创建的恶名卡牌描述1',
            //             '普通活动1创建的恶名卡牌描述2',
            //             '普通活动1创建的恶名卡牌描述3',
            //             '普通活动1创建的恶名卡牌描述4'
            //         ]
            //     }
            // },
            {
                name: '藏起食物的村民',
                description: [
                    '你注意到一位村民似乎悄悄往家中搬运了什么东西。',
                    '你注意到一名目光躲闪的男人，似乎在遮掩自己的口袋。',
                    '你注意到一位农妇似乎带着一包东西走进了谷仓。'
                ],
                actionType: 'special', // 填写normal或special
                probability: 20, // 填写概率
                options: [
                    {
                        name: '偷窃村民的食物',
                        description: [
                            '村庄里没有警卫，没人知道你做了什么……',
                            '你只是比他们更需要这些……'
                        ],
                        specialEffects: {
                            clue: 0,
                            trace: 0
                        },
                        damageTypes: { 
                            hunger: 0, 
                            fatigue: 1, 
                            dishonor: 0 
                        },
                        itemDrops: [
                            { id: 'food_ration', weight: 20 },
                            { id: 'nothing', weight: 80 }
                        ],
                        cardDescriptions: {
                            fatigue: [
                                '夜间行动的疲劳',
                                '等待行窃的时机'
                            ]
                        },
                        cardDetailDescriptions: {
                            fatigue: [
                                '你必须等他们入睡后再行窃。',
                                '你在村民家中搜寻了很久才找到一点食物。',
                                '借着夜色的掩护才能行窃。'
                            ]
                        }
                    },
                    {
                        name: '强夺村民的食物',
                        description: [
                            '乱世之中，武力胜过一切……',
                            '就算你不这么做，别人也会来掠夺他们……'
                        ],
                        specialEffects: {
                            clue: 0,
                            trace: 0
                        },
                        damageTypes: { 
                            hunger: 0,
                            fatigue: 0,
                            dishonor: 2
                        },
                        itemDrops: [
                            { id: 'food_ration', weight: 40 },
                            { id: 'nothing', weight: 60 }
                        ],
                        cardDescriptions: {
                            dishonor: [
                                '暴力夺取食物',
                                '强取豪夺'
                            ]
                        },
                        cardDetailDescriptions: {
                            dishonor: [
                                '你夺走了村民赖以生存的口粮。',
                                '他们或许会因此而死。',
                                '一些人在哭喊，另一些在哀嚎。'
                            ]
                        }
                    },
                    // {
                    //     name: '特殊活动1选项1',
                    //     description: [
                    //         '特殊活动1选项1描述1',
                    //         '特殊活动1选项1描述2',
                    //         '特殊活动1选项1描述3',
                    //         '特殊活动1选项1描述4'
                    //     ],
                    //     specialEffects: {
                    //         clue: 1,
                    //         trace: 1
                    //     },
                    //     damageTypes: { 
                    //         hunger: 1, 
                    //         fatigue: 1, 
                    //         dishonor: 1 
                    //     },
                    //     itemDrops: [
                    //         { id: 'map', weight: 100 },
                    //         { id: 'nothing', weight: 0 }
                    //     ],
                    //     cardDescriptions: {
                    //         clue: [
                    //             '特殊活动1选项1创建的线索卡牌名称1',
                    //             '特殊活动1选项1创建的线索卡牌名称2',
                    //             '特殊活动1选项1创建的线索卡牌名称3',
                    //             '特殊活动1选项1创建的线索卡牌名称4'
                    //         ],
                    //         trace: [
                    //             '特殊活动1选项1创建的行踪卡牌名称1',
                    //             '特殊活动1选项1创建的行踪卡牌名称2',
                    //             '特殊活动1选项1创建的行踪卡牌名称3',
                    //             '特殊活动1选项1创建的行踪卡牌名称4'
                    //         ],
                    //         hunger: [
                    //             '特殊活动1选项1创建的饥饿卡牌名称1',
                    //             '特殊活动1选项1创建的饥饿卡牌名称2',
                    //             '特殊活动1选项1创建的饥饿卡牌名称3',
                    //             '特殊活动1选项1创建的饥饿卡牌名称4'
                    //         ],
                    //         fatigue: [
                    //             '特殊活动1选项1创建的疲劳卡牌名称1',
                    //             '特殊活动1选项1创建的疲劳卡牌名称2',
                    //             '特殊活动1选项1创建的疲劳卡牌名称3',
                    //             '特殊活动1选项1创建的疲劳卡牌名称4'
                    //         ],
                    //         dishonor: [
                    //             '特殊活动1选项1创建的恶名卡牌名称1',
                    //             '特殊活动1选项1创建的恶名卡牌名称2',
                    //             '特殊活动1选项1创建的恶名卡牌名称3',
                    //             '特殊活动1选项1创建的恶名卡牌名称4'
                    //         ]
                    //     },
                    //     cardDetailDescriptions: {
                    //         clue: [
                    //             '特殊活动1选项1创建的线索卡牌描述1',
                    //             '特殊活动1选项1创建的线索卡牌描述2',
                    //             '特殊活动1选项1创建的线索卡牌描述3',
                    //             '特殊活动1选项1创建的线索卡牌描述4'
                    //         ],
                    //         trace: [
                    //             '特殊活动1选项1创建的行踪卡牌描述1',
                    //             '特殊活动1选项1创建的行踪卡牌描述2',
                    //             '特殊活动1选项1创建的行踪卡牌描述3',
                    //             '特殊活动1选项1创建的行踪卡牌描述4'
                    //         ],
                    //         hunger: [
                    //             '特殊活动1选项1创建的饥饿卡牌描述1',
                    //             '特殊活动1选项1创建的饥饿卡牌描述2',
                    //             '特殊活动1选项1创建的饥饿卡牌描述3',
                    //             '特殊活动1选项1创建的饥饿卡牌描述4'
                    //         ],
                    //         fatigue: [
                    //             '特殊活动1选项1创建的疲劳卡牌描述1',
                    //             '特殊活动1选项1创建的疲劳卡牌描述2',
                    //             '特殊活动1选项1创建的疲劳卡牌描述3',
                    //             '特殊活动1选项1创建的疲劳卡牌描述4'
                    //         ],
                    //         dishonor: [
                    //             '特殊活动1选项1创建的恶名卡牌描述1',
                    //             '特殊活动1选项1创建的恶名卡牌描述2',
                    //             '特殊活动1选项1创建的恶名卡牌描述3',
                    //             '特殊活动1选项1创建的恶名卡牌描述4'
                    //         ]
                    //     }
                    // }
                ]
            },
            // {
            //     name: '特殊活动1',
            //     description: [
            //         '特殊活动1描述1',
            //         '特殊活动1描述2',
            //         '特殊活动1描述3',
            //         '特殊活动1描述4'
            //     ],
            //     actionType: 'special', // 填写normal或special
            //     probability: 100, // 填写概率
            //     options: [
            //         {
            //             name: '特殊活动1选项1',
            //             description: [
            //                 '特殊活动1选项1描述1',
            //                 '特殊活动1选项1描述2',
            //                 '特殊活动1选项1描述3',
            //                 '特殊活动1选项1描述4'
            //             ],
            //             specialEffects: {
            //                 clue: 1,
            //                 trace: 1
            //             },
            //             damageTypes: { 
            //                 hunger: 1, 
            //                 fatigue: 1, 
            //                 dishonor: 1 
            //             },
            //             itemDrops: [
            //                 { id: 'map', weight: 100 },
            //                 { id: 'nothing', weight: 0 }
            //             ],
            //             cardDescriptions: {
            //                 clue: [
            //                     '特殊活动1选项1创建的线索卡牌名称1',
            //                     '特殊活动1选项1创建的线索卡牌名称2',
            //                     '特殊活动1选项1创建的线索卡牌名称3',
            //                     '特殊活动1选项1创建的线索卡牌名称4'
            //                 ],
            //                 trace: [
            //                     '特殊活动1选项1创建的行踪卡牌名称1',
            //                     '特殊活动1选项1创建的行踪卡牌名称2',
            //                     '特殊活动1选项1创建的行踪卡牌名称3',
            //                     '特殊活动1选项1创建的行踪卡牌名称4'
            //                 ],
            //                 hunger: [
            //                     '特殊活动1选项1创建的饥饿卡牌名称1',
            //                     '特殊活动1选项1创建的饥饿卡牌名称2',
            //                     '特殊活动1选项1创建的饥饿卡牌名称3',
            //                     '特殊活动1选项1创建的饥饿卡牌名称4'
            //                 ],
            //                 fatigue: [
            //                     '特殊活动1选项1创建的疲劳卡牌名称1',
            //                     '特殊活动1选项1创建的疲劳卡牌名称2',
            //                     '特殊活动1选项1创建的疲劳卡牌名称3',
            //                     '特殊活动1选项1创建的疲劳卡牌名称4'
            //                 ],
            //                 dishonor: [
            //                     '特殊活动1选项1创建的恶名卡牌名称1',
            //                     '特殊活动1选项1创建的恶名卡牌名称2',
            //                     '特殊活动1选项1创建的恶名卡牌名称3',
            //                     '特殊活动1选项1创建的恶名卡牌名称4'
            //                 ]
            //             },
            //             cardDetailDescriptions: {
            //                 clue: [
            //                     '特殊活动1选项1创建的线索卡牌描述1',
            //                     '特殊活动1选项1创建的线索卡牌描述2',
            //                     '特殊活动1选项1创建的线索卡牌描述3',
            //                     '特殊活动1选项1创建的线索卡牌描述4'
            //                 ],
            //                 trace: [
            //                     '特殊活动1选项1创建的行踪卡牌描述1',
            //                     '特殊活动1选项1创建的行踪卡牌描述2',
            //                     '特殊活动1选项1创建的行踪卡牌描述3',
            //                     '特殊活动1选项1创建的行踪卡牌描述4'
            //                 ],
            //                 hunger: [
            //                     '特殊活动1选项1创建的饥饿卡牌描述1',
            //                     '特殊活动1选项1创建的饥饿卡牌描述2',
            //                     '特殊活动1选项1创建的饥饿卡牌描述3',
            //                     '特殊活动1选项1创建的饥饿卡牌描述4'
            //                 ],
            //                 fatigue: [
            //                     '特殊活动1选项1创建的疲劳卡牌描述1',
            //                     '特殊活动1选项1创建的疲劳卡牌描述2',
            //                     '特殊活动1选项1创建的疲劳卡牌描述3',
            //                     '特殊活动1选项1创建的疲劳卡牌描述4'
            //                 ],
            //                 dishonor: [
            //                     '特殊活动1选项1创建的恶名卡牌描述1',
            //                     '特殊活动1选项1创建的恶名卡牌描述2',
            //                     '特殊活动1选项1创建的恶名卡牌描述3',
            //                     '特殊活动1选项1创建的恶名卡牌描述4'
            //                 ]
            //             }
            //         }
            //     ]
            // }
        ]
    },
    // {
    //     name: '地点模板',
    //     descriptions: [
    //         '地点描述1',
    //         '地点描述2',
    //         '地点描述3',
    //         '地点描述4'
    //     ],
    //     // 该地点特殊卡牌描述
    //     specialCardDescriptions: {
    //         clue: {
    //             hunger21: ['满足饥饿后的线索卡牌名称1', '满足饥饿后的线索卡牌名称2', '满足饥饿后的线索卡牌名称3', '满足饥饿后的线索卡牌名称4'],
    //             fatigue21: ['满足疲劳后的线索卡牌名称1', '满足疲劳后的线索卡牌名称2', '满足疲劳后的线索卡牌名称3', '满足疲劳后的线索卡牌名称4'],
    //             dishonor21: ['满足恶名后的线索卡牌名称1', '满足恶名后的线索卡牌名称2', '满足恶名后的线索卡牌名称3', '满足恶名后的线索卡牌名称4'],
    //             default: ['其他情况下得到线索卡牌名称1', '其他情况下得到线索卡牌名称2', '其他情况下得到线索卡牌名称3', '其他情况下得到线索卡牌名称4']
    //         },
    //         trace: {
    //             hungerBust: ['饥饿过度后的踪迹卡牌名称1', '饥饿过度后的踪迹卡牌名称2', '饥饿过度后的踪迹卡牌名称3', '饥饿过度后的踪迹卡牌名称4'],
    //             fatigueBust: ['疲劳过度后的踪迹卡牌名称1', '疲劳过度后的踪迹卡牌名称2', '疲劳过度后的踪迹卡牌名称3', '疲劳过度后的踪迹卡牌名称4'],
    //             dishonorBust: ['恶名过度后的踪迹卡牌名称1', '恶名过度后的踪迹卡牌名称2', '恶名过度后的踪迹卡牌名称3', '恶名过度后的踪迹卡牌名称4'],
    //             default: ['其他情况下得到行踪卡牌名称1', '其他情况下得到行踪卡牌名称2', '其他情况下得到行踪卡牌名称3', '其他情况下得到行踪卡牌名称4']
    //         }
    //     },
    //     specialCardDetailDescriptions: {
    //         clue: {
    //             hunger21: ['满足饥饿后的线索卡牌描述1', '满足饥饿后的线索卡牌描述2', '满足饥饿后的线索卡牌描述3', '满足饥饿后的线索卡牌描述4'],
    //             fatigue21: ['满足疲劳后的线索卡牌描述1', '满足疲劳后的线索卡牌描述2', '满足疲劳后的线索卡牌描述3', '满足疲劳后的线索卡牌描述4'],
    //             dishonor21: ['满足恶名后的线索卡牌描述1', '满足恶名后的线索卡牌描述2', '满足恶名后的线索卡牌描述3', '满足恶名后的线索卡牌描述4'],
    //             default: ['其他情况下得到线索卡牌描述1', '其他情况下得到线索卡牌描述2', '其他情况下得到线索卡牌描述3', '其他情况下得到线索卡牌描述4']
    //         },
    //         trace: {
    //             hungerBust: ['饥饿过度后的踪迹卡牌描述1', '饥饿过度后的踪迹卡牌描述2', '饥饿过度后的踪迹卡牌描述3', '饥饿过度后的踪迹卡牌描述4'],
    //             fatigueBust: ['疲劳过度后的踪迹卡牌描述1', '疲劳过度后的踪迹卡牌描述2', '疲劳过度后的踪迹卡牌描述3', '疲劳过度后的踪迹卡牌描述4'],
    //             dishonorBust: ['恶名过度后的踪迹卡牌描述1', '恶名过度后的踪迹卡牌描述2', '恶名过度后的踪迹卡牌描述3', '恶名过度后的踪迹卡牌描述4'],
    //             default: ['其他情况下得到行踪卡牌描述1', '其他情况下得到行踪卡牌描述2', '其他情况下得到行踪卡牌描述3', '其他情况下得到行踪卡牌描述4']
    //         }
    //     },
    //     actions: [
    //         {
    //             name: '普通活动1',
    //             description: [
    //                 '普通活动1描述1',
    //                 '普通活动1描述2',
    //                 '普通活动1描述3',
    //                 '普通活动1描述4'
    //             ],
    //             actionType: 'normal', // 填写normal或special
    //             probability: 90, // 填写概率
    //             damageTypes: { hunger: 1, fatigue: 1, dishonor: 1 }, // 填写活动后抽牌的牌堆
    //             itemDrops: [
    //                 { id: 'nothing', weight: 0 },
    //                 { id: 'nothing', weight: 0 }, 
    //                 { id: 'nothing', weight: 0 } 
    //             ],
    //             cardDescriptions: {
    //                 hunger: [
    //                     '普通活动1创建的饥饿卡牌名称1',
    //                     '普通活动1创建的饥饿卡牌名称2',
    //                     '普通活动1创建的饥饿卡牌名称3',
    //                     '普通活动1创建的饥饿卡牌名称4'
    //                 ],
    //                 fatigue: [
    //                     '普通活动1创建的疲劳卡牌名称1',
    //                     '普通活动1创建的疲劳卡牌名称2',
    //                     '普通活动1创建的疲劳卡牌名称3',
    //                     '普通活动1创建的疲劳卡牌名称4'
    //                 ],
    //                 dishonor: [
    //                     '普通活动1创建的恶名卡牌名称1',
    //                     '普通活动1创建的恶名卡牌名称2',
    //                     '普通活动1创建的恶名卡牌名称3',
    //                     '普通活动1创建的恶名卡牌名称4'
    //                 ]
    //             },
    //             cardDetailDescriptions: {
    //                 hunger: [
    //                     '普通活动1创建的饥饿卡牌描述1',
    //                     '普通活动1创建的饥饿卡牌描述2',
    //                     '普通活动1创建的饥饿卡牌描述3',
    //                     '普通活动1创建的饥饿卡牌描述4'
    //                 ],
    //                 fatigue: [
    //                     '普通活动1创建的疲劳卡牌描述1',
    //                     '普通活动1创建的疲劳卡牌描述2',
    //                     '普通活动1创建的疲劳卡牌描述3',
    //                     '普通活动1创建的疲劳卡牌描述4'
    //                 ],
    //                 dishonor: [
    //                     '普通活动1创建的恶名卡牌描述1',
    //                     '普通活动1创建的恶名卡牌描述2',
    //                     '普通活动1创建的恶名卡牌描述3',
    //                     '普通活动1创建的恶名卡牌描述4'
    //                 ]
    //             }
    //         },
    //         {
    //             name: '特殊活动1',
    //             description: [
    //                 '特殊活动1描述1',
    //                 '特殊活动1描述2',
    //                 '特殊活动1描述3',
    //                 '特殊活动1描述4'
    //             ],
    //             actionType: 'special', // 填写normal或special
    //             probability: 100, // 填写概率
    //             options: [
    //                 {
    //                     name: '特殊活动1选项1',
    //                     description: [
    //                         '特殊活动1选项1描述1',
    //                         '特殊活动1选项1描述2',
    //                         '特殊活动1选项1描述3',
    //                         '特殊活动1选项1描述4'
    //                     ],
    //                     specialEffects: {
    //                         clue: 1,
    //                         trace: 1
    //                     },
    //                     damageTypes: { 
    //                         hunger: 1, 
    //                         fatigue: 1, 
    //                         dishonor: 1 
    //                     },
    //                     itemDrops: [
    //                         { id: 'map', weight: 100 },
    //                         { id: 'nothing', weight: 0 }
    //                     ],
    //                     cardDescriptions: {
    //                         clue: [
    //                             '特殊活动1选项1创建的线索卡牌名称1',
    //                             '特殊活动1选项1创建的线索卡牌名称2',
    //                             '特殊活动1选项1创建的线索卡牌名称3',
    //                             '特殊活动1选项1创建的线索卡牌名称4'
    //                         ],
    //                         trace: [
    //                             '特殊活动1选项1创建的行踪卡牌名称1',
    //                             '特殊活动1选项1创建的行踪卡牌名称2',
    //                             '特殊活动1选项1创建的行踪卡牌名称3',
    //                             '特殊活动1选项1创建的行踪卡牌名称4'
    //                         ],
    //                         hunger: [
    //                             '特殊活动1选项1创建的饥饿卡牌名称1',
    //                             '特殊活动1选项1创建的饥饿卡牌名称2',
    //                             '特殊活动1选项1创建的饥饿卡牌名称3',
    //                             '特殊活动1选项1创建的饥饿卡牌名称4'
    //                         ],
    //                         fatigue: [
    //                             '特殊活动1选项1创建的疲劳卡牌名称1',
    //                             '特殊活动1选项1创建的疲劳卡牌名称2',
    //                             '特殊活动1选项1创建的疲劳卡牌名称3',
    //                             '特殊活动1选项1创建的疲劳卡牌名称4'
    //                         ],
    //                         dishonor: [
    //                             '特殊活动1选项1创建的恶名卡牌名称1',
    //                             '特殊活动1选项1创建的恶名卡牌名称2',
    //                             '特殊活动1选项1创建的恶名卡牌名称3',
    //                             '特殊活动1选项1创建的恶名卡牌名称4'
    //                         ]
    //                     },
    //                     cardDetailDescriptions: {
    //                         clue: [
    //                             '特殊活动1选项1创建的线索卡牌描述1',
    //                             '特殊活动1选项1创建的线索卡牌描述2',
    //                             '特殊活动1选项1创建的线索卡牌描述3',
    //                             '特殊活动1选项1创建的线索卡牌描述4'
    //                         ],
    //                         trace: [
    //                             '特殊活动1选项1创建的行踪卡牌描述1',
    //                             '特殊活动1选项1创建的行踪卡牌描述2',
    //                             '特殊活动1选项1创建的行踪卡牌描述3',
    //                             '特殊活动1选项1创建的行踪卡牌描述4'
    //                         ],
    //                         hunger: [
    //                             '特殊活动1选项1创建的饥饿卡牌描述1',
    //                             '特殊活动1选项1创建的饥饿卡牌描述2',
    //                             '特殊活动1选项1创建的饥饿卡牌描述3',
    //                             '特殊活动1选项1创建的饥饿卡牌描述4'
    //                         ],
    //                         fatigue: [
    //                             '特殊活动1选项1创建的疲劳卡牌描述1',
    //                             '特殊活动1选项1创建的疲劳卡牌描述2',
    //                             '特殊活动1选项1创建的疲劳卡牌描述3',
    //                             '特殊活动1选项1创建的疲劳卡牌描述4'
    //                         ],
    //                         dishonor: [
    //                             '特殊活动1选项1创建的恶名卡牌描述1',
    //                             '特殊活动1选项1创建的恶名卡牌描述2',
    //                             '特殊活动1选项1创建的恶名卡牌描述3',
    //                             '特殊活动1选项1创建的恶名卡牌描述4'
    //                         ]
    //                     }
    //                 }
    //             ]
    //         }
    //     ]
    // }
];

// 导出地点配置
export default locations;