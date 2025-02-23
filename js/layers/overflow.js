addLayer("overflow", {
    symbol: "∞↑",
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new ExpantaNum(0),
		time: n(0),
        bestTimeThisEternity:n(0)
    }},
    update(diff){
        player.overflow.bestTimeThisEternity = player.overflow.bestTimeThisEternity.max(player.m.time)
    },
    prestigeButtonText() { 
        return "继续让点数增量以获得 <b>+" + formatWhole(this.getResetGain()) + `</b> 超限(总计超限:${formatWhole(player.overflow.total)})` + ((this.getResetGain().gte(1)) ? "" : ("<br/>下一个于 " + format(this.getNextAt()) + " 点数"))
    },
    getResetGain() {
     if(player.points.lt(this.requires())) return n(0)
        return n(1)
    },
    getNextAt() {
      
        return this.requires()
    },
    effect1(){
      var root = n(2).pow(player.overflow.total.add(1).pow(0.6).sub(1))
      return root
    },
    effect2(){
      var root = n(2).pow(player.overflow.total.add(1).pow(0.4).sub(1))
      return root
    },
    effectDescription() {
        return `点数变为其 ${format(this.effect1())} 次根<br>元性质变为其 ${format(this.effect2())} 次方`
    },
    color: "red",
    resource: "超限", // Name of prestige currency
    type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    requires(){
      //if(player.mm.total.gte(5)) return n('1.8e308')
      return n('1.798e308')
    },
    baseResource:"点数",
    baseAmount(){return player.points},
    gainMult() {
        mult = new ExpantaNum(1)
        return mult
    },
    gainExp() {
      var exp = n(1)
        return exp
    },
    canReset(){return this.getResetGain().gte(1)},
    row: 3, // Row the layer is in on the tree (0 is the first row)  QwQ:1也可以当第一排
    //layerShown(){return player.v.total.gte(1)},
    unlocked(){return this.getResetGain().gte(1)},
    clickables: {
        11: {
            canClick(){return true},
            display() {return `手机端qol<br>长按以重置`},
            onHold(){doReset(this.layer)}
        },
        /* 12: {
            canClick(){return true},
            display() {return `重置升级`},
            onClick(){
              if(!confirm('您确定要重置升级么?这会进行一次超限!')) return
              player.overflow.upgrades = []
              player.overflow.points = player.overflow.total
              doReset(this.layer,true)
            }
        }, */
    },
    achievements:{
        11:{
            name:'新的起点',
            tooltip:'获得1超限.<br>奖励:你每秒获得100%的元性质.元性质x10.购买元性质购买项不再消耗元性质.解锁元性质挑战11.(元性质挑战不被元元重置)',
            done(){return player.overflow.total.gte(1)&& player.overflow.resetTime>1 && this.unlocked()},
            unlocked(){return true},
        },
        12:{
            name:'弦?',
            tooltip:'获得1e180弦.<br>奖励:解锁弦挑战11.(未解锁仍生效,不被元元重置) 最高弦维度生产速度基于弦一维数量的对数增加.',
            done(){return player.dim.points.gte(1e180) && this.unlocked()},
            unlocked(){return hasAchievement('overflow',11)},
        },
        13:{
            name:'我恨上限...',
            tooltip:'一次重置可以获得e50元性质.<br>奖励:重置获得的元性质与元元总数以极弱的形式加成元性质上限.元元的指数开根锁死于1.06.',
            done(){return layers.m.getResetGain().gte(1e50) && this.unlocked()},
            unlocked(){return hasAchievement('overflow',11)},
            effect(){
                var eff = expPow(player.m.total.div(6.8e38).add(10).log10(),1.5).pow(player.mm.total.add(1).log10().add(1).pow(2))
                if(hasChallenge('mm',11)) eff = eff.pow(challengeEffect('mm',11))
                return eff
            },
        },
        14:{
            name:'打破诅咒',
            tooltip:'完成第六元元.<br>奖励:自动化元性质购买项.',
            done(){return player.mm.total.gt(6) && this.unlocked()},
            unlocked(){return hasAchievement('overflow',11)},
        },
        21:{
            name:'轮回',
            tooltip:'获得2超限.<br>奖励:解锁经验.元性质指数变为其1.1次根(元元开根后)',
            done(){return player.overflow.total.gte(2) && player.overflow.resetTime>1 && this.unlocked()},
            unlocked(){return hasAchievement('overflow',11)},
        },
        22:{
            name:'又一次?',
            tooltip:'获得1元元.<br>奖励:每秒获取10%的元exp.',
            done(){return player.mm.total.gte(1) && this.unlocked()},
            unlocked(){return hasAchievement('overflow',21)},
        },
        23:{
            name:'Level UP!',
            tooltip(){return `经验等级达到25.<br>奖励:超限和元元以一定程度增幅经验系数.(x${format(this.effect())})`},
            done(){return getLevel('exp').gte(25) && this.unlocked()},
            unlocked(){return hasAchievement('overflow',21)},
            effect(){
              var eff = player.overflow.total.gte(4)? player.overflow.total.root(2.5).div(4.2).mul(player.mm.total.mul(2.25).add(10).log10().pow(2)).add(1).pow(1.2)
              : player.overflow.total.div(8).mul(player.mm.total.mul(2.25).add(10).log10().pow(2)).add(1).pow(1.2)
              return eff
            },
        },
        24:{
            name:'元元化元元',
            tooltip(){return `获得3元元.<br>奖励:超限和元元加成元性质挑战11.(^${format(this.effect())}) 解锁元元挑战11.`},
            done(){return player.mm.total.gte(3) && this.unlocked()},
            unlocked(){return hasAchievement('overflow',21)},
            effect(){
              var eff = player.overflow.total.div(1.5).add(player.mm.total.add(1).sqrt())
              if(hasChallenge('mm',11)) eff = eff.add(challengeEffect('mm',11).sub(1))
              eff = eff.div(2).add(0.5)
              return eff
            },
        },
        31:{
            name:'又一个放置游戏?',
            tooltip(){return `获得3超限.<br>奖励:解锁元元的指数开根并使其x1.12,第四元元即开始增长,解锁增量.加速子的时间基于当前元元的时间,而不是当前元性质的时间.`},
            done(){return player.overflow.total.gte(3) && this.unlocked() && player.overflow.resetTime>1},
            unlocked(){return hasAchievement('overflow',21)},
        },
        32:{
            name:'...又一次?',
            tooltip(){return `获得2元元.<br>奖励:增量x的平方根倍增维度倍率,增量点倍增元性质.`},
            done(){return player.mm.total.gte(2) && this.unlocked() && player.overflow.resetTime>1},
            unlocked(){return hasAchievement('overflow',31)},
        },
        33:{
            name:'感受永恒',
            tooltip(){return `达到1e154t.<br>奖励:时间以极低的效率加成增量点和维度.(*${format(this.effect())})`},
            done(){return player.m.time.gte(1e154) && this.unlocked()},
            unlocked(){return hasAchievement('overflow',31)},
            effect(){
              var eff = player.m.time.pow(1/308.2)
              return eff
            },
        },
        34:{
            name:'ErRoR',
            tooltip(){return `完成元超限.<br>奖励:元超限指数加成元性质浓缩.(^${format(this.effect())})`},
            done(){return hasChallenge('mm',11) && this.unlocked()},
            unlocked(){return hasAchievement('overflow',31)},
            effect(){
              var eff = challengeEffect('mm',11).log10().add(1)
              return eff
            },
        },
        41:{
            name:'几次了?',
            tooltip(){return `获得4超限.<br>奖励:以后的每个超限都使得增量点x3.(x${format(this.effect())})`},
            done(){return player.overflow.total.gte(4) && this.unlocked()},
            unlocked(){return hasAchievement('overflow',31)},
            effect(){
              var eff = three.pow(player.overflow.total.sub(3))
              return eff
            },
        },
    },
    /*upgrades:{
        11: {
            title: "<p style='transform: scale(-1, -1)'><alternate>二次加速</alternate>",
            description: `时间速率x10^加速子效果^3.解锁升级12和21.`,
            effect(){
              return n(10).pow(buyableEffect('m',22).pow(3))
            },
            effectDisplay(){
              return `当前效果: x${format(upgradeEffect(this.layer,this.id))}`
            },
            cost: n(1),
            unlocked() { return player[this.layer].points.gte(1) || hasUpgrade(this.layer, this.id) },
        },
    }*/
})